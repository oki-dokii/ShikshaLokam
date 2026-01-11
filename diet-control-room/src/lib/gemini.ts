const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    console.warn("RapidAPI Key or Host not found in .env. AI features will be disabled.");
}

async function callGeminiProxy(contents: { role: string; parts: { text: string }[] }[]) {
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        throw new Error("RapidAPI Credentials missing.");
    }

    const response = await fetch(`https://${RAPIDAPI_HOST}/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-rapidapi-host": RAPIDAPI_HOST,
            "x-rapidapi-key": RAPIDAPI_KEY
        },
        body: JSON.stringify({ contents })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`RapidAPI Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    }

    if (data.result) return data.result;

    throw new Error("Unexpected response structure from AI Proxy");
}

export interface ModuleSummary {
    title: string;
    overview: string;
    keyLearnings: string[];
    practicalSteps: string[];
    estimatedTime: string;
    targetAudience: string;
}

export const summarizeModule = async (moduleTitle: string, moduleDescription: string): Promise<ModuleSummary> => {
    const prompt = `
  You are an educational content expert. Summarize the following training module for rural school teachers in India.
  Make the content clear, practical, and in simple English.

  **Module Title:** ${moduleTitle}
  **Module Description:** ${moduleDescription}

  **Provide a structured summary in JSON format ONLY:**
  {
    "title": "Clear, concise title in English",
    "overview": "A 2-3 sentence overview of what this module covers and why it's important",
    "keyLearnings": ["Learning point 1", "Learning point 2", "Learning point 3", "Learning point 4"],
    "practicalSteps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
    "estimatedTime": "XX minutes",
    "targetAudience": "Who should take this module"
  }
  `;

    try {
        const resultText = await callGeminiProxy([{
            role: "user",
            parts: [{ text: prompt }]
        }]);

        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Module Summarization Error:", error);

        // Fallback for demo
        return {
            title: moduleTitle,
            overview: moduleDescription,
            keyLearnings: [
                "Understanding core concepts",
                "Practical implementation strategies",
                "Assessment methods",
                "Follow-up activities"
            ],
            practicalSteps: [
                "Step 1: Read through the key concepts carefully",
                "Step 2: Plan how to apply these in your classroom",
                "Step 3: Try one technique this week"
            ],
            estimatedTime: "30-45 minutes",
            targetAudience: "All teachers"
        };
    }
};

export const translateAndExplain = async (originalTitle: string, content: string): Promise<{
    englishTitle: string;
    explanation: string;
    actionItems: string[];
}> => {
    const prompt = `
  You are a bilingual education expert (Kannada/English). A teacher training module has the following content:
  
  **Original Title:** ${originalTitle}
  **Content/Description:** ${content}

  Translate and explain this in simple, clear English that any teacher can understand.

  **Return JSON ONLY:**
  {
    "englishTitle": "Translated title in English",
    "explanation": "A clear, 3-4 paragraph explanation of what this module teaches and how teachers can use it in their classrooms",
    "actionItems": ["Action 1", "Action 2", "Action 3"]
  }
  `;

    try {
        const resultText = await callGeminiProxy([{
            role: "user",
            parts: [{ text: prompt }]
        }]);

        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Translation Error:", error);

        return {
            englishTitle: originalTitle,
            explanation: content,
            actionItems: [
                "Review the module content",
                "Identify applicable techniques",
                "Implement in your classroom"
            ]
        };
    }
};

export const generateMicroLesson = async (
    topic: string,
    category: string,
    challengeContext?: string
): Promise<{
    title: string;
    duration: string;
    sections: { heading: string; content: string; type: 'concept' | 'activity' | 'tip' }[];
    quickQuiz: string[];
}> => {
    const prompt = `
  Create a 10-minute micro-lesson for rural school teachers in India.

  **Topic:** ${topic}
  **Category:** ${category}
  ${challengeContext ? `**Teacher's Challenge:** ${challengeContext}` : ''}

  Make it practical, actionable, and suitable for low-resource classrooms.

  **Return JSON ONLY:**
  {
    "title": "Engaging lesson title",
    "duration": "10 mins",
    "sections": [
      { "heading": "What You'll Learn", "content": "...", "type": "concept" },
      { "heading": "Try This Tomorrow", "content": "Step-by-step activity...", "type": "activity" },
      { "heading": "Pro Tip", "content": "A practical classroom hack...", "type": "tip" }
    ],
    "quickQuiz": ["Reflection question 1?", "Reflection question 2?"]
  }
  `;

    try {
        const resultText = await callGeminiProxy([{
            role: "user",
            parts: [{ text: prompt }]
        }]);

        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Micro-lesson Generation Error:", error);

        return {
            title: `Getting Started with ${topic}`,
            duration: "10 mins",
            sections: [
                {
                    heading: "What You'll Learn",
                    content: `This lesson covers the fundamentals of ${topic} and how to apply them in your classroom.`,
                    type: "concept"
                },
                {
                    heading: "Try This Tomorrow",
                    content: "Start with a simple activity: Ask your students one question about what they learned yesterday before starting today's lesson.",
                    type: "activity"
                },
                {
                    heading: "Pro Tip",
                    content: "Keep a small notebook to jot down what works and what doesn't. This will help you improve over time.",
                    type: "tip"
                }
            ],
            quickQuiz: [
                "What is one thing you can try in your classroom tomorrow?",
                "How will you know if it worked?"
            ]
        };
    }
};
