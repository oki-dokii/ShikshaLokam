/**
 * DIET Frustration-to-Breakthrough Bot
 * A 24/7 Telegram bot providing immediate, practical solutions for teachers
 * when they face challenges in their classrooms.
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Initialize Telegram Bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

// Store user sessions (for context)
const userSessions = new Map();

// Default teacher context
const DEFAULT_CONTEXT = {
    region: 'Rural India',
    schoolType: 'Government Primary School',
    language: 'Hindi',
    grade: 'Primary (1-5)',
    subject: 'General'
};

// Language options
const LANGUAGES = {
    'en': 'English',
    'hi': 'Hindi (हिंदी)',
    'te': 'Telugu (తెలుగు)',
    'ta': 'Tamil (தமிழ்)',
    'mr': 'Marathi (मराठी)',
    'bn': 'Bengali (বাংলা)',
    'gu': 'Gujarati (ગુજરાતી)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'ml': 'Malayalam (മലയാളം)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'or': 'Odia (ଓଡ଼ିଆ)'
};

/**
 * Generate AI response using the Frustration-to-Breakthrough prompt
 */
async function generateBreakthroughResponse(teacherMessage, context) {
    const prompt = `You are a calm, experienced mentor for Indian government school teachers.

Your role is to support teachers at the exact moment they feel stuck, frustrated,
or overwhelmed in their classroom or professional work.

Teachers contact you during live problems.
Your goal is to help them move from frustration to a small, immediate breakthrough.

You specialize in:
- Real classroom problem-solving
- Government school constraints
- Low-resource, high-stress teaching environments
- Practical pedagogy that works tomorrow, not theory

You must always:
- Be empathetic, reassuring, and respectful
- Normalize teacher frustration (never blame the teacher)
- Give quick, actionable guidance
- Avoid academic language and long explanations
- Focus on what the teacher can do immediately

====================================
TASK
====================================
A teacher is describing a real problem they are facing right now.
Respond with a short, practical solution that helps them regain control
and confidence in their classroom or task.

====================================
TEACHER CONTEXT
====================================
- Region: ${context.region}
- School type: ${context.schoolType}
- Medium of instruction: ${context.language}
- Grade level: ${context.grade}
- Subject: ${context.subject}

====================================
RESPONSE GUIDELINES
====================================
- Language: ${context.language}
- Tone: Calm, supportive, non-judgmental
- Length: Short (Telegram-friendly, under 300 words)
- Assume low time and high stress
- Do NOT use theory or policy language
- Do NOT lecture or over-explain
- Do NOT ask many follow-up questions

====================================
STRICT RESPONSE STRUCTURE
====================================
Follow this structure exactly:

🤝 **I Understand**
(One sentence that shows understanding and emotional validation)

🎯 **The Issue**
(One sentence restating the problem simply)

✅ **Do This Right Now**
(2–3 clear, simple steps the teacher can apply immediately)

💪 **You've Got This**
(One sentence that restores confidence and momentum)

====================================
IMPORTANT BEHAVIOR RULES
====================================
- If the problem is unclear, make a reasonable assumption and proceed
- Prefer simple classroom actions over perfect solutions
- Use familiar classroom language and daily-life references
- Never make the teacher feel inadequate
- Never say "research shows", "pedagogy says", or similar phrases
- Use emojis sparingly to make it WhatsApp/Telegram friendly

====================================
TEACHER MESSAGE
====================================
${teacherMessage}`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);

        // Fallback response
        return `🤝 **I Understand**
I can see this is frustrating, and it's completely normal to feel this way.

🎯 **The Issue**
You're facing a challenging situation that needs immediate attention.

✅ **Do This Right Now**
1. Take a deep breath - you have more control than you think
2. Focus on one small thing you can change in the next 5 minutes
3. Remember: progress, not perfection

💪 **You've Got This**
You've handled difficult situations before, and you'll handle this one too. Every experienced teacher has been exactly where you are right now.

(Note: I'm having a temporary connection issue. Please try again in a moment for a more specific response.)`;
    }
}

/**
 * Get or create user session
 */
function getSession(chatId) {
    if (!userSessions.has(chatId)) {
        userSessions.set(chatId, {
            context: { ...DEFAULT_CONTEXT },
            messageCount: 0,
            lastActivity: Date.now()
        });
    }
    const session = userSessions.get(chatId);
    session.lastActivity = Date.now();
    return session;
}

/**
 * Welcome message
 */
const WELCOME_MESSAGE = `🙏 *नमस्ते! Welcome to DIET Teacher Support Bot*

I'm here to help you whenever you feel stuck or frustrated in your classroom. Whether it's:

• 😤 Students not paying attention
• 📚 Difficult topics to explain
• 👪 Parent problems
• 📋 Administrative stress
• 🎯 Any classroom challenge

Just *type your problem* and I'll give you practical, immediate solutions.

━━━━━━━━━━━━━━━━━━━━
*Quick Commands:*
/help - How to use this bot
/settings - Set your school context
/language - Change response language
━━━━━━━━━━━━━━━━━━━━

*Go ahead, tell me what's troubling you today?* 💭`;

/**
 * Help message
 */
const HELP_MESSAGE = `📖 *How to Use This Bot*

1️⃣ *Just type your problem*
   Example: "Half my class is absent today and I don't know how to proceed with the lesson"

2️⃣ *Be specific if you can*
   Instead of "students are misbehaving", try "3 boys in the back row keep talking during math class"

3️⃣ *I'll respond with:*
   • Understanding of your situation
   • The core issue identified
   • 2-3 immediate actions you can take
   • Encouragement to keep going

━━━━━━━━━━━━━━━━━━━━
*Commands:*
/start - Restart the bot
/settings - Update your school context
/language - Change language for responses
/help - Show this message
━━━━━━━━━━━━━━━━━━━━

*Remember: No question is too small. I'm here 24/7!* 🌙`;

// ===== BOT COMMANDS =====

// /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    getSession(chatId); // Initialize session
    bot.sendMessage(chatId, WELCOME_MESSAGE, { parse_mode: 'Markdown' });
});

// /help command
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, HELP_MESSAGE, { parse_mode: 'Markdown' });
});

// /language command
bot.onText(/\/language/, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
        inline_keyboard: Object.entries(LANGUAGES).map(([code, name]) => [{
            text: name,
            callback_data: `lang_${code}`
        }])
    };

    bot.sendMessage(chatId, '🌐 *Choose your preferred language:*', {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// /settings command
bot.onText(/\/settings/, (msg) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);

    const currentSettings = `⚙️ *Your Current Settings*

📍 Region: ${session.context.region}
🏫 School Type: ${session.context.schoolType}
🗣️ Language: ${session.context.language}
📚 Grade Level: ${session.context.grade}
📖 Subject: ${session.context.subject}

To update, use these commands:
• /setregion [your region]
• /setschool [school type]
• /setgrade [grade level]
• /setsubject [subject]

Example: /setregion Rural Chhattisgarh`;

    bot.sendMessage(chatId, currentSettings, { parse_mode: 'Markdown' });
});

// Settings update commands
bot.onText(/\/setregion (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    session.context.region = match[1];
    bot.sendMessage(chatId, `✅ Region updated to: *${match[1]}*`, { parse_mode: 'Markdown' });
});

bot.onText(/\/setschool (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    session.context.schoolType = match[1];
    bot.sendMessage(chatId, `✅ School type updated to: *${match[1]}*`, { parse_mode: 'Markdown' });
});

bot.onText(/\/setgrade (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    session.context.grade = match[1];
    bot.sendMessage(chatId, `✅ Grade level updated to: *${match[1]}*`, { parse_mode: 'Markdown' });
});

bot.onText(/\/setsubject (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const session = getSession(chatId);
    session.context.subject = match[1];
    bot.sendMessage(chatId, `✅ Subject updated to: *${match[1]}*`, { parse_mode: 'Markdown' });
});

// Handle language selection callback
bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;
    const data = callbackQuery.data;

    if (data.startsWith('lang_')) {
        const langCode = data.replace('lang_', '');
        const langName = LANGUAGES[langCode];
        const session = getSession(chatId);
        session.context.language = langName.split(' ')[0]; // Get just the language name

        await bot.answerCallbackQuery(callbackQuery.id, { text: `Language set to ${langName}` });
        await bot.sendMessage(chatId, `✅ Language updated to: *${langName}*\n\nI'll now respond in ${langName.split(' ')[0]}.`, { parse_mode: 'Markdown' });
    }
});

// Handle regular messages (teacher problems)
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Skip if it's a command
    if (!text || text.startsWith('/')) return;

    const session = getSession(chatId);
    session.messageCount++;

    // Show typing indicator
    await bot.sendChatAction(chatId, 'typing');

    try {
        // Generate response
        const response = await generateBreakthroughResponse(text, session.context);

        // Send response
        await bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });

        // Add a follow-up after first few messages
        if (session.messageCount === 1) {
            setTimeout(() => {
                bot.sendMessage(chatId,
                    `💡 *Tip:* You can customize my responses by setting your school context using /settings`,
                    { parse_mode: 'Markdown' }
                );
            }, 2000);
        }
    } catch (error) {
        console.error('Error processing message:', error);
        await bot.sendMessage(chatId,
            '😔 Sorry, I encountered an error. Please try again in a moment.\n\nIf the problem persists, try /start to restart.',
            { parse_mode: 'Markdown' }
        );
    }
});

// Error handling
bot.on('polling_error', (error) => {
    console.error('Polling error:', error.code, error.message);
});

// Startup message
console.log('================================================');
console.log('🤖 DIET Frustration-to-Breakthrough Bot Started!');
console.log('================================================');
console.log('Bot is now running and listening for messages...');
console.log('Press Ctrl+C to stop.\n');

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down bot...');
    bot.stopPolling();
    process.exit(0);
});
