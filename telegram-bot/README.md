# DIET Frustration-to-Breakthrough Bot (Telegram)

A 24/7 Telegram bot providing immediate, practical solutions when teachers face challenges in their classrooms.

## Features

- 🤖 **AI-Powered Responses**: Uses Google Gemini AI to generate empathetic, practical solutions
- 🌐 **Multi-Language Support**: Supports Hindi, Telugu, Tamil, Marathi, Bengali, and more
- ⚙️ **Customizable Context**: Teachers can set their school type, region, grade level, and subject
- 💬 **Telegram-Friendly**: Short, WhatsApp-style responses optimized for mobile
- 🕐 **24/7 Available**: Always ready to help teachers in their moment of need

## Setup

1. **Install Dependencies**
   ```bash
   cd telegram-bot
   npm install
   ```

2. **Configure Environment**
   The `.env` file is already set up with:
   - Telegram Bot Token
   - Google Gemini API Key

3. **Start the Bot**
   ```bash
   npm start
   ```

## Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message and introduction |
| `/help` | How to use the bot |
| `/language` | Change response language |
| `/settings` | View/update school context |
| `/setregion [region]` | Set your region |
| `/setschool [type]` | Set school type |
| `/setgrade [grade]` | Set grade level |
| `/setsubject [subject]` | Set subject |

## Usage

1. Open Telegram and search for your bot
2. Send `/start` to begin
3. Type your classroom problem or frustration
4. Receive immediate, practical guidance

## Example Interaction

**Teacher**: "Half my class is absent today because of harvest season. How do I proceed?"

**Bot Response**:
```
🤝 I Understand
This is a common and frustrating situation during harvest season - you're not alone in facing this.

🎯 The Issue
You have reduced attendance and need to decide how to proceed with your lesson.

✅ Do This Right Now
1. Don't teach new concepts today - it's unfair to absent students
2. Use this time for revision or practice activities with present students
3. Note down who's absent - send a fun activity or summary home with a present student from their village

💪 You've Got This
You're being thoughtful about all your students, including those who can't be here. That's what makes you a good teacher.
```

## Technology Stack

- Node.js
- node-telegram-bot-api
- Google Gemini AI (gemini-1.5-flash)
- dotenv for configuration
