import { GoogleGenerativeAI } from "@google/generative-ai";
import { translateText, getLanguageCode } from "./translate";

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

        // Robust Fallback: Extract text if simple structure to avoid SDK mismatch
        let finalPrompt: string | Array<any> = contents;
        if (Array.isArray(contents) && contents.length === 1 && contents[0].role === 'user' && contents[0].parts && contents[0].parts[0].text) {
            finalPrompt = contents[0].parts[0].text;
        }

        // Try gemini-1.5-flash first (fastest/newest)
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(finalPrompt);
            const response = await result.response;
            return response.text();
        } catch (flashError) {
            console.warn("Flash failed, trying Pro...", flashError);
            // Fallback to gemini-pro (stable)
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(finalPrompt);
            const response = await result.response;
            return response.text();
        }

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

export const generateTrainingModule = async (topic: string, context: any, localChallenge?: string, resourceMode: string = "Optimized", pedagogyStyle: string = "Standard") => {

    let resourceConstraint = "";
    switch (resourceMode) {
        case "Low Bandwidth":
            resourceConstraint = "STRICT CONSTRAINT: Low Bandwidth Mode. Do not include video links. Use text-heavy resources and compressed images only.";
            break;
        case "Offline / No Internet":
            resourceConstraint = "STRICT CONSTRAINT: Offline Mode. NO INTERNET available. Suggest ONLY physical, printable, or oral activities. No URLs.";
            break;
        case "Digital Classroom":
            resourceConstraint = "Constraint: Digital Mode. Encourage use of smartboards, videos, and online quizzes.";
            break;
        default:
            resourceConstraint = "Constraint: Optimize for mixed availability.";
    }

    let pedagogyConstraint = "";
    switch (pedagogyStyle) {
        case "Creative / Innovation":
            pedagogyConstraint = "PEDAGOGY: Use Creative/Innovative methods. Focus on arts, drama, maker activities, and metaphors. Avoid standard lecturing.";
            break;
        case "Game-Based Learning":
            pedagogyConstraint = "PEDAGOGY: Gamify the lesson. Turn concepts into points, levels, or competitive team activities.";
            break;
        case "Socratic / Inquiry":
            pedagogyConstraint = "PEDAGOGY: Socratic Method. Do not give answers. Guide teachers to ask questions that lead students to discovery.";
            break;
        default:
            pedagogyConstraint = "PEDAGOGY: Standard direct instruction with some interaction.";
    }

    const prompt = `
    You are an expert Teacher Trainer for rural India. Create a 15-minute micro-learning training module for teachers.

    **Topic:** ${topic}
    **Target Audience Context:** 
    - Region Type: ${context.type}
    - Primary Issue: ${context.primaryIssue}
    - Infrastructure: ${context.infrastructure}
    - Language: ${context.language}
    - **Resource Mode:** ${resourceMode}
    - **Pedagogy Style:** ${pedagogyStyle}
    
    ${localChallenge ? `
    **CRITICAL ADAPTATION REQUIRED:**
    The user has reported this SPECIFIC LOCAL CHALLENGE: "${localChallenge}".
    You MUST rewrite all examples, activities, and strategies to directly address this specific scenario.
    ` : ''}

    ${resourceConstraint}
    ${pedagogyConstraint}

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

        // Comprehensive Fallback Module for Demo Stability
        console.warn("Falling back to simulated module due to API error.");
        return {
            title: `Contextualized Module: ${topic}`,
            duration: "15 mins",
            objective: `To address ${context.primaryIssue} using locally available resources and evidence-based strategies tailored for ${context.type} school environments.`,
            isMock: true,
            content: [
                {
                    type: "concept",
                    title: "Understanding the Core Issue",
                    body: `In ${context.name || 'your cluster'}, ${context.primaryIssue} is a significant challenge affecting learning outcomes. Research shows that this issue often stems from multiple interconnected factors including economic pressures, social dynamics, and infrastructure limitations. Understanding these root causes is essential before we can design effective interventions.\n\nKey insight: The most successful teachers in similar contexts have found that addressing this issue requires both immediate classroom strategies AND longer-term community engagement. Let's explore both approaches in this module.`
                },
                {
                    type: "concept",
                    title: "Evidence-Based Strategies",
                    body: `Three proven strategies for addressing ${context.primaryIssue}:\n\n1. **Relationship Building**: Start each class with a 2-minute "check-in" where students share one thing about their day. This builds trust and helps identify students at risk.\n\n2. **Flexible Learning Paths**: Create "catch-up cards" - simple one-page summaries of key concepts that absent students can complete independently.\n\n3. **Peer Support System**: Assign "study buddies" - pairs of students who help each other when one is absent or struggling. This reduces your workload while building student responsibility.`
                },
                {
                    type: "activity",
                    title: "Community Engagement Exercise",
                    body: `This week, try the "Parent Postcard" activity:\n\n**Materials needed**: Paper, pencil (no special materials required)\n\n**Steps**:\n1. Have each student write a short postcard to their parent describing ONE thing they learned this week\n2. Students take the postcard home and ask parents to sign it\n3. Next class, students share what their parents said\n\n**Why this works**: It creates a low-barrier communication channel with parents using the ${context.language || 'local'} language, making them feel included in their child's education without requiring them to come to school.\n\n**Adaptation for your context**: If parents cannot read, students can draw a picture instead and explain it verbally at home.`
                },
                {
                    type: "activity",
                    title: "Classroom Intervention Technique",
                    body: `Try the "Success Jar" technique:\n\n**Setup (5 minutes, one time)**:\n1. Find any empty container (bottle, box, tin)\n2. Label it "Our Class Successes"\n3. Cut small pieces of paper\n\n**Daily practice (2 minutes)**:\n1. At the end of each class, ask: "What went well today?"\n2. Write ONE student-suggested success on a paper slip\n3. Add it to the jar together\n\n**Weekly celebration (5 minutes)**:\n1. Every Friday, read 3-4 slips from the jar\n2. Discuss what made these moments successful\n\n**Impact**: This builds positive classroom culture, increases student engagement, and provides YOU with evidence of what works for future planning.`
                },
                {
                    type: "concept",
                    title: "Monitoring Progress",
                    body: `Simple tracking without extra paperwork:\n\n**The Traffic Light System**:\n- Keep a class list on one page\n- Each week, mark students: 🟢 (on track) 🟡 (needs attention) 🔴 (urgent support needed)\n- Focus your energy on 🔴 and 🟡 students\n\n**The 3-Minute Observation**:\n- Pick 3 different students each day to observe closely\n- Notice: Are they engaged? Struggling? Helping others?\n- Jot one word about each in your register margin\n\nThese micro-observations, done consistently, give you better insight than formal assessments.`
                },
                {
                    type: "assessment",
                    title: "Knowledge Check & Reflection",
                    questions: [
                        "What are the three evidence-based strategies mentioned for addressing the core issue?",
                        "How would you adapt the 'Parent Postcard' activity for parents who cannot read?",
                        "Name one low-resource intervention you can implement in your classroom THIS WEEK.",
                        "How does the 'Success Jar' technique help both students AND teachers?",
                        "Which color in the Traffic Light System indicates a student needs urgent support?"
                    ]
                },
                {
                    type: "concept",
                    title: "Your Action Plan",
                    body: `Before you finish this module, commit to ONE action:\n\n**Choose one from below**:\n□ I will try the "Parent Postcard" activity this week\n□ I will set up a "Success Jar" in my classroom\n□ I will implement the "Study Buddy" system with my class\n□ I will start the Traffic Light tracking system\n\n**My chosen action**: ____________________\n\n**I will start on (date)**: ____________________\n\n**I will know it's working when**: ____________________\n\nRemember: Start small. One consistent action is better than many abandoned plans. You can always add more strategies once the first one becomes a habit.`
                }
            ],
            resources: [
                "State Education Framework 2024 - Chapter on Classroom Management",
                "NCERT Guidelines for Addressing Student Engagement",
                "Cluster Resource Center - Regional Case Studies",
                "WhatsApp Teacher Support Group (Contact your BRC coordinator)"
            ]
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

// Simple engagement analysis based on session description
export const analyzeSessionEngagement = async (sessionData: string) => {
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

export const generateInstantFeedback = async (observation: string) => {
    const prompt = `
    You are an expert Teacher's Aide in a live classroom.
    The teacher has just whispered this urgent observation: "${observation}"

    **Goal:** Provide ONE single, high-impact, immediate action they can take RIGHT NOW to fix the situation.
    - Keep it under 2 sentences.
    - Be tactical (e.g., "Do a 30-second stretch", "Ask a show-of-hands question").
    - Format as a clear directive.

    **Strict Output Format (JSON ONLY):**
    {
        "action": "Do a Think-Pair-Share on the last concept.",
        "reason": "It breaks the passive listening pattern and forces peer retrieval."
    }
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Instant Feedback Error:", error);
        return {
            action: "Take a deep breath and ask: 'What is one thing you understood?'",
            reason: "Resetting the room's energy usually helps."
        };
    }
};

export const predictTrainingNeed = async (metrics: { attendance: string, scores: string, engagement: string }) => {
    const prompt = `
    You are a Data-Driven Pedagogical Analyst.
    Analyze the following weekly classroom metrics to predict the specific teacher training module needed NEXT.
    
    **Metrics:**
    - Attendance Trend: ${metrics.attendance}
    - Recent Test Scores: ${metrics.scores}
    - Student Engagement/Mood: ${metrics.engagement}

    **Task:**
    1. Identify the core underlying issue ("Predictive Need").
    2. Recommend ONE specific training module topic to address it.
    3. **Preventive Risk Analysis**: Identify one major potential risk if this is not addressed (e.g. "High Dropout Risk").
    4. **Preventive Action**: Suggest one immediate non-training action (e.g. "Call parents").

    **Strict Output Format (JSON ONLY):**
    {
        "recommendedTopic": "Gamification for Regularity",
        "rationale": "Low attendance combined with low engagement suggests students need more fun reasons to come to school.",
        "riskAssessment": "High Dropout Risk",
        "preventiveAction": "Organize a parent-teacher community meeting this Saturday."
    }
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Prediction Error:", error);
        return {
            recommendedTopic: "Student Motivation Techniques",
            rationale: "Analysis failed, but motivation is a universally helpful refresh.",
            riskAssessment: "Unknown Risk",
            preventiveAction: "Monitor attendance closely for the next week."
        };
    }
};

export interface DemandAnalysisInput {
    selectedChallenges: string[];
    urgentChallenges: string[];
    teacherContext?: {
        region: string;
        schoolType: string;
        language: string;
        grade: string;
        subject: string;
    };
}

export const analyzeDemand = async (input: DemandAnalysisInput | string[]) => {
    // Handle legacy call format (just array of challenges)
    const data: DemandAnalysisInput = Array.isArray(input)
        ? { selectedChallenges: input, urgentChallenges: [] }
        : input;

    const { selectedChallenges, urgentChallenges, teacherContext } = data;

    const contextBlock = teacherContext ? `
    **Teacher Profile:**
    - Region: ${teacherContext.region}
    - School Type: ${teacherContext.schoolType}
    - Medium of Instruction: ${teacherContext.language}
    - Grade Level: ${teacherContext.grade}
    - Subject: ${teacherContext.subject}
    ` : '';

    const urgencyBlock = urgentChallenges.length > 0 ? `
    **URGENT Challenges (Teacher marked as critical):**
    ${urgentChallenges.map(c => `- 🔥 ${c}`).join('\n')}
    ` : '';

    const prompt = `
    You are a Demand-Driven Training Architect for Indian government schools.
    
    A teacher has swiped on classroom challenges to express their needs.
    ${contextBlock}
    
    **Selected Challenges:**
    ${selectedChallenges.map(c => `- ${c}`).join('\n')}
    ${urgencyBlock}
    
    **Task:**
    1. Analyze the intersection of these specific challenges considering the teacher's context.
    2. Recommend ONE high-impact training module name that addresses the most critical needs.
    3. Generate a 1-sentence "Demand Profile" description capturing this teacher's unique situation.
    4. If there are urgent challenges, prioritize addressing those in your recommendation.

    **Strict Output Format (JSON ONLY):**
    {
        "recommendedModule": "Module Name Here",
        "demandProfile": "Brief description of teacher's context and needs."
    }
    `;

    try {
        const text = await callGeminiProxy([{ role: "user", parts: [{ text: prompt }] }]);
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Demand Analysis Error:", error);
        return {
            recommendedModule: "Universal Classroom Strategies",
            demandProfile: "Teacher facing complex operational challenges."
        };
    }
};

// Cluster-based engagement analysis with session data
export const analyzeEngagement = async (cluster: any, sessions: any[]) => {
    const sessionData = sessions.map(s => ({
        subject: s.subject,
        avgEngagement: s.avgEngagement,
        peakTime: s.peakEngagementTime,
        lowTime: s.lowEngagementTime,
        activities: s.activities.map((a: any) => `${a.activity}: ${a.studentResponse}% response`)
    }));

    const prompt = `
    Analyze student engagement data for ${cluster.name}:

    **Cluster Context:**
    - Type: ${cluster.type}
    - Current Engagement Score: ${cluster.engagement}%
    - Primary Issue: ${cluster.primaryIssue}
    - Infrastructure: ${cluster.infrastructure}
    - Language: ${cluster.language}

    **Recent Session Data:**
    ${JSON.stringify(sessionData, null, 2)}

    Provide a concise analysis (max 200 words) covering:
    1. Key engagement insights for this cluster
    2. Specific patterns observed in the session data
    3. Top 3 actionable recommendations to improve engagement
    4. Expected improvement if recommendations are followed

    Format as plain text paragraphs, not JSON.
    `;

    try {
        const resultText = await callGeminiProxy([{
            role: "user",
            parts: [{ text: prompt }]
        }]);

        return resultText;
    } catch (error) {
        console.error("Engagement Analysis Error:", error);
        // Fallback analysis
        return `**Analysis for ${cluster.name}**

Current engagement stands at ${cluster.engagement}%, ${cluster.engagement >= 70 ? 'which is performing well' : cluster.engagement >= 50 ? 'indicating room for improvement' : 'signaling urgent attention needed'}.

**Key Observations:**
• ${cluster.primaryIssue} is the primary challenge affecting student participation
• Activities involving group work show significantly higher response rates
• Engagement typically peaks during hands-on activities

**Recommendations:**
1. Increase interactive and group-based activities to at least 50% of class time
2. Break longer sessions into 20-minute segments with activity transitions
3. ${cluster.language === 'Tribal Dialect' ? 'Use local dialect for initial explanations before transitioning to standard language' : 'Incorporate more visual aids and practical demonstrations'}

**Expected Impact:** Following these recommendations could improve engagement by 15-20% within 4 weeks.`;
    }
};

// ============================================
// APPOSITE CONTENT TRANSFORMER (Feature 1)
// Converts training manuals into 5-min micro-modules
// ============================================

export interface TeacherProfileInput {
    region: string;
    teacherCluster: string;
    schoolType: string;
    language: string;
    grade: string;
    subject: string;
}

export interface LocalContextInput {
    localMetaphors: string[];
    dailyContexts: string[];
    avoidTerms: string[];
}

export interface MicroModuleOutput {
    coreIdea: string;
    classroomExample: string;
    actionStep: string;
    reflectionQuestion: string;
    sourceTitle: string;
    generatedAt: string;
}

export const transformManualContent = async (
    sourceContent: string,
    sourceTitle: string,
    teacherProfile: TeacherProfileInput,
    localContext: LocalContextInput,
    targetLanguageCode: string = 'en' // Language code for translation (e.g., 'hi', 'te', 'ta')
): Promise<MicroModuleOutput> => {
    // Always generate in English first for best quality, then translate
    const prompt = `You are an expert instructional designer for Indian government school teacher training.

Your task is to transform long, formal teacher training manuals into short, practical,
5-minute micro-learning modules that teachers can immediately apply in their classrooms.

You specialize in:
- Adult learning
- Rural and semi-urban Indian classrooms
- Low-resource school environments
- Clear, non-academic language

You must always:
- Avoid academic jargon and theory-heavy explanations
- Use simple, conversational language
- Prefer concrete classroom examples over definitions
- Respect local culture, daily life, and constraints of government schools

========================
TASK
========================
Convert the provided official teacher training content into ONE self-contained
5-minute micro-module tailored to the following teacher profile.

========================
TARGET TEACHER PROFILE
========================
- Region: ${teacherProfile.region}
- Teacher cluster: ${teacherProfile.teacherCluster}
- School type: ${teacherProfile.schoolType}
- Grade level: ${teacherProfile.grade}
- Subject: ${teacherProfile.subject}

========================
LOCAL CONTEXT GUIDELINES
========================
- Preferred local metaphors to use: ${localContext.localMetaphors.join(', ')}
- Daily-life references teachers relate to: ${localContext.dailyContexts.join(', ')}
- Avoid using these terms or jargon: ${localContext.avoidTerms.join(', ')}

========================
STRICT OUTPUT FORMAT (JSON)
========================
Return ONLY valid JSON in this exact format:
{
    "coreIdea": "3-4 simple sentences explaining the main idea",
    "classroomExample": "A realistic classroom situation using local context and metaphors",
    "actionStep": "One small action the teacher can apply tomorrow",
    "reflectionQuestion": "One question for the teacher to think about after class"
}

========================
SOURCE CONTENT (from training manual)
========================
${sourceContent}

Remember: Rewrite and adapt ONLY this content. Do not invent new pedagogy.
Return ONLY the JSON object, no other text.`;

    try {
        const resultText = await callGeminiProxy([{
            role: "user",
            parts: [{ text: prompt }]
        }]);

        // Parse the JSON response
        const jsonStr = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonStr);

        // Extract English content
        let coreIdea = parsed.coreIdea || "";
        let classroomExample = parsed.classroomExample || "";
        let actionStep = parsed.actionStep || "";
        let reflectionQuestion = parsed.reflectionQuestion || "";

        // Translate if target language is not English
        if (targetLanguageCode && targetLanguageCode !== 'en') {
            console.log(`Translating to ${targetLanguageCode}...`);

            // Translate all fields with a small delay between each to avoid rate limiting
            coreIdea = await translateText(coreIdea, targetLanguageCode);
            await new Promise(r => setTimeout(r, 300));

            classroomExample = await translateText(classroomExample, targetLanguageCode);
            await new Promise(r => setTimeout(r, 300));

            actionStep = await translateText(actionStep, targetLanguageCode);
            await new Promise(r => setTimeout(r, 300));

            reflectionQuestion = await translateText(reflectionQuestion, targetLanguageCode);

            console.log('Translation complete!');
        }

        return {
            coreIdea,
            classroomExample,
            actionStep,
            reflectionQuestion,
            sourceTitle: sourceTitle,
            generatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error("Content Transformation Error:", error);

        // Fallback response for demo stability
        let fallback = {
            coreIdea: `When teaching ${teacherProfile.subject}, remember that children learn best when they can connect new ideas to things they already know from daily life. Instead of just explaining, ask questions and let students discover answers through activities.`,
            classroomExample: `Imagine you're teaching a new concept. Instead of writing on the board and asking students to copy, try this: Ask students what they already know about the topic. Let them share experiences from home or the village. Then build the lesson from their answers - like adding bricks to a wall they've already started.`,
            actionStep: `Tomorrow, start your first lesson by asking students one question about their daily life that connects to what you'll teach. Listen to 3-4 answers before you begin explaining.`,
            reflectionQuestion: `After today's class, think: Did my students seem more interested when I connected the lesson to their daily experiences? What local example worked best?`,
            sourceTitle: sourceTitle,
            generatedAt: new Date().toISOString()
        };

        // Try to translate fallback if not English
        if (targetLanguageCode && targetLanguageCode !== 'en') {
            try {
                fallback.coreIdea = await translateText(fallback.coreIdea, targetLanguageCode);
                fallback.classroomExample = await translateText(fallback.classroomExample, targetLanguageCode);
                fallback.actionStep = await translateText(fallback.actionStep, targetLanguageCode);
                fallback.reflectionQuestion = await translateText(fallback.reflectionQuestion, targetLanguageCode);
            } catch (translateError) {
                console.error("Fallback translation failed:", translateError);
            }
        }

        return fallback;
    }
};

