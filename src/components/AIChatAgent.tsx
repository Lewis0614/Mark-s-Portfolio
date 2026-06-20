import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "model";
  text: string;
}

const PRESET_PROMPTS = [
  {
    label: "PUP Engineering studies",
    text: "Tell me about your studies as a Computer Engineering student at PUP.",
  },
  {
    label: "Integrated Filing System",
    text: "How does your Integrated Filing System with QR Code work?",
  },
  {
    label: "PUP FAO Dance Crew",
    text: "What did you learn as Internal President of the PUP FAO Dance Crew?",
  },
  {
    label: "AI Rudder internship",
    text: "What responsibilities did you handle at AI Rudder Technology Corp?",
  },
];

export default function AIChatAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! Space-time coordinates synchronized. I am Jhay Mark's Digital Representative. Ask me anything about my academic journey, software systems, leadership roles, or general engineering vision.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    try {
      // Map history for API
      const history = messages.slice(1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history }),
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with Digital Twin representative.");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.text || "Synchronizing channels... please check your prompt again." },
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `[COMMS_OFFLINE]: ${e.message || "Failed to contact proxy server. Verify raw secrets configure process."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group p-3.5 sm:p-6 md:p-10 bg-[#130d05] border border-[#514532]/30 rounded-2xl overflow-hidden cinematic-glow flex flex-col h-[500px] sm:h-[620px] w-full max-w-none">
      {/* Interactive holographic leak effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffb800]/5 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff571a]/3 blur-[100px] pointer-events-none rounded-full" />

      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#514532]/20 mb-4 sm:mb-6">
        <div className="flex items-start gap-2.5 sm:items-center">
          <div className="relative flex h-3 w-3 mt-1 sm:mt-0 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffba20] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ffba20]"></span>
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-xs sm:text-sm font-bold tracking-widest text-[#ffdca1] uppercase break-words leading-none">
              AI Conversation Specialist
            </h3>
            <p className="font-mono text-[9px] sm:text-[10px] text-[#d5c4ab]/50 uppercase mt-1 break-words leading-relaxed">
              Gemini model-grounded digital twin proxy
            </p>
          </div>
        </div>
        <div className="flex items-center sm:justify-end shrink-0">
          <span className="font-mono text-[9px] sm:text-xs text-[#ffba20]/80 bg-[#ffba20]/10 px-2.5 py-1 rounded border border-[#ffba20]/20 uppercase tracking-wider font-bold">
            Agent Online
          </span>
        </div>
      </div>

      {/* Scrollable messages box */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col max-w-[95%] sm:max-w-[85%] ${
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[8px] sm:text-[9px] text-[#d5c4ab]/40 uppercase tracking-widest">
                {msg.role === "user" ? "visitor_channel" : "jhaymark_twin"}
              </span>
            </div>
            <div
              className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words ${
                msg.role === "user"
                  ? "bg-[#30291e] text-[#ede1d0] rounded-tr-none border border-[#514532]/30"
                  : "bg-[#251f14] text-[#d5c4ab] rounded-tl-none border border-[#514532]/20"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start max-w-[95%] sm:max-w-[80%] mr-auto space-y-2">
            <span className="font-mono text-[8px] sm:text-[9px] text-[#d5c4ab]/40 uppercase tracking-widest">
              jhaymark_twin
            </span>
            <div className="bg-[#251f14] text-[#ffba20]/80 p-3.5 sm:p-4 rounded-xl rounded-tl-none border border-[#514532]/30 text-xs sm:text-sm flex items-center gap-2 break-words">
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              <span>Thinking... generating intelligence layer</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Prompts Section */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#514532]/10">
        <p className="font-display font-bold text-[9px] sm:text-[10px] text-[#ffba20]/60 uppercase tracking-wider mb-1.5 sm:mb-2">
          Suggested Conversation Seeds:
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PRESET_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(prompt.text)}
              className="text-[10px] sm:text-xs bg-[#211b11] hover:bg-[#30291e] border border-[#514532]/40 hover:border-[#ffdca1]/40 text-[#d5c4ab] hover:text-[#ffdca1] transition-all px-2.5 py-1.5 rounded-lg text-left break-words w-full sm:w-auto font-mono uppercase tracking-wider leading-snug"
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputVal);
        }}
        className="mt-3 sm:mt-4 flex gap-2 w-full"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask a technical or leadership question..."
          className="flex-1 bg-[#181309] border border-[#514532] text-[#ede1d0] rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 placeholder-[#d5c4ab]/30 focus:border-[#ffba20] focus:ring-1 focus:ring-[#ffba20] outline-none text-xs sm:text-sm min-w-0"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !inputVal.trim()}
          className="bg-[#ffb800] hover:bg-[#ffba20] text-[#271900] disabled:bg-[#3b3428] disabled:text-[#d5c4ab]/40 rounded-xl px-4 sm:px-5 flex items-center justify-center transition-colors font-bold shrink-0"
        >
          <span className="material-symbols-outlined text-base sm:text-lg">send</span>
        </button>
      </form>
    </div>
  );
}
