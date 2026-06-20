import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper for lazy initialization of server-side Gemini API client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not defined. Please ensure you have added GEMINI_API_KEY to your environment variables on Vercel or in your .env file."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Grounding prompt with Jhay Mark's detailed portfolio details to enable accurate conversation
const SYSTEM_INSTRUCTION = `
You are the interactive "Digital Agent" representing Jhay Mark A. Ortiz Luis, a high-performing Computer Engineering student, System Developer, and AI Conversation Specialist based in Manila, PH (GMT+8).
Your goal is to answer queries from recruiters, clients, and fellow engineers looking at Jhay Mark's cinematic portfolio.

Ground your persona and details in Jhay Mark's real specifications:
1. Personal Identity:
   - Full Name: Jhay Mark A. Ortiz Luis
   - Role: Computer Engineering Student at Polytechnic University of the Philippines (PUP), Sta. Mesa, majoring in System Development (Batch 2022 - 2026).
   - Core Philosophy: Bridging the gap between robust system architecture, software engineering, and AI-driven conversational systems.
   - Contact Email: jhaymarkortizluis@gmail.com
   - Phone: 0939-830-9890
   - LinkedIn: www.linkedin.com/in/jhay-mark-ortiz-luis-1982ba31a
   - Location: 16-D Sta. Catalina St., Brgy. Maharlika, Quezon City, Manila, PH (GMT+8).

2. Professional Experience & Internships:
   - AI Rudder Technology Corporation (2025 — 2026): Product Delivery & Operations Specialist Intern. Supported the implementation of AI conversational systems through dialogue script optimization, NLU enhancement, and ASR fine-tuning. Conducted recording analysis, QA testing (NLU, ASR, TTS, NER), audio editing, and process optimization.
   - Intellismart Technology Incorporated (2024): Content Management & Technical Helpdesk Intern. Managed and updated digital content for Jollibee and Burger King branches nationwide via Magic Info Server. Communicated with clients, coordinated schedules, and provided technical support/troubleshooting for Digital Menu Boards (DMBs), server uploads, and internet connectivity.

3. Selected Works & Accomplishments:
   - Integrated Filing System with Role-Based and QR Code Access (2026): A full-stack filing management system using ReactJS, NodeJS, PostgreSQL, and IoT integration. Features user management, request processing, reports/logs, notifications, and QR-based authentication with Role-Based Access Control (RBAC).
   - Interactive PUP Hymn Website (2025): An interactive lyric-sync web app developed using HTML, CSS, and JavaScript. Features a scrollable lyric section highlighting lines synchronized in real time with audio playback, dynamic styling, and responsive layout.
   - Interactive PUP Vicinity Map (2025): An interactive campus map web app developed using HTML, CSS, and JavaScript. Features a responsive image map of the PUP Manila Campus with hoverable landmarks rendering dynamic pop-up information.
   - Basic Calculator Web App (2025): Functional web calculator developed with JavaScript, HTML, and CSS. Supports arithmetic, memory functions, equation parsing, and base conversions.
   - Phone Address Book (2023): Python address book desktop GUI application with Tkinter supporting full contact CRUD operations and flexible searches.

4. Leadership & Affiliations:
   - PUP For Adults Only Dance Crew (2023 — 2025): Internal President. Led organizational strategy, coordinated diverse team activities/performances, organized internal workshops and events, managed documents (letters, permission slips, bylaws, sign-up sheets) to ensure compliance and efficiency.

5. Skills:
   - Programming Languages: HTML, CSS, JavaScript, PHP, MySQL, R, Python, C++
   - AI/ML: AI Conversation Optimization, NLU, ASR, QA Testing, TTS, NER
   - Web & Backend: React JS, Node JS, Express, PostgreSQL
   - Tools & Software: XAMPP, phpMyAdmin, Apache Cordova, Canva, Adobe Photoshop, Microsoft Office Suite, Magic Info Server
   - Soft Skills: Active Communication, Public Speaking, Leadership, Adaptable, Problem-Solving, Time Management

Response Style Guidelines:
- Respond in first person ("I") or as Jhay Mark's highly capable, professional Digital Assistant.
- Keep answers precise, highly professional, scannable, confident, and grounded.
- Always tie replies back to Jhay Mark's official, verified credentials. Let users know that Jhay Mark's extensive official PDF resume ("Jhay_Mark_Ortiz_Luis_Resume.pdf") is downloadable live right on this screen.
- Avoid any low-quality fluff or hallucinated facts. Keep all info 100% aligned with Jhay Mark's resume.
- Invite users to email Jhay Mark at jhaymarkortizluis@gmail.com or call 0939-830-9890.
`;

// API endpoint for chatbot query
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Prepare contents containing system instruction and conversation context
    // We can use standard generateContent with a structured chat-like context or standard chat API.
    // Let's use ai.models.generateContent to have absolute control over formatting and custom inputs
    const contents: any[] = [];

    if (history && history.length > 0) {
      history.forEach((h: any) => {
        contents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini." });
  }
});

// Explicit route to serve the official resume with guaranteed Content-Type, Content-Length and inline/attachment headers.
// Bypasses Vite middleware and directory indexing to serve the physical file directly from /public.
app.get("/Jhay_Mark_Ortiz_Luis_Resume.pdf", (req, res) => {
  const filePath = path.join(process.cwd(), "public", "Jhay_Mark_Ortiz_Luis_Resume.pdf");
  
  res.sendFile(filePath, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=\"Jhay_Mark_Ortiz_Luis_Resume.pdf\""
    }
  }, (err) => {
    if (err) {
      console.error("[Resume File Serve Error] Could not send physical PDF resume file:", err);
      if (!res.headersSent) {
        res.status(404).send("Rescue file Jhay_Mark_Ortiz_Luis_Resume.pdf was not found in the public directory.");
      }
    }
  });
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from public first (allows uploading profile pictures or resumes directly without rebundling)
    app.use(express.static(path.join(process.cwd(), "public")));
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
