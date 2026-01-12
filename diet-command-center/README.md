# ShikshaLokam DIET Command Center

## Project Overview
The **DIET (District Institute of Education and Training) Command Center** is a comprehensive dashboard designed to empower education administrators and teachers in rural India. It addresses the "Principal's Dilemma" by providing real-time analytics to identify school clusters with specific needs and offering AI-driven solutions to address them immediately.

**Key Features:**
1.  **Geospatial Heatmap**: Visualizes district performance (Absenteeism, Infrastructure, Resources) to prioritize interventions.
2.  **AI Module Generator**: Generates 15-minute micro-learning training modules customized to a cluster's specific context (Language, Region, Issue).
3.  **Reflection Copilot**: An AI-powered "Implementation Coach" that chats with teachers post-training to ensure practical application of concepts.
4.  **Frugal TLM Recommender**: A computer vision tool that analyzes classroom photos to suggest low-cost teaching aids and experiments using available materials (trash-to-treasure).
5.  **Simulation Arena**: A role-play simulator for teachers to practice handling difficult conversations (e.g., Angry Parent, Disengaged Student).
6.  **AI Assessment**: Upload student performance descriptions to get strengths, gaps, and targeted interventions.
7.  **Engagement Tracker**: Analyze classroom session logs to get engagement scores and "Energizer" recommendations.
8.  **Just-in-Time Accuracy (Predictive)**: Forecasts teacher training needs based on weekly metrics and warns of risks (e.g., Dropout).
9.  **The Agency Engine**: A demand-driven "swipe" interface for teachers to signal their specific challenges and get instant solutions.

## Technology Stack
- **Frontend**: React, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn-ui
- **AI Backend**: Google Gemini 2.0 (via RapidAPI Proxy) for text generation and vision analysis.
- **Routing**: React Router DOM
- **State/Data**: React Query, Context API

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### Steps
1.  **Clone the repository**
    ```sh
    git clone https://github.com/oki-dokii/ShikshaLokam.git
    cd ShikshaLokam/diet-command-center
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your RapidAPI credentials:
    ```env
    VITE_RAPIDAPI_KEY=your_rapidapi_key_here
    VITE_RAPIDAPI_HOST=gemini-pro-ai.p.rapidapi.com
    ```

4.  **Run Development Server**
    ```sh
    npm run dev
    ```

## Usage Guide
1.  **Analyze**: Start at the `/heatmap` to view cluster performance.
2.  **Generate**: Select a cluster > "Deep Dive" > "Generate Training" to create a contextualized module.
3.  **Reflect**: Use the "Launch Coach" feature in the module view to simulate a post-lesson reflection chat.
4.  **Innovate**: Navigate to `/frugal-tlm` to upload photos and get resource-aware activity suggestions.

## License
MIT
