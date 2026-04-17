# Plantify Pro: Full-Stack AI Nature Tech

Welcome to the **Plantify Pro** repository. Plantify Pro is a premium, live, full-stack application built for plant enthusiasts, combining real-time metrics with an interactive 3D interface and an AI Diagnostic Agent.

## 🌟 Premium Features
- **"Am I Killing It?" Diagnostic AI Agent:** Powered by OpenAI GPT-4o-mini and `@langchain/openai`, this agent analyzes plant symptoms and provides actionable remedies.
- **Enhanced Plant Dashboard Array:** Features a glassmorphic sliding drawer visualizing hydration limits via Framer Motion. 
- **Indoor Climate Widget:** Contextualize your local weather natively against your greenhouse statistics.
- **Live Sync across Devices (WebSockets):** Watering out on the phone? The desktop 3D greenhouse updates the hydration status instantly using Native Node WebSockets.
- **Ambient Serenity Engine:** Allows toggling an immersive greenhouse audio environment loop directly from the UI.
- **3D Greenhouse Dashboard:** An Interactive visual UI built with React Three Fiber.

---

## 🏗 Architecture Stack

**Frontend:**
- React.js (TypeScript) powered by **Vite**
- **Tailwind CSS** for comprehensive styling
- **Framer Motion** for micro-interactions and smooth page transitions
- **React Three Fiber & Drei** strictly for rendering 3D plant elements on the canvas

**Backend:**
- **Node.js + Express** serving the main JSON endpoints
- **ws Server** for local WebSocket real-time broadcasts
- **SQLite3** for fast file-based synchronous database capabilities
- **LangChain.js + OpenAI** for the agentic problem-solving pipeline

---

## 🚀 Local Setup Instructions

### Environment Variables (.env)
Create a `.env` file inside the `backend/` directory:
```env
# OpenAI Key for the Langchain Agent
OPENAI_API_KEY=sk-...

# Optionally assign port
PORT=8000
```

### 1. Start the Node Backend
Navigate to the `backend/` directory from the project root:
```bash
cd backend

# Install dependencies
npm install

# Start the Express and WebSocket server
npm run dev
# or
npm start
```

### 2. Start the Frontend
In a new terminal, navigate to the `frontend/` directory:
```bash
cd frontend

# Install the necessary dependencies
npm install

# Start the Vite development mode
npm run dev
```
