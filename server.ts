import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Safe, serverless-compatible body parser middleware to prevent stream-read hanging
app.use((req: any, res, next) => {
  // If body is already parsed (e.g. by Vercel or other serverless environment)
  if (req.body !== undefined) {
    if (typeof req.body === "string" && req.body.trim()) {
      try {
        req.body = JSON.parse(req.body);
      } catch (_) {
        // Keep as raw string
      }
    }
    return next();
  }

  const methodsWithBody = ["POST", "PUT", "PATCH", "DELETE"];
  if (!methodsWithBody.includes(req.method)) {
    return next();
  }

  // If content-length is 0 or undefined, there's no body to parse
  const contentLength = req.headers["content-length"];
  if (contentLength === "0") {
    req.body = {};
    return next();
  }

  // If the stream is already complete or not readable, don't try to parse
  if (req.complete || !req.readable) {
    req.body = {};
    return next();
  }

  // Safe custom stream accumulator with a 2-second hard timeout to prevent hanging
  let data = "";
  let isDone = false;

  const timeout = setTimeout(() => {
    if (!isDone) {
      isDone = true;
      console.warn("[Body Parser Timeout] Request body reading timed out. Stream might have been pre-consumed.");
      req.body = {};
      next();
    }
  }, 2000);

  req.on("data", (chunk: any) => {
    if (!isDone) {
      data += chunk;
    }
  });

  req.on("end", () => {
    if (!isDone) {
      isDone = true;
      clearTimeout(timeout);
      if (data.trim()) {
        try {
          req.body = JSON.parse(data);
        } catch (_) {
          req.body = data; // fallback to raw string
        }
      } else {
        req.body = {};
      }
      next();
    }
  });

  req.on("error", (err: any) => {
    if (!isDone) {
      isDone = true;
      clearTimeout(timeout);
      console.error("[Body Parser Error] Stream error:", err);
      req.body = {};
      next();
    }
  });
});

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

function parseCookies(cookieHeader?: string) {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });
  return cookies;
}

// API endpoint to return current chat status and remaining quota
app.get("/api/chat/status", (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const cookieCountStr = cookies["chat_quota"];
  let currentCount = cookieCountStr ? parseInt(cookieCountStr, 10) : 0;
  if (isNaN(currentCount)) currentCount = 0;
  res.json({ count: currentCount });
});

// API endpoint for chatbot query
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Parse cookie-based session count
    const cookies = parseCookies(req.headers.cookie);
    const cookieCountStr = cookies["chat_quota"];
    let cookieCount = cookieCountStr ? parseInt(cookieCountStr, 10) : 0;
    if (isNaN(cookieCount)) cookieCount = 0;

    // Count user messages in the chat history
    const userPromptsInHistory = history ? history.filter((h: any) => h.role === "user").length : 0;

    // Use the maximum of either value to protect against browser console bypasses
    const actualPromptCount = Math.max(cookieCount, userPromptsInHistory);

    // If quota is already filled (>= 5 user prompts have been addressed), directly block and send the final closing message
    if (actualPromptCount >= 5) {
      return res.json({
        text: `Transmission quota reached.

Thank you for your interest in my portfolio and professional background. For further information regarding my projects, technical expertise, internship experience, leadership roles, or potential collaboration opportunities, please contact me directly via email at jhaymarkortizluis@gmail.com or submit a message through the Secure Transmission Channel available on this website.

I look forward to connecting with you.

— Jhay Mark A. Ortiz Luis`,
        count: actualPromptCount,
        quotaReached: true,
      });
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
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    // Increment conversation count
    const nextCount = actualPromptCount + 1;

    // Save strictly securely using HttpOnly cookie so browser console scripts cannot alter or read it
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      `chat_quota=${nextCount}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000${isProd ? "; Secure" : ""}`
    );

    res.json({ text: response.text, count: nextCount });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini." });
  }
});

// Secure contact submission route utilizing Resend
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate inputs
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ status: "error", error: "Your signature name is required." });
    }
    const emailStr = typeof email === "string" ? email.trim() : "";
    if (!emailStr || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr)) {
      return res.status(400).json({ status: "error", error: "A valid email pipeline address is required." });
    }
    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return res.status(400).json({ status: "error", error: "A collaboration subject domain is required." });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ status: "error", error: "An encoded message payload is required." });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Resend Config Error] RESEND_API_KEY environment variable is not defined on the server.");
      return res.status(500).json({
        status: "error",
        error: "Email service unconfigured. Please define RESEND_API_KEY in your env settings."
      });
    }

    const destinationEmail = process.env.CONTACT_TO_EMAIL || "jhaymarkortizluis@gmail.com";

    let manilaTimeStr = "";
    try {
      manilaTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    } catch (e) {
      manilaTimeStr = new Date().toISOString() + " (UTC)";
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [destinationEmail],
        reply_to: emailStr,
        subject: `[Portfolio] ${subject}: ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; background-color: #fafafa; color: #181309;">
            <h2 style="color: #ffba20; border-bottom: 2px solid #ffba20; padding-bottom: 8px; margin-top: 0;">Secure Transmission Received</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; width: 120px; vertical-align: top;">Name:</td>
                <td style="padding: 6px 0; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Email:</td>
                <td style="padding: 6px 0; color: #333;"><a href="mailto:${emailStr}">${emailStr}</a></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Subject:</td>
                <td style="padding: 6px 0; color: #333;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0 6px 0; font-weight: bold; vertical-align: top;" colspan="2">Message:</td>
              </tr>
              <tr>
                <td style="padding: 12px; background-color: #fff; border: 1px solid #e1e1e1; border-radius: 6px; white-space: pre-wrap; font-family: sans-serif; font-size: 14px; line-height: 1.5; color: #111;" colspan="2">${message}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 25px 0 15px 0;">
            <p style="font-size: 11px; color: #777; margin: 0;">
              <strong>Timestamp:</strong> ${manilaTimeStr} (Manila Time)<br>
              <strong>Source:</strong> Portfolio Secure Transmission Channel
            </p>
          </div>
        `
      })
    });

    let resultData: any = {};
    const responseText = await emailResponse.text();
    try {
      resultData = JSON.parse(responseText);
    } catch (_) {
      resultData = { error: { message: responseText } };
    }

    if (!emailResponse.ok || resultData.error) {
      console.error("Resend API returned an error:", resultData.error);
      return res.status(500).json({
        status: "error",
        error: `Resend Error: ${resultData.error?.message || "Unable to send message."}`
      });
    }

    res.json({ status: "success", data: resultData });
  } catch (error: any) {
    console.error("Exception in /api/contact route:", error);
    res.status(500).json({
      status: "error",
      error: error.message || "An error occurred with Resend mailer."
    });
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
    const { createServer: createViteServer } = await import("vite");
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
