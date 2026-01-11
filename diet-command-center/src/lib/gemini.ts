// Removed: import { GoogleGenerativeAI } from "@google/generative-ai";

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
    console.warn("RapidAPI Key or Host not found in .env. AI features will be disabled or simulated.");
}

async function callGeminiProxy(contents: any[], systemInstruction?: string) {
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
        throw new Error("RapidAPI Credentials missing.");
    }

    const body: any = {
        contents: contents
    };

    // Some proxies might not support systemInstruction at the top level, 
    // but we'll try standard Gemini format or fallback to prepending logic.
    // For this implementation, we will prepend system instruction to the user prompt 
    // to be safe across different proxy versions.

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
        const errorText = await response.text();
        throw new Error(`RapidAPI Error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Parse response typical of Gemini API
    // { candidates: [ { content: { parts: [ { text: "..." } ] } } ] }
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
    }

    // Fallback for some proxy variations
    if (data.result) return data.result;

    throw new Error("Unexpected response structure from AI Proxy");
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

export const generateTrainingModule = async (topic: string, context: any) => {
    const prompt = `
    You are an expert Teacher Trainer for rural India. Create a 15-minute micro-learning training module for teachers.

    **Topic:** ${topic}
    **Target Audience Context:** 
    - Region Type: ${context.type}
    - Primary Issue: ${context.primaryIssue}
    - Infrastructure: ${context.infrastructure}
    - Language: ${context.language}

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
    const systemPrompt = `
    You are a supportive, friendly Implementation Coach for a rural teacher in India.
    They just finished a training module on: "${context.topic}".
    
    Your Goal: Ask ONE specific, practical question about how they will apply this concept in their classroom tomorrow. 
    - Keep it very short (WhatsApp style).
    - Be encouraging.
    - Do NOT be formal.
    - If the user replies, acknowledge their plan warmly and suggest one small "hack" or tip to make it easier.
    `;

    // Construct format for Gemini API
    const contents = [
        {
            role: "user", // System instructions often work best as the first user message for some proxies
            parts: [{ text: systemPrompt }]
        },
        ...history.map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }))
    ];

    try {
        const resultText = await callGeminiProxy(contents);
        return resultText;
    } catch (error) {
        console.error("Reflection Chat Error:", error);
        return "I'm having trouble connecting right now, but please take a moment to write down one thing you'll try tomorrow!";
    }
};

export const recommendTLM = async (base64Image: string) => {
    const prompt = `
    Analyze this image of a classroom or potential teaching resources.
    
    1. **Identify Resources**: List 3-5 low-cost or recyclable materials visible (e.g., plastic bottles, cardboard, stones, leaves, chalk).
    2. **Suggest Activities**: Create 3 specific, educational activities/experiments using ONLY these found items.
    
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
    const contents = [{
        role: "user",
        parts: [
            { text: prompt },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image.split(',')[1] // Remove header
                }
            }
        ]
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
