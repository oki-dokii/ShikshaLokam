# ShikshaAssistant: Methodology & Architecture

## 1. Methodology: "The Teacher-Centric Loop"
Our methodology follows a cyclical performance support model designed to bridge the "Implementation Gap."

### **Phase 1: Demand & Diagnostics (Input)**
Instead of pushing training *down*, we pull needs *up*.
*   **Active**: Teacher swipes on challenges in the **Agency Engine**.
*   **Passive**: System monitors classroom "Pulse" via the **Voice Assistant**.
*   **Outcome**: A precise "Demand Profile" is created for each teacher/cluster.

### **Phase 2: Instant Intervention (Process)**
We do not make teachers wait. Interventions are generated **Just-in-Time**.
*   **Pedagogical Engine**: Llama 3 (Groq) takes the *Teacher Context* (Rural, Low Bandwidth) + *Problem* (Distraction) → Generates a specific, localized solution.
*   **Resource Adaptation**: Gemini Vision takes *Static Assets* (Textbook photos) → Transforms them into *Interactive Micro-Modules*.

### **Phase 3: Implementation & Feedback (Output)**
The teacher applies the solution in the classroom.
*   **Action**: Teacher conducts the activity.
*   **Reflection**: Teacher logs the outcome in **Reflection Copilot**.
*   **Loop**: This data feeds back into the **Training Demand Predictor**, refining future recommendations.

---

## 2. Technical Architecture Diagram

```mermaid
graph TD
    subgraph Client_Layer ["Client Layer (PWA)"]
        TeacherApp[Teacher PWA\n(React + Vite)]
        VoiceUI[Voice Assistant\n(Web Speech API)]
        OfflineStore[Local Storage / IndexedDB\n(VitePWA)]
    end

    subgraph Logic_Layer ["Application Logic"]
        Router[Router & State\n(TanStack Query)]
        ContextEngine[Context Engine\n(Teacher Profile + Region Data)]
        PromptEng[Prompt Engineer\n(Dynamic Context Injection)]
    end

    subgraph Intelligence_Layer ["AI Intelligence (API)"]
        Groq[Groq Cloud API\n(Llama 3 - 70b)]
        Gemini[Google Gemini 1.5\n(Vision & Multimodal)]
    end

    subgraph Support_Layer ["Admin & Monitoring"]
        RPDash[RP Command Center\n(Dashboard)]
        Analytics[Predictive Analytics\n(Demand Heatmaps)]
    end

    %% Flows
    TeacherApp -->|Voice/Text Input| VoiceUI
    VoiceUI -->|Raw Text| ContextEngine
    TeacherApp -->|Swipe Data| ContextEngine
    
    ContextEngine -->|Enriched Prompt| PromptEng
    PromptEng -->|High Speed Inference| Groq
    PromptEng -->|Image Analysis| Gemini
    
    Groq -->|Tactical Advice| TeacherApp
    Gemini -->|Micro-Modules| TeacherApp
    
    TeacherApp -->|Usage Logs| Analytics
    Analytics -->|Cluster Insights| RPDash
    
    %% Offline Flow
    TeacherApp <-->|Cache/Sync| OfflineStore
    OfflineStore -.->|Fallback Content| TeacherApp
    
    style TeacherApp fill:#f9f,stroke:#333,stroke-width:2px
    style Groq fill:#bbf,stroke:#333,stroke-width:2px
    style Gemini fill:#bbf,stroke:#333,stroke-width:2px
```

### **Architecture Highlights**

1.  **Dual-Brain AI Core**:
    *   **Speed Layer (Groq)**: Handles all text interactions (Chat, Advice, Text generation) where latency must be <2 seconds.
    *   **Vision Layer (Gemini)**: Handles heavy lifting (Image understanding, Frugal Lab) where accuracy > speed.

2.  **Stateless & Secure**:
    *   No central database holds sensitive conversation history. History is managed client-side and ephemeral context is passed to the AI on each request (Stateless).
    *   This ensures maximum privacy and minimal hosting costs.

3.  **Offline-Resilient PWA**:
    *   The **VitePWA** layer sits between the Client and the Network.
    *   It caches the *Application Shell* (UI) and *User Generated Content* (Saved Modules), allowing the system to function in deep rural areas.
