# ShikshaAssistant: The Complete User Manual & Feature Guide

This document provides an exhaustive, step-by-step walkthrough of **ShikshaAssistant**, covering every major module and micro-interaction available in the platform.

---

## 1. Getting Started: The Landing Experience

### **Visual Immersion & 3D Tilt Cards**
*   **The First Impression**: Upon loading the application (`/`), you are greeted by a "Glassmorphism" design system optimized for modern mobile screens.
*   **Micro-Interaction**: Hover your mouse (or touch and hold on mobile) over any Feature Card in the "Capabilities that Empower You" section.
    *   **Effect**: The card will physically tilt in 3D space, tracking your cursor position. This is powered by a physics-based spring animation (`framer-motion`) to give a tactile, premium feel.
    *   **Glow Effect**: A subtle gradient glow follows your cursor across the card surface.
*   **Navigation**: Click **"Get Started with ShikshaAssistant"** to enter the authenticated experience.

### **Authentication Simulation**
*   **Role Selection**: The login screen allows you to simulate two distinct user journeys:
    *   **Teacher**: Accesses the classroom support tools.
    *   **Resource Person (RP)**: Accesses the administrative command center.
    *   *Note: For this demo version, no password is required. Simply click to enter.*

---

## 2. Core Platform Utilities (Available Globally)

### **Shiksha AI Voice Assistant (The "Floaty")**
*   **Location**: Bottom-Right corner (Floating Action Button).
*   **Interaction**:
    *   **Wake**: Click the sparkles icon to expand the voice interface.
    *   **Voice Mode**: The assistant automatically greets you. Click the **Microphone** icon to speak. It uses the browser's native **Web Speech API** for near-zero latency transcription.
    *   **Text Mode**: You can also type queries if you are in a quiet environment.
    *   **Text-to-Speech**: The assistant reads aloud the response using a high-quality neural voice (automatically selecting "Google US English" or similar high-fidelity voices if available).
    *   **Context Awareness**: It maintains conversation history, so you can ask follow-up questions (e.g., "Give me another example of that").

### **Universal Language Switcher**
*   **Location**: Top-Right Header.
*   **Function**: Instantly translates the entire application interface into major Indian languages (Hindi, Kannada, Tamil, Telugu, etc.).
*   **Mechanism**: Uses a hybrid approach of UI string replacement and an integration with translation APIs to ensure even dynamic content is accessible to vernacular speakers.

---

## 3. Teacher Empowerment Suite (Modules)

### **A. Resource Evolution Suite**
*   **Purpose**: Instantly creates teaching material.
*   **Detailed Workflow**:
    1.  **Input**: Type a topic (e.g., "Water Cycle").
    2.  **Context Engine**: Select your specific classroom situation:
        *   *Rural/Urban*: Adjusts the examples used.
        *   *Low Bandwidth*: Generates text-heavy content instead of video links.
        *   *Pedagogy Style*: Choose "Gamified" or "Socratic" to change the *tone* of the lesson.
    3.  **The "Magic"**: Click **Generate**. The Llama 3 AI generates a structured 15-minute micro-module including:
        *   *Concept Explanation*.
        *   *Activity* (using local materials).
        *   *Assessment Questions*.

### **B. Agency Engine (The "Tinder for Teaching")**
*   **Purpose**: A gamified way for teachers to signal their needs.
*   **Interaction**:
    *   **Swipe Right**: "I face this challenge." (Logs a demand).
    *   **Swipe Left**: "Not relevant to me." (Skips).
    *   **Swipe Up**: "Urgent Priority!" (Flags as critical).
*   **Results**: After swiping through a deck of challenges, the system builds a **"Demand Profile"** for you and recommends a specific training module tailored to your unique swipe pattern.

### **C. Simulation Arena**
*   **Purpose**: Practice difficult conversations.
*   **Scenarios**:
    *   *The Angry Parent*: A parent complaining about their child's grades.
    *   *The Disruptive Student*: A student refusing to pay attention.
    *   *The Skeptical Colleague*: A senior teacher questioning your new methods.
*   **AI Persona**: The AI adopts a specific "personality" (e.g., "Rajesh, the frustrated parent"). It reacts to your tone—if you are rude, it gets angrier; if you show empathy, it calms down.

### **D. Frugal Science Lab (Computer Vision)**
*   **Purpose**: Create science experiments from garbage/household items.
*   **Interaction**:
    1.  **Upload**: Take a picture of items on your desk (e.g., a plastic bottle, a rubber band, a spoon).
    2.  **Analysis**: The **Gemini Vision** model analyzes the image, identifies the objects, and *hallucinates* a valid scientific experiment you can perform using *only* those visible items.
    3.  **Output**: Returns step-by-step instructions.

### **E. Live Pulse Advisor**
*   **Purpose**: Panic button for classroom management.
*   **Workflow**:
    1.  Type a crisis (e.g., "Kids are fighting").
    2.  **Instant Response**: Llama 3 provides a <2 sentence "Tactical Intervention" to diffuse the situation immediately. It creates a specific script for the teacher to say.

### **F. AI Assessment Copilot**
*   **Purpose**: Remedial planning.
*   **Workflow**:
    1.  Paste a student's test scores or observation notes.
    2.  **Analysis**: The AI breaks it down into "Strengths" and "Learning Gaps".
    3.  **Plan**: Auto-generates a personalized learning path for that specific student.

### **G. 24/7 Teacher Bot (Telegram/Chat)**
*   **Purpose**: Low-bandwidth support.
*   **Feature**: Simulates a WhatsApp/Telegram chat interface where teachers can ask administrative questions (e.g., "When is the next holiday?", "How do I fill the attendance register?").

---

## 4. Resource Person (RP) Command Center

### **The "Control Room" Dashboard**
*   **Cluster Map**: A visual representation of schools in the RP's jurisdiction.
*   **Metrics**:
    *   *Compliance Rate*: % of teachers using the app.
    *   *Visit Coverage*: How many schools the RP has visited this month.
*   **Predictive Analytics**:
    *   **"At Risk" Flagging**: The system uses teacher usage data to predict which schools are likely to have poor student outcomes *before* the exams happen, allowing the RP to intervene proactively.

---

## 5. Technical & Design Micro-Features

*   **PWA Ready**: The app creates a service worker manifest, allowing it to be "Installed" on a phone home screen like a native app.
*   **Lazy Loading**: Heavy components (like the 3D engine) are loaded only when needed to save data.
*   **Error Boundaries**: If the AI API fails (e.g., due to network), the system falls back gracefully to "Simulated Mode" (hardcoded high-quality responses) so the demo never breaks.
*   **Responsive layouts**: The Grid system (`grid-cols-1 md:grid-cols-3`) automatically reflows content from a 3-column desktop view to a single-column scrollable feed on mobile.
