# 🎓 ShikshaLokam DIET Command Center

> **AI-Powered Just-in-Time Teaching Assistant for Indian Government School Teachers**

[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%20%7C%20Groq-green)](https://ai.google.dev/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution Architecture](#-solution-architecture)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Feature Deep Dive](#-feature-deep-dive)
- [API Integration](#-api-integration)
- [User Flow](#-user-flow)

---

## 🎯 Overview

**ShikshaLokam DIET Command Center** is a comprehensive AI-powered platform designed to provide **real-time, personalized coaching** to teachers in rural India who lack access to immediate pedagogical support. The platform bridges the critical gap between periodic mentor visits (often once a month) and the daily challenges teachers face in their classrooms.

The system provides:
- **Instant AI-driven solutions** for classroom management and pedagogical challenges
- **Contextual micro-learning modules** customized for regional/linguistic contexts
- **24/7 multi-language support** via Telegram bot for on-the-go assistance
- **Computer vision-based resource recommendations** from available materials
- **Role-play simulations** for handling difficult conversations

---

## 🚨 Problem Statement

### The Implementation Gap

Teachers in India's public education system, especially in rural areas, face a critical support vacuum:

| Challenge | Impact |
|-----------|--------|
| **Periodic Mentor Visits** | CRPs/ARPs visit only once a month, for 10-30 minutes |
| **Query Lag Time** | Teachers must wait weeks to get answers to immediate problems |
| **Generic Feedback** | Resource persons provide non-actionable advice like "teach properly" |
| **Multi-level Classrooms** | Single teachers handle students at 4+ different learning levels |
| **No Peer Support** | Often the only teacher for their grade in the entire region |

### The Sunita Story

> *Sunita, a primary teacher in rural Jharkhand, attempts a new group-based subtraction activity. Mid-lesson, chaos erupts—advanced students finish early while struggling students hit a conceptual block. With no immediate support and her next CRP visit 3 weeks away, she abandons innovation and returns to rote instruction.*

**ShikshaLokam prevents this "death of the spark" by providing immediate, context-aware assistance.**

---

## 🏗 Solution Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ShikshaLokam Ecosystem                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐ │
│  │  DIET Command       │  │  DIET Control       │  │  Telegram Bot       │ │
│  │  Center (Main App)  │  │  Room (Admin View)  │  │  (24/7 Mobile)      │ │
│  ├─────────────────────┤  ├─────────────────────┤  ├─────────────────────┤ │
│  │ • Teacher Dashboard │  │ • Cluster Overview  │  │ • Voice Commands    │ │
│  │ • AI Module Gen     │  │ • Heatmap Analytics │  │ • Multi-language    │ │
│  │ • Simulation Arena  │  │ • Resource Person   │  │ • Instant Advice    │ │
│  │ • Frugal TLM        │  │   Dashboard         │  │ • Context Aware     │ │
│  │ • Agency Engine     │  │ • Module Library    │  │                     │ │
│  └─────────┬───────────┘  └─────────┬───────────┘  └─────────┬───────────┘ │
│            │                        │                        │              │
│            └────────────────────────┼────────────────────────┘              │
│                                     │                                        │
│                    ┌────────────────┴────────────────┐                      │
│                    │         AI Backend               │                      │
│                    ├─────────────────────────────────┤                      │
│                    │  • Google Gemini 2.0 Flash      │                      │
│                    │  • Groq LLaMA 3.3 70B           │                      │
│                    │  • Vision Models (TLM Analysis) │                      │
│                    │  • Multi-language Translation   │                      │
│                    └─────────────────────────────────┘                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. 🗺️ Geospatial Heatmap Dashboard
Interactive district visualization showing cluster performance across metrics:
- Student Absenteeism rates
- Infrastructure availability
- Resource distribution
- Teacher engagement levels

### 2. 📚 AI Module Generator
Generates **15-minute micro-learning modules** customized for:
- Specific regional context (language, infrastructure)
- Current classroom challenges
- Available resource modes (Low Bandwidth/Offline/Digital)
- Pedagogy style (Game-based/Socratic/Creative)

### 3. 💬 Implementation Copilot
AI-powered post-training coach that:
- Follows up on training implementation
- Provides WhatsApp-style supportive guidance
- Adapts to teacher's specific context

### 4. 🔧 Frugal TLM Recommender
**Computer Vision + AI** system that:
- Analyzes classroom photos
- Identifies available materials
- Suggests educational activities using those resources
- "Trash-to-Treasure" innovation approach

### 5. 🎭 Simulation Arena
Role-play sandbox for practicing:
- Angry parent conversations
- Disengaged student interventions
- Colleague conflicts
- AI adapts responses based on teacher's approach

### 6. 📊 AI Assessment Engine
Analyzes student performance and provides:
- Strength identification
- Learning gap detection
- Specific intervention strategies

### 7. 📈 Engagement Tracker
Session-based analysis providing:
- Engagement scores (1-10)
- Dominant patterns (Passive/Active/Disruptive)
- Quick "Energizer" recommendations

### 8. 🔮 Predictive Training Analytics
Forecasts training needs based on:
- Attendance trends
- Test scores
- Engagement metrics
- Risk assessment (Dropout prediction)

### 9. 🎯 Agency Engine
Swipe-based interface for teachers to:
- Signal specific challenges (Tinder-style UX)
- Mark urgent issues
- Get instant AI-generated solutions
- Aggregate cluster-level demand data

### 10. 📝 Content Transformer
Converts existing materials into:
- Micro-modules from training manuals
- Interactive quizzes from NCERT content
- Live quiz sessions with QR codes

### 11. 🤖 Telegram Bot (24/7 Support)
Mobile-first assistant featuring:
- 11 Indian language support
- "Frustration-to-Breakthrough" methodology
- Structured response format
- Context-aware customization

---

## 🛠 Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18.3** | Component-based UI framework |
| **TypeScript 5.8** | Type-safe development |
| **Vite 5.4** | Lightning-fast build tool |
| **Tailwind CSS 3.4** | Utility-first styling |
| **shadcn/ui** | Accessible component library |
| **Framer Motion** | Smooth animations |
| **React Query** | Server state management |
| **React Router DOM** | Client-side routing |
| **Recharts** | Data visualization |

### AI/ML Backend
| Technology | Purpose |
|------------|---------|
| **Google Gemini 2.0 Flash** | Primary text generation |
| **Groq LLaMA 3.3 70B** | Fast inference backup |
| **LLaMA 3.2 Vision** | Image analysis for TLM |
| **Google Translate API** | Multi-language support |

### Mobile (Telegram Bot)
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **node-telegram-bot-api** | Telegram integration |
| **Gemini 1.5 Flash** | Bot response generation |

---

## 📁 Project Structure

```
ShikshaLokam/
├── diet-command-center/          # Main Teacher/Admin Application
│   ├── src/
│   │   ├── components/           # React Components
│   │   │   ├── agency/           # Agency Engine components
│   │   │   ├── content/          # Content transformation
│   │   │   ├── dashboard/        # Dashboard widgets
│   │   │   ├── ui/               # shadcn UI primitives
│   │   │   └── ...
│   │   ├── pages/                # Route pages
│   │   │   ├── AgencyEngine.tsx
│   │   │   ├── AssessmentAI.tsx
│   │   │   ├── ContentTransformer.tsx
│   │   │   ├── EngagementAnalysis.tsx
│   │   │   ├── FrugalRecommender.tsx
│   │   │   ├── HeatmapDashboard.tsx
│   │   │   ├── ImplementationCopilot.tsx
│   │   │   ├── ModuleGenerator.tsx
│   │   │   ├── PredictiveTraining.tsx
│   │   │   ├── SimulationArena.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   ├── gemini.ts         # AI API integrations
│   │   │   ├── translate.ts      # Translation service
│   │   │   └── dropoutPrediction.ts
│   │   ├── data/                 # Mock data & presets
│   │   │   ├── clusterData.ts
│   │   │   ├── ncert/            # NCERT curriculum data
│   │   │   └── ...
│   │   └── context/              # React Context providers
│   ├── package.json
│   └── vite.config.ts
│
├── diet-control-room/            # Admin Dashboard (Landing + Modules)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ModulesPage.tsx
│   │   │   └── ...
│   │   └── components/
│   └── package.json
│
├── telegram-bot/                 # 24/7 Mobile Support Bot
│   ├── bot.js                    # Main bot logic
│   ├── package.json
│   └── .gitignore
│
└── README.md                     # Project documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or bun
- API Keys (Groq, Google AI, RapidAPI)

### 1. Clone Repository
```bash
git clone https://github.com/oki-dokii/ShikshaLokam.git
cd ShikshaLokam
```

### 2. Install Main Application
```bash
cd diet-command-center
npm install
```

### 3. Configure Environment
Create `.env` file:
```env
VITE_RAPIDAPI_KEY=your_rapidapi_key
VITE_RAPIDAPI_HOST=gemini-pro-ai.p.rapidapi.com
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Setup Telegram Bot (Optional)
```bash
cd telegram-bot
npm install
# Create .env with TELEGRAM_BOT_TOKEN and GOOGLE_API_KEY
node bot.js
```

---

## 🔍 Feature Deep Dive

### Agency Engine Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐     ┌────────────┐
│  Profile   │────▶│   Swipe    │────▶│  Analyze   │────▶│  Generate  │
│   Setup    │     │ Challenges │     │   Demand   │     │   Module   │
└────────────┘     └────────────┘     └────────────┘     └────────────┘

• LEFT Swipe: Skip challenge
• RIGHT Swipe: Mark as relevant  
• UP Swipe: Mark as URGENT (🔥)
```

### Module Generation Pipeline

```
Input Context             AI Processing              Output Module
─────────────────────────────────────────────────────────────────────
• Region type      ─┐                          ┌─ 15-min micro-module
• Primary issue     │    ┌───────────────┐     │
• Infrastructure    ├───▶│ Gemini/Groq   │─────┤  Content blocks:
• Language          │    │ LLM Prompt    │     │  • Concepts
• Resource mode     │    │ Engineering   │     │  • Activities  
• Pedagogy style   ─┘    └───────────────┘     │  • Assessments
• Local challenge                              └─ Resource links
```

### TLM Recommender Vision Pipeline

```
                    ┌─────────────────────┐
 Classroom Photo ──▶│  LLaMA 3.2 Vision   │──▶ Detected Resources
                    │  (11B/90B)          │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼───────────┐
                    │  Activity Generator │──▶ 3 Educational Activities
                    │  (Low-resource)     │    with step-by-step guides
                    └─────────────────────┘
```

---

## 🔌 API Integration

### Primary API Flow
```typescript
// lib/gemini.ts - Dual API Strategy
async function callGroqAPI(prompt, base64Image?) {
  // Primary: Groq API (faster, rate limits)
  // Models: llama-3.3-70b-versatile (text)
  //         llama-3.2-90b-vision (images)
}

async function callGeminiProxy(contents, systemInstruction?) {
  // Extracts prompt and image, routes to Groq
  // Fallback: Google Gemini 2.0 Flash
}
```

### Available AI Functions
| Function | Purpose |
|----------|---------|
| `generateTrainingModule()` | Creates 15-min micro-modules |
| `generateReflectionChat()` | Implementation coaching |
| `recommendTLM()` | Vision-based TLM suggestions |
| `startSimulation()` | Initializes role-play scenario |
| `analyzeStudentPerformance()` | Assessment analysis |
| `analyzeSessionEngagement()` | Engagement scoring |
| `predictTrainingNeed()` | Risk assessment |
| `analyzeDemand()` | Agency engine aggregation |

---

## 🔄 User Flow

```
                              TEACHER JOURNEY
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│    ┌──────────┐       ┌──────────┐       ┌──────────┐                  │
│    │  Login   │──────▶│  Agency  │──────▶│ Generate │                  │
│    │          │       │  Engine  │       │  Module  │                  │
│    └──────────┘       │ (Swipe)  │       └────┬─────┘                  │
│                       └──────────┘            │                         │
│                            │                  ▼                         │
│         ┌──────────────────┼───────────────────────────────────┐       │
│         ▼                  ▼                                    │       │
│   ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────┴─────┐ │
│   │ Frugal   │      │Simulation│      │Assessment│      │ Implement  │ │
│   │   TLM    │      │  Arena   │      │    AI    │      │  Copilot   │ │
│   └──────────┘      └──────────┘      └──────────┘      └────────────┘ │
│                                                                         │
│                       RESOURCE PERSON JOURNEY                           │
│    ┌──────────┐       ┌──────────┐       ┌──────────┐                  │
│    │ Heatmap  │──────▶│ Cluster  │──────▶│Predictive│                  │
│    │Dashboard │       │  Detail  │       │Analytics │                  │
│    └──────────┘       └──────────┘       └──────────┘                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 Telegram Bot Commands

| Command | Function |
|---------|----------|
| `/start` | Initialize bot session |
| `/help` | Show usage guide |
| `/language` | Select response language |
| `/settings` | View/update context |
| `/setregion [region]` | Set your region |
| `/setgrade [level]` | Set grade level |
| *Any message* | Get instant teaching support |

### Supported Languages
Hindi • Telugu • Tamil • Marathi • Bengali • Gujarati • Kannada • Malayalam • Punjabi • Odia • English

---

## 🎯 Key Success Metrics

| Metric | Target |
|--------|--------|
| Query-to-Resolution Time | < 30 seconds |
| Coaching Interactions/Week | 10+ per teacher |
| Implementation Success Rate | > 70% |
| Teacher Satisfaction Score | > 4.5/5 |

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

<p align="center">
  <b>Built for Innovation 4 Education Equity Hackathon 2026</b><br>
  <i>Empowering every teacher, one breakthrough at a time.</i>
</p>
