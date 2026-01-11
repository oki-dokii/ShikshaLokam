import { GoogleGenerativeAI } from "@google/generative-ai";

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

// Fallback Key provided by user
const GOOGLE_API_KEY_FALLBACK = "AIzaSyB7ZVtt36jp6jP-1UDqFBvj48tqIpaB55A";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY_FALLBACK);

async function callGeminiProxy(contents: any[], systemInstruction?: string) {
    // 1. Try RapidAPI Proxy First
    if (RAPIDAPI_KEY && RAPIDAPI_HOST) {
        try {
            const body: any = { contents: contents };
            const response = await fetch(`https://${RAPIDAPI_HOST}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-host": RAPIDAPI_HOST,
                    "x-rapidapi-key": RAPIDAPI_KEY
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                // If 429 or other error, throw to trigger fallback
                throw new Error(`RapidAPI Error: ${response.status}`);
            }

            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                return data.candidates[0].content.parts[0].text;
            }
        } catch (error) {
            console.warn("RapidAPI failed, switching to Fallback Key...", error);
        }
    }

    // 2. Fallback to Direct Google API
    try {
        console.warn("Using Fallback Google API Key");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Robust Fallback: Extract text if simple structure to avoid SDK mismatch
        let finalPrompt: string | Array<any> = contents;

        // If contents is [{ role: 'user', parts: [{ text: '...' }] }]
        if (Array.isArray(contents) && contents.length === 1 && contents[0].role === 'user' && contents[0].parts && contents[0].parts[0].text) {
            finalPrompt = contents[0].parts[0].text;
        }

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Fallback API Error:", error);
        throw new Error("Both Primary and Fallback APIs failed.");
    }
}

export const processKnowledgeSnippet = async (text: string) => {
    const prompt = `
    Analyze the following teacher's tacit knowledge update:
    "${text}"

    1. Refine the text to be more concise and professional.
    2. Generate 3-5 relevant hashtags (e.g., #Science, #ClassroomMgmt).
    
    Return the response in this JSON format ONLY:
    {
        "refinedText": "...",
        "tags": ["#Tag1", "#Tag2"]
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
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const processVisualKnowledge = async (base64Image: string, transcript?: string) => {
    const prompt = `
    Analyze this classroom context.
    ${transcript ? `Teacher's Voice Note: "${transcript}"` : ''}
    
    1. Describe the educational "hack" or insight based on the visual ${transcript ? 'and the voice note' : ''}.
    2. Generate 3-5 relevant hashtags.
    
    Return JSON ONLY:
    {
        "refinedText": "...",
        "tags": ["#Tag1", "#Tag2"]
    }
    `;

    // RapidAPI/Gemini usually expects inlineData for images
    const contents = [{
        role: "user",
        parts: [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image.split(',')[1] // Remove header if present
                }
            }
        ]
    }];

    try {
        const resultText = await callGeminiProxy(contents);
        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Vision Error:", error);
        throw error;
    }
};

export const generateTrainingModule = async (topic: string, context: any, specificChallenge?: string) => {
    const prompt = `
    You are an expert Teacher Trainer for rural India. Create a 15-minute micro-learning training module for teachers.

    **Topic:** ${topic}
    **Target Audience Context:** 
    - Region Type: ${context.type}
    - Primary Issue: ${context.primaryIssue}
    - Infrastructure: ${context.infrastructure}
    - Language: ${context.language}
    
    ${specificChallenge ? `
    **CRITICAL ADAPTATION REQUIRED:**
    The user has reported this SPECIFIC LOCAL CHALLENGE: "${specificChallenge}".
    You MUST rewrite all examples, activities, and strategies to directly address this specific scenario.
    ` : ''}

    **Strict Output Format (JSON ONLY):**

    **Strict Output Format (JSON ONLY):**
    {
        "title": "Module Title",
        "duration": "15 mins",
        "objective": "One sentence learning goal",
        "content": [
            {
                "type": "concept",
                "title": "Key Concept",
                "body": "Explanation text..."
            },
            {
                "type": "activity",
                "title": "Classroom Activity",
                "body": "Step-by-step instructions for a low-resource activity..."
            },
            {
                "type": "assessment",
                "title": "Quick Check",
                "questions": ["Q1...", "Q2..."]
            }
        ],
        "resources": ["Resource 1", "Resource 2"]
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
        console.error("Gemini Generation Error:", error);

        // Fallback Mock for Demo Stability
        console.warn("Falling back to simulated module due to API error.");
        return {
            title: `Contextualized Module: ${topic}`,
            duration: "15 mins (Simulated - API Error)",
            objective: `To address ${context.primaryIssue} using locally available resources.`,
            isMock: true,
            content: [
                {
                    type: "concept",
                    title: "Understanding the Core Issue",
                    body: `Specifically in ${context.name}, we observe that ${context.primaryIssue} is affecting learning outcomes. This module focuses on root cause mitigation.`
                },
                {
                    type: "activity",
                    title: "Community-Driven Solution",
                    body: `Engage with parents using the '${context.language}' dialect to build trust. Create a simple feedback loop using WhatsApp or local meetings.`
                },
                {
                    type: "assessment",
                    title: "Knowledge Check",
                    questions: ["How does local context impact this issue?", "Name one immediate strategy you can apply."]
                }
            ],
            resources: ["State Framework 2024", "Cluster-Specific Case Studies"]
        };
    }
};

export const generateReflectionChat = async (history: { role: string, text: string }[], context: any) => {
    // Flatten history into a single script to avoid strict API role alternation issues
    const script = history.map(msg => `${msg.role === 'bot' ? 'Coach' : 'Teacher'}: ${msg.text}`).join('\n');

    const prompt = `
    You are a supportive, friendly Implementation Coach for a rural teacher in India.
    They just finished a training module on: "${context.topic}".
    
    Your Goal: Ask ONE specific, practical question or give specific advice based on the conversation so far.
    - Keep it very short (WhatsApp style).
    - Be encouraging.
    - Do NOT be formal.
    - If the user replies, acknowledge their plan warmly and suggest one small "hack" or tip to make it easier.

    CONVERSATION HISTORY:
    ${script}
    
    Coach: (Respond here)
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        // Remove "Coach: " prefix if the model generates it
        return text.replace(/^Coach:\s*/i, '').trim();
    } catch (error) {
        console.error("Reflection Chat Error:", error);
        return "I'm having trouble connecting right now, but please take a moment to write down one thing you'll try tomorrow!";
    }
};

export const recommendTLM = async (base64Image: string | null, resourceText?: string) => {
    const prompt = `
    Analyze the available resources provided via image and/or text description.
    
    ${resourceText ? `USER DESCRIPTION OF MATERIALS: "${resourceText}"` : ''}
    
    1. **Identify Resources**: List 3-5 low-cost or recyclable materials visible in the image ${resourceText ? 'OR mentioned in the text' : ''}.
    2. **Suggest Activities**: Create 3 specific, educational activities/experiments using ONLY these identified items.
    
    **Strict Output Format (JSON ONLY):**
    {
        "detectedResources": ["Item 1", "Item 2", "Item 3"],
        "activities": [
            {
                "title": "Activity Name",
                "subject": "Subject (Science/Math)",
                "description": "Brief instruction..."
            }
        ]
    }
    `;

    // Visual extraction logic reuse
    const parts: any[] = [{ text: prompt }];

    if (base64Image) {
        parts.push({
            inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(',')[1] // Remove header
            }
        });
    }

    const contents = [{
        role: "user",
        parts: parts
    }];

    try {
        const resultText = await callGeminiProxy(contents);
        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("TLM Recommendation Error:", error);
        // Fallback for demo
        return {
            detectedResources: ["Plastic Bottle", "Water", "Sunlight (Context)"],
            activities: [
                {
                    title: "Refraction of Light",
                    subject: "Science",
                    description: "Fill the bottle with water and place it in sunlight. Observe how it bends light or acts as a magnifying lens."
                },
                {
                    title: "Volume vs. Capacity",
                    subject: "Math",
                    description: "Use the bottle as a standard unit to measure the capacity of other containers (buckets, mugs)."
                },
                {
                    title: "Vibration & Sound",
                    subject: "Physics",
                    description: "Blow across the mouth of the empty vs. half-filled bottle to demonstrate how air column length affects pitch."
                }
            ]
        };
    }
};

export const startSimulation = async (scenario: string) => {
    let personaPrompt = "";

    switch (scenario) {
        case "parent":
            personaPrompt = `
            You are "Rajesh", a concerned and slightly frustrated parent in a rural Indian village.
            Your son, Raju, has been skipping school to help in the fields.
            You value education but are under economic pressure.
            Start the conversation by confronting the teacher (the user) about why they called you to school.
            Keep your response short (under 40 words), conversational, and use simple English mixed with local context.
            `;
            break;
        case "student":
            personaPrompt = `
            You are "Amit", a 14-year-old student who often disrupts class. 
            You are bored because you find the lessons irrelevant to your daily life.
            Start by making a sarcastic comment about why you have to be here.
            Keep it short.
            `;
            break;
        case "colleague":
            personaPrompt = `
            You are "Mrs. Sharma", a senior teacher who believes in traditional rote learning.
            You are skeptical of the user's new active learning methods.
            Start by questioning the noise level in the user's classroom.
            `;
            break;
        default:
            personaPrompt = "You are a helpful assistant.";
    }

    const prompt = `
    ${personaPrompt}
    
    GENERATE THE OPENING LINE ONLY.
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        return { text, personaPrompt };
    } catch (error) {
        console.error("Simulation Start Error:", error);
        return { text: "Hello Teacher, did you call me?", personaPrompt };
    }
};

export const continueSimulation = async (history: { role: string, text: string }[], personaPrompt: string, userReply: string) => {
    const prompt = `
    ${personaPrompt}

    HISTORY:
    ${history.map(h => `${h.role.toUpperCase()}: ${h.text}`).join('\n')}
    USER: ${userReply}

    Respond as your character. 
    - Stay in character.
    - If the teacher (user) shows empathy or good logic, de-escalate slightly.
    - If the teacher is rude or dismissive, escalate.
    - Keep response short (under 50 words).
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        return text;
    } catch (error) {
        console.error("Simulation Continue Error:", error);
        return "I see what you are saying...";
    }
};

export const analyzeStudentPerformance = async (performanceData: string, subject: string, gradeLevel: string) => {
    const prompt = `
    You are an expert pedagogical analyst. Analyze the following student performance data:

    **Subject:** ${subject}
    **Grade Level:** ${gradeLevel}
    **Teacher's Observation:** "${performanceData}"

    1. **Identify Strengths**: What is the student doing well?
    2. **Identify Learning Gaps**: What specific concepts are they struggling with?
    3. **Recommended Actions**: Suggest 2-3 specific, actionable teaching strategies or interventions.

    **Strict Output Format (JSON ONLY):**
    {
        "strengths": ["Strength 1", "Strength 2"],
        "gaps": ["Gap 1", "Gap 2"],
        "actions": ["Start with...", "Use visuals for..."]
    }
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Assessment Error:", error);
        return {
            strengths: ["Participates in class", "Good attendance"],
            gaps: ["Conceptual clarity on basic terms"],
            actions: ["Use more visual aids", "Peer learning sessions"]
        };
    }
};

export const analyzeEngagement = async (sessionData: string) => {
    const prompt = `
    You are an expert in classroom dynamics and student engagement. Analyze the following session description:

    **Teacher's Log:** "${sessionData}"

    1. **Engagement Score**: Estimate a score from 1-10 based on the description.
    2. **Engagement Pattern**: Identify the dominant pattern (e.g., "Passive Listening", "Active Debate", "Disruptive").
    3. **Recommendations**: Suggest 2 quick "energizers" or strategies. **Include a short 1-sentence explanation for each.**

    **Strict Output Format (JSON ONLY):**
    {
        "score": 5,
        "pattern": "Passive Listening",
        "recommendations": [
            { "title": "Think-Pair-Share", "description": "Students think silently for 1 min, pair up to discuss, then share with class." },
            { "title": "Four Corners", "description": "Students move to different corners of the room based on their opinion on a topic." }
        ]
    }
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Engagement Analysis Error:", error);
        return {
            score: 0,
            pattern: "Analysis Failed",
            recommendations: [
                { "title": "Check Internet", "description": "Please check your connection and try again." }
            ]
        };
    }
};
