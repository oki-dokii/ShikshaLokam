# ShikshaLokam: Real-Time Education Transformation Platform

This repository houses the **DIET Command Center** and **Control Room** ecosystem, designed to empower educational leaders and teachers with real-time data, AI-driven insights, and geospatial monitoring.

## 🏗️ Project Structure

The platform consists of three main components:

| Component | Directory | Description |
|-----------|-----------|-------------|
| **Command Center** | `diet-command-center` | **For Administrators/State Officials.** A centralized dashboard for monitoring district performance, teacher engagement, and implementing data-driven interventions. Features geospatial heatmaps and AI insights. |
| **Control Room** | `diet-control-room` | **For Teachers/Trainers.** A focused interface for teachers to access training, submit reflections, and receive real-time support. |
| **Hackathon Resources** | `general_hackathon` | Additional resources, scripts, and legacy modules associated with the project. |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### 1. DIET Command Center (Admin)
Navigate to the command center directory and start the dev server:

```bash
cd diet-command-center
npm install
npm run dev
```
> Runs on: `http://localhost:8080` (default)
> **Key Features:** Geospatial Heatmaps, District Deep Dives, Real-time Alerts.

### 2. DIET Control Room (Teacher)
Open a new terminal and start the control room:

```bash
cd diet-control-room
npm install
npm run dev
```
> Runs on: `http://localhost:5173` (default)

---

## 🌟 Key Features implemented

- **Geospatial Heatmap:** Real-time visualization of Engagement and Clarity scores across districts.
  - *Navigate to:* `/dashboard/heatmap` in Command Center.
- **Deep Dive Analysis:** AI-powered detailed breakdown of school metrics.
- **Tacit Knowledge Capture:** Video/Audio capture tool for teachers to share classroom "hacks".
- **Real-time Simulation:** Live data updates to simulate active classroom monitoring.

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** TailwindCSS, ShadCN UI
- **Visualization:** Recharts, Framer Motion, Custom SVG Maps
- **AI Integration:** Google Gemini (for knowledge analysis)

---

*Note: This project is part of the ShikshaLokam initiative.*
