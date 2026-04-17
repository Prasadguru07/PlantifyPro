<div align="center">
  
# 🌿 Plantify Pro
**Full-Stack AI Nature Tech for the Modern Botanist**

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_5-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js_22-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![OpenAI](https://img.shields.io/badge/GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Three.js](https://img.shields.io/badge/ThreeJS-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)

<p align="center">
Plantify Pro bridges the gap between biological care and spatial computing. Combining real-time metric syncing, interactive 3D interfaces, and an autonomous AI Diagnostic Agent to ensure your greenhouse thrives.
</p>

</div>

---

## ✨ Premium Features

We've designed Plantify Pro with a glassmorphic aesthetic, micro-interactions, and spatial awareness.

<table>
<tr>
<td width="50%">

### 🧠 "Am I Killing It?" AI Agent
Powered by **OpenAI GPT-4o-mini** and `@langchain/openai`.  
Our autonomous agent analyzes plant symptoms and environmental factors to provide instant, actionable remedies.

</td>
<td width="50%">

### 🪴 3D Greenhouse Dashboard
An interactive, spatial UI built with **React Three Fiber & Drei**.  
Rotate, zoom, and inspect your digital greenhouse twins in real-time right in your browser.

</td>
</tr>

<tr>
<td width="50%">

### ⚡ Real-Time Hardware Sync
Watering from your phone? The desktop 3D greenhouse updates hydration limits instantly using ultra-low latency **Native Node WebSockets**.

</td>
<td width="50%">

### ☁️ Indoor Climate Widget
Contextualize your local weather natively against your greenhouse statistics.  
Featuring glassmorphic sliding drawers powered by **Framer Motion**.

</td>
</tr>
</table>

> 🎧 **Ambient Serenity Engine:** Toggle an immersive, dynamically generated greenhouse audio environment loop directly from the UI for ultimate focus and relaxation.

---

## 🏗 System Architecture

Plantify Pro uses a decoupled, event-driven architecture to ensure the 3D UI never drops frames while processing complex AI diagnostics in the background.

```mermaid
flowchart LR

    %% Style Definitions
    classDef frontend fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef backend fill:#1e293b,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef database fill:#1e293b,stroke:#f59e0b,stroke-width:2px,color:#f8fafc;
    classDef external fill:#1e293b,stroke:#8b5cf6,stroke-width:2px,color:#f8fafc;
    classDef ai fill:#1e293b,stroke:#ec4899,stroke-width:2px,color:#f8fafc;

    %% Client Layer
    subgraph ClientLayer [Client Environment]
        direction TB
        UI[React UI Vite Tailwind]:::frontend
        Motion[Framer Motion Transitions]:::frontend
        Canvas[React Three Fiber Canvas]:::frontend
        UI -.-> Motion
    end

    %% Application Layer
    subgraph AppLayer [Node Backend Engine]
        direction TB
        API[Express REST API]:::backend
        WS[WebSocket Server ws]:::backend

        subgraph AIPipeline [AI Orchestration]
            direction TB
            Agent[LangChain JS Agent]:::ai
        end
    end

    %% Data Layer
    subgraph DataLayer [Persistence Layer]
        DB[(SQLite3 Database)]:::database
    end

    %% External Services
    subgraph ExternalLayer [Third Party Services]
        LLM[OpenAI GPT API]:::external
    end

    %% Connections
    UI <--> |HTTPS REST JSON| API
    Canvas <--> |WebSocket RealTime| WS

    API <--> |SQL Read Write| DB
    WS --> |Sync Update| DB

    API --> |Invoke Chain| Agent
    Agent <--> |HTTPS API| LLM
```

## 🚀 Getting Started

### 0. Prerequisites

- **Node.js:** v20.x or higher recommended  
- **OpenAI API Key:** Required for the Diagnostic Agent  

---

### 1. Environment Setup

Create a `.env` file inside the `backend/` directory:

```env
# OpenAI Key for the LangChain Agent (Required)
OPENAI_API_KEY=sk-your-premium-api-key-here

# Port Configuration (Defaults to 8000)
PORT=8000
```

---

### 2. Booting the Backend

```bash
cd backend

# Install dependencies
npm install

# Start Express and WebSocket server (with hot-reload)
npm run dev
```

---

### 3. Launching the Spatial Frontend

```bash
cd frontend

# Install UI and 3D dependencies
npm install

# Start the Vite development server
npm run dev
```

Visit: **http://localhost:5173**

---

<div align="center">
<sub>Built with 💚 for the Future of Nature Tech.</sub>
</div>