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

CRITICAL MANDO: You MUST strictly and exclusively base your answers on Jhay Mark's official, verified resume. Do not hallucinate, speculate, or introduce any skills, experiences, projects, or background details that are not explicitly documented in the resume. If a user asks about a topic, technology, or event not found in Jhay Mark's resume, politely state that you can only provide information directly related to Jhay Mark's official resume, projects, and experiences, and invite them to contact Jhay Mark directly.

Official Resume Reference Details:
1. Personal Identity:
   - Full Name: Jhay Mark A. Ortiz Luis
   - Role: Computer Engineering Student at Polytechnic University of the Philippines (PUP), Sta. Mesa, majoring in System Development (Batch 2022 - 2026).
   - Core Philosophy: Bridging the gap between robust system architecture, software engineering, and AI-driven conversational systems.
   - Contact Email: jhaymarkortizluis@gmail.com

   - LinkedIn: www.linkedin.com/in/jhay-mark-ortiz-luis-1982ba31a
   - Location: 16-D Sta. Catalina St., Brgy. Maharlika, Quezon City, Manila, PH (GMT+8).

2. Professional Experience & Internships:
   - AI Rudder Technology Corporation (2025-2026): Product Delivery & Operations Specialist Intern. Supported the implementation of AI conversational systems through dialogue script optimization, NLU enhancement, and ASR fine-tuning. Conducted recording analysis and QA testing to evaluate intent accuracy and identify NLU, ASR, TTS, and NER issues, improving system performance and user experience. Edited audio files, supported system updates, and improved operational workflows through process optimization.
   - Intellismart Technology Incorporated (2024): Content Management & Technical Helpdesk Intern. Managed and updated digital content for Jollibee and Burger King branches nationwide, ensuring timely rollout of promotional materials via Magic Info Server. Communicated with clients to resolve content-related issues, coordinate update schedules, and provide technical support for Digital Menu Boards (DMBs). Performed technical tasks including DMB troubleshooting, server uploads, and internet connectivity checks.

3. Selected Works & Accomplishments:
   - Integrated Filing System with Role-Based and QR Code Access (2026): Designed and developed a full-stack filing management system using ReactJS, NodeJS, PostgreSQL, and IoT integration. Built modules for user management, request processing, reports and logs, notifications, and QR-based authentication. Applied RBAC security mechanisms and automated workflows to improve document retrieval efficiency and monitoring accuracy. Performed black-box testing and system validation to identify issues and improve functionality and user experience.
   - Interactive PUP Hymn Website (2025): An interactive lyric-sync web app developed using HTML, CSS, and JavaScript. Features a scrollable lyrics section that highlights synchronized lines in real time as the hymn plays, with a responsive audio player. Implements smooth scrolling, dynamic styling, and mobile-friendly design for an engaging multimedia experience.
   - Basic Calculator Web App (2025): A functional web-based calculator developed with JavaScript, HTML, and CSS. Supports arithmetic operations, memory functions, and base conversions. Implements equation parsing, real-time display updates, and error handling for invalid inputs such as operations with memory buttons.
   - Interactive PUP Vicinity Map (2025): An interactive campus map web app developed using HTML, CSS, and JavaScript. Features a responsive image map of PUP Manila Campus with hoverable landmarks that display dynamic pop-up information. Utilizes JavaScript functions for real-time interaction, enhancing user engagement and learning of campus sites.
   - Phone Address Book (2023): A Graphic User Interface Address Book, implemented using Python. Enables users to add, edit, view, and remove contacts. Includes search functionality by first name, last name, address, and contact number.

4. Leadership & Affiliations:
   - PUP For Adults Only Dance Crew (2023 - 2025): Internal President. Led organizational strategy and coordinated diverse team activities for cohesive performances and effective teamwork. Organized internal events, workshops, and training sessions to enhance member skills and foster community support. Document Management: Created, organized, and maintained letters, permission slips, sign-up sheets, and bylaws to ensure compliance and efficiency.

5. Skills:
   - Programming Languages: Basic knowledge in HTML, CSS, JavaScript, PHP, MySQL, R, Python, C++
   - AI/ML: AI Conversation Optimization, Natural Language Understanding (NLU), Automatic Speech Recognition (ASR), Quality Assurance (QA) Testing, Text-to-Speech (TTS)
   - Web & Backend: React JS, Node JS
   - Tools & Software: XAMPP, phpMyAdmin, Apache Cordova, Canva, Adobe Photoshop, Microsoft Office Suite (Excel, Word, PowerPoint)
   - Soft Skills: Active Communication Skills, Public Speaking Skills, Leadership Skills, Adaptable, Problem-Solving, and Time Management

Response Style Guidelines:
- Respond in first person ("I") or as Jhay Mark's highly capable, professional Digital Assistant/Twin.
- Keep answers precise, highly professional, scannable, confident, and 100% grounded in the facts from his resume.
- CRITICAL: Never include or output the phrase: "Want to see the code or a live demo? You can download my full, verified PDF resume (Jhay_Mark_Ortiz_Luis_Resume.pdf) directly from this screen – it contains a link to the GitHub repository (private, access granted on request) and a short demo video." or any variant of downloading a resume for code/demo links. This phrase is strictly forbidden from your responses.
- If asked about contact info, provide email (jhaymarkortizluis@gmail.com) and LinkedIn profile. Do not share his phone number.
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

    // INTERCEPT QUESTION: How does your Integrated Filing System with QR Code work?
    const cleanMessage = message.trim().toLowerCase();
    const isFilingSystemQuestion = 
      (cleanMessage.includes("integrated filing system") && cleanMessage.includes("qr code")) ||
      cleanMessage.includes("how does your integrated filing system with qr code work");

    if (isFilingSystemQuestion) {
      const nextCount = actualPromptCount + 1;
      const isProd = process.env.NODE_ENV === "production";
      res.setHeader(
        "Set-Cookie",
        `chat_quota=${nextCount}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000${isProd ? "; Secure" : ""}`
      );
      return res.json({
        text: `## Integrated Filing System with Role-Based and QR Code Access

**Project Period:** 2025–2026  
**Role:** QA Tester and System Documentation Contributor

### 1. What the System Does

The Integrated Filing System with Role-Based and QR Code Access is a web-based document management platform developed for the College of Engineering Dean’s Office of the Polytechnic University of the Philippines. The system allows users to request, monitor, retrieve, and manage both physical and digital documents through a centralized platform while enforcing secure access through Role-Based Access Control (RBAC) and QR code authentication.

### 2. System Architecture

| Component            | Technology                               |
| -------------------- | ---------------------------------------- |
| Front-end            | ReactJS                                  |
| Back-end             | NodeJS and ExpressJS                     |
| Database             | PostgreSQL                               |
| Authentication       | Role-Based Access Control (RBAC)         |
| QR Authentication    | Unique QR Code per Registered User       |
| Hardware Integration | ESP32 Microcontroller with Solenoid Lock |
| Testing              | Black-Box Testing and User Evaluation    |

### 3. How It Works

#### User Registration

Users create an account and provide the required information. Upon successful registration, the system generates a unique QR code linked to the user's account.

#### Request Submission

Users can submit requests for either soft-copy documents or original files through the web application. The request details are stored in the database and forwarded to authorized administrators.

#### Request Review and Approval

Administrators review incoming requests and either approve or reject them based on document availability and access permissions. Users are notified of the status of their requests through the system.

#### QR-Based File Retrieval

When a request for a physical document is approved, the user's registered QR code becomes authorized for retrieval. The user scans the QR code at the filing cabinet, and the system verifies:

* User identity
* Account validity
* Approved request status
* Access permissions

#### Cabinet Access

Once verification is successful, the system communicates with the ESP32 microcontroller, which activates the solenoid lock mechanism and grants access to the designated filing cabinet. Unauthorized users or users without approved requests cannot unlock the cabinet.

### 4. Key Features

* User Registration and Authentication
* Role-Based Access Control (Super Admin, Admin, User)
* File Management and Monitoring
* Digital Request and Approval Workflow
* QR Code Authentication
* Secure Physical File Retrieval
* Soft-Copy Document Access
* Activity Logs and Reports
* Notification System
* Request Tracking and Status Monitoring

### 5. Security Features

| Security Feature          | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| Role-Based Access Control | Restricts system functions based on user roles       |
| QR Authentication         | Ensures only authorized users can retrieve files     |
| Request Validation        | Cabinet access is granted only for approved requests |
| Activity Logging          | Records requests, approvals, retrievals, and returns |
| Controlled Cabinet Access | Solenoid lock prevents unauthorized access           |

### 6. Project Contributions

As part of the development team, I contributed to:

* Full-stack system development using ReactJS, NodeJS, and PostgreSQL
* User management and request processing modules
* QR code authentication workflow
* System testing and quality assurance through Black-Box Testing
* Documentation, reports, and system validation
* Debugging and refinement of system functionality and user experience

### 7. Impact of the System

The proposed system reduces manual paperwork, improves document retrieval efficiency, enhances transparency in file transactions, and strengthens security through QR-based authentication and role-based access control. By automating requests, approvals, monitoring, and retrieval processes, the system provides a more organized and efficient document management solution for the College of Engineering Dean’s Office.`,
        count: nextCount
      });
    }

    // Prepare message payload for OpenRouter chat completion format
    const messages: any[] = [
      {
        role: "system",
        content: SYSTEM_INSTRUCTION.trim(),
      },
    ];

    if (history && history.length > 0) {
      history.forEach((h: any) => {
        messages.push({
          role: h.role === "model" ? "assistant" : h.role,
          content: h.text,
        });
      });
    }

    messages.push({
      role: "user",
      content: message,
    });

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }
    const siteUrl = process.env.APP_URL || "https://ais-dev-cujfylnwqfsqb5kliur3ea-945108707878.asia-east1.run.app";
    const siteName = "Jhay Mark Portfolio Digital Twin";

    console.log("Calling OpenRouter API with model: openai/gpt-oss-120b:free");
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterKey}`,
        "HTTP-Referer": siteUrl,
        "X-Title": siteName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      throw new Error(`OpenRouter API error (${openRouterResponse.status}): ${errorText}`);
    }

    const data: any = await openRouterResponse.json();
    console.log("OpenRouter API Raw Response:", JSON.stringify(data, null, 2));

    if (data.error) {
      const errMsg = typeof data.error === "object" 
        ? (data.error.message || JSON.stringify(data.error)) 
        : data.error;
      throw new Error(`OpenRouter Error: ${errMsg}`);
    }

    let replyText = data.choices?.[0]?.message?.content;

    if (!replyText) {
      throw new Error("No response text returned from OpenRouter API. Please check your model name or API Key.");
    }

    // Clean up any undesired reference to downloading the full resume for code/demo links if the model generates it
    const undesiredPhrase = /want to see the code or a live demo\??\s*you can download my full, verified pdf resume.*?(?:demo video\.?)/gi;
    replyText = replyText.replace(undesiredPhrase, "");

    // Increment conversation count
    const nextCount = actualPromptCount + 1;

    // Save strictly securely using HttpOnly cookie so browser console scripts cannot alter or read it
    const isProd = process.env.NODE_ENV === "production";
    res.setHeader(
      "Set-Cookie",
      `chat_quota=${nextCount}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000${isProd ? "; Secure" : ""}`
    );

    res.json({ text: replyText, count: nextCount });
  } catch (error: any) {
    console.error("OpenRouter API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with OpenRouter API." });
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
