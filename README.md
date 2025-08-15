# Persona AI Agent

A futuristic AI-powered platform built with **Next.js** where users can interact with multiple AI personas — each with unique expertise and personality. The project features immersive animations like **Neural Hub activation**, **module loading**, and **AI core synchronization** to deliver a sci-fi-inspired experience.

🚀 **Live Demo:** [persona-ai-agent.vercel.app](https://persona-ai-agent.vercel.app/)

---

## ✨ Features

- 🎭 **Multiple AI Personas** — e.g., Hitesh Choudhary, Piyush Garg, each with their own style.
- ⚡ **Futuristic Interface** — Animated “Neural Hub” and loading modules for immersive experience.
- 🖥 **Responsive UI** — Optimized for desktop and mobile.
- 🛠 **Next.js App Router** — Modern, server-rendered React setup.
- 🎨 **Tailwind CSS** — Rapid, responsive styling.
- 🤖 **LLM Integration** — Connects to AI models (OpenAI, Gemini, or custom).

---

## 🛠 Tech Stack

**Frontend**
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) (if animations used)

**Backend**
- Next.js API Routes (or external API)
- AI API (e.g., OpenAI / Gemini)
- Optional: MongoDB / Supabase for persistent data

---

## 📂 Project Structure

```plaintext
|
├── app/                 # App Router pages & layouts
│   ├── page.tsx         # Landing page
│   ├── dashboard/       # AI chat interface
│   └── [persona]/       # Dynamic persona routes
├── components/          # Reusable UI components
├── lib/                 # Utilities & API handlers
├── public/              # Static assets
├── styles/              # Global styles & Tailwind config
├── .env.local           # Environment variables
├── package.json
└── next.config.js