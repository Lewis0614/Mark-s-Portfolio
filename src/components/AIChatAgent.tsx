import { useState, useRef, useEffect } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, Send, RefreshCw } from "lucide-react";

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

// Helper to extract plain text from React Node
const getTextContent = (node: any): string => {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node.props && node.props.children) return getTextContent(node.props.children);
  return "";
};

// Helper to extract headers and rows from Markdown table children
const extractTableData = (children: React.ReactNode) => {
  const headers: string[] = [];
  const rows: any[][] = [];

  const toArray = (c: React.ReactNode): any[] => {
    if (!c) return [];
    if (Array.isArray(c)) return c.filter(Boolean);
    return [c];
  };

  const childrenArray = toArray(children);

  childrenArray.forEach((child: any) => {
    if (!child || !child.props) return;

    if (child.type === "thead") {
      const trs = toArray(child.props.children);
      trs.forEach((tr: any) => {
        if (!tr || !tr.props) return;
        const ths = toArray(tr.props.children);
        ths.forEach((th: any) => {
          headers.push(getTextContent(th));
        });
      });
    } else if (child.type === "tbody") {
      const trs = toArray(child.props.children);
      trs.forEach((tr: any) => {
        if (!tr || !tr.props) return;
        const tds = toArray(tr.props.children);
        const rowData: any[] = [];
        tds.forEach((td: any) => {
          if (td && td.props) {
            rowData.push(td.props.children || "");
          } else {
            rowData.push(td || "");
          }
        });
        if (rowData.length > 0) {
          rows.push(rowData);
        }
      });
    } else if (child.props.children) {
      const subRes = extractTableData(child.props.children);
      if (subRes.headers.length > 0) headers.push(...subRes.headers);
      if (subRes.rows.length > 0) rows.push(...subRes.rows);
    }
  });

  return { headers, rows };
};

// Helper to parse and render table cell content beautifully, handling raw <br> tags, bullets and secondary information
const renderCellContent = (node: any): any => {
  if (!node) return "";

  if (typeof node === "string") {
    const brRegex = /(?:<\s*br\s*\/?>|\r?\n)/gi;
    if (brRegex.test(node)) {
      const lines = node.split(brRegex);
      return (
        <div className="space-y-1.5 font-sans">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            // Check if it starts with a bullet point (e.g. • or * or -)
            if (trimmed.startsWith("•") || trimmed.startsWith("*") || trimmed.startsWith("-")) {
              const cleanLine = trimmed.replace(/^[•*-\s]+/, "").trim();
              return (
                <div key={idx} className="font-semibold text-[#ffdca1]/95 flex items-start gap-1.5 mt-2.5 first:mt-0 text-[11px] sm:text-xs leading-relaxed">
                  <span className="text-[#ffba20] select-none text-[12px] leading-none">•</span>
                  <span>{cleanLine}</span>
                </div>
              );
            }

            // Check if it starts with '(' or is a secondary detail line (e.g. tech details or descriptions)
            if (trimmed.startsWith("(")) {
              return (
                <div key={idx} className="pl-3.5 text-[#d5c4ab]/70 text-[10.5px] sm:text-[11px] leading-relaxed italic">
                  {trimmed}
                </div>
              );
            }

            // Otherwise, it's a job title, date, or other details
            return (
              <div key={idx} className="pl-3.5 text-[#ffdca1]/80 font-mono text-[9px] uppercase tracking-wider mt-0.5 leading-relaxed">
                {trimmed}
              </div>
            );
          })}
        </div>
      );
    }
    return node;
  }

  if (Array.isArray(node)) {
    const hasBr = node.some(item => typeof item === "string" && /(?:<\s*br\s*\/?>|\r?\n)/gi.test(item));
    if (hasBr) {
      const mergedText = node.map(item => {
        if (typeof item === "string") return item;
        return getTextContent(item);
      }).join("");
      return renderCellContent(mergedText);
    }
    return node.map((item, idx) => <span key={idx}>{renderCellContent(item)}</span>);
  }

  if (node && node.props && node.props.children) {
    return renderCellContent(node.props.children);
  }

  return node;
};

// Collapsible Mobile Table Card Component
function MobileTableCard({
  title,
  subtitle,
  details,
  headers,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  details: React.ReactNode[];
  headers: string[];
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-[#181309]/50 border border-[#514532]/40 rounded-xl overflow-hidden transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left bg-[#1f190e]/30 hover:bg-[#1f190e]/65 transition-colors focus:outline-none"
      >
        <div className="font-display font-bold text-xs sm:text-sm text-[#ffdca1] tracking-wide flex-1 pr-2">
          {title}
        </div>
        <ChevronDown
          className="text-[#ffdca1] w-4 h-4 shrink-0 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <div className="p-3.5 space-y-2.5 border-t border-[#514532]/25 bg-[#130d05]/25 text-xs">
          {subtitle && (
            <div className="text-[#ede1d0] font-medium leading-relaxed pb-1.5 border-b border-[#514532]/15 mb-2 font-mono">
              {subtitle}
            </div>
          )}
          {details.map((detail, idx) => {
            const headerName = headers[idx + 2] || "Details";
            return (
              <div key={idx} className="space-y-1">
                {headers.length > 3 && (
                  <div className="text-[9px] uppercase tracking-wider font-mono text-[#d5c4ab]/40">
                    {headerName}
                  </div>
                )}
                <div className="text-[#d5c4ab] leading-relaxed break-words">
                  {renderCellContent(detail)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AIChatAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! Space-time coordinates synchronized. I am Jhay Mark's Digital Representative. Ask me anything about my academic journey, software systems, leadership roles, or general engineering vision.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usedPrompts, setUsedPrompts] = useState<number>(0);
  const [isMobile, setIsMobile] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Handle window resizing to detect mobile screen width dynamically
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync remaining quota from browser HttpOnly cookie session status on mount
  useEffect(() => {
    const fetchQuotaStatus = async () => {
      try {
        const res = await fetch("/api/chat/status");
        if (res.ok) {
          const data = await res.json();
          if (data.count !== undefined) {
            setUsedPrompts(data.count);
            if (data.count >= 5) {
              setMessages((prev) => {
                // Ensure we do not duplicate the closing transmission message
                if (prev.some((m) => m.text.includes("Transmission quota reached."))) {
                  return prev;
                }
                return [
                  ...prev,
                  {
                    role: "model",
                    text: `Transmission quota reached.

Thank you for your interest in my portfolio and professional background. For further information regarding my projects, technical expertise, internship experience, leadership roles, or potential collaboration opportunities, please contact me directly via email at jhaymarkortizluis@gmail.com or submit a message through the Secure Transmission Channel available on this website.

I look forward to connecting with you.

— Jhay Mark A. Ortiz Luis`,
                  },
                ];
              });
            }
          }
        }
      } catch (err) {
        console.error("Error fetching quota status:", err);
      }
    };
    fetchQuotaStatus();
  }, []);

  // Auto scroll inside the messages container only, avoiding window-disturbing scrollIntoView
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading || usedPrompts >= 5) return;

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
        let errorMsg = "Failed to communicate with Digital Twin representative.";
        try {
          const errData = await res.json();
          if (errData && (errData.error || errData.message)) {
            errorMsg = errData.error || errData.message;
          }
        } catch (jsonErr) {
          try {
            const rawText = await res.text();
            if (rawText && rawText.length < 200) {
              errorMsg = rawText;
            }
          } catch (textErr) {}
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      
      setMessages((prev) => {
        const nextMsgs = [
          ...prev,
          { role: "model" as const, text: data.text || "Synchronizing channels... please check your prompt again." }
        ];

        // If the backend has fulfilled prompt 5, immediately append closure
        const finalCount = data.count !== undefined ? data.count : (usedPrompts + 1);
        if (finalCount >= 5) {
          nextMsgs.push({
            role: "model",
            text: `Transmission quota reached.

Thank you for your interest in my portfolio and professional background. For further information regarding my projects, technical expertise, internship experience, leadership roles, or potential collaboration opportunities, please contact me directly via email at jhaymarkortizluis@gmail.com or submit a message through the Secure Transmission Channel available on this website.

I look forward to connecting with you.

— Jhay Mark A. Ortiz Luis`,
          });
        }
        return nextMsgs;
      });

      if (data.count !== undefined) {
        setUsedPrompts(data.count);
      } else {
        setUsedPrompts((prev) => prev + 1);
      }
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

  const isQuotaReached = usedPrompts >= 5;
  const remainingCount = Math.max(0, 5 - usedPrompts);

  return (
    <div className="relative group p-3 sm:p-5 md:p-8 bg-[#130d05] border border-[#514532]/30 rounded-2xl overflow-hidden cinematic-glow flex flex-col h-[520px] sm:h-[600px] md:h-[620px] w-full max-w-none transition-all duration-300">
      {/* Interactive holographic leak effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffb800]/5 blur-[80px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ff571a]/3 blur-[100px] pointer-events-none rounded-full" />

      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#514532]/20 mb-3 sm:mb-5">
        <div className="flex items-start gap-2.5 sm:items-center">
          <div className="relative flex h-3 w-3 mt-1 sm:mt-0 shrink-0">
            <span className={`${isQuotaReached ? "bg-red-500 animate-pulse" : "bg-[#ffba20] animate-ping"} absolute inline-flex h-full w-full rounded-full opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isQuotaReached ? "bg-red-500" : "bg-[#ffba20]"}`}></span>
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
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 sm:justify-end shrink-0 w-full sm:w-auto">
          <span className="font-mono text-[8px] xs:text-[9px] sm:text-xs text-[#d5c4ab]/70 bg-[#251f14] px-2 py-0.5 xs:px-2.5 xs:py-1 rounded border border-[#514532]/30 uppercase tracking-wider font-semibold">
            Remaining Conversations: {remainingCount}/5
          </span>
          <span className={`font-mono text-[8px] xs:text-[9px] sm:text-xs px-2 py-0.5 xs:px-2.5 xs:py-1 rounded border uppercase tracking-wider font-bold transition-all duration-300 ${
            isQuotaReached
              ? "text-red-500 bg-red-500/10 border-red-500/20"
              : "text-[#ffba20]/80 bg-[#ffba20]/10 border-[#ffba20]/20"
          }`}>
            {isQuotaReached ? "Quota Reached" : "Agent Online"}
          </span>
        </div>
      </div>

      {/* Scrollable messages box */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pr-1 md:pr-2 scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col w-full ${
              msg.role === "user"
                ? "max-w-full sm:max-w-[85%] md:max-w-[60%] ml-auto items-end animate-fade-in"
                : "max-w-full sm:max-w-[85%] mr-auto items-start animate-fade-in"
            }`}
          >
            <div className={`flex items-center gap-2 ${msg.role === "user" ? "mb-0.5" : "mb-1"}`}>
              <span className="font-mono text-[8px] sm:text-[9px] text-[#d5c4ab]/40 uppercase tracking-widest">
                {msg.role === "user" ? "visitor_channel" : "jhaymark_twin"}
              </span>
            </div>
            <div
              className={`p-3 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed break-words ${
                msg.role === "user"
                  ? "bg-[#30291e] text-[#ede1d0] rounded-tr-none border border-[#514532]/30 whitespace-pre-wrap ml-auto w-auto max-w-[90%] sm:max-w-full"
                  : "bg-[#251f14] text-[#d5c4ab] rounded-tl-none border border-[#514532]/20 w-full"
              }`}
            >
              {msg.role === "user" ? (
                msg.text
              ) : (
                <div className="markdown-body text-[#d5c4ab] space-y-2 overflow-x-visible w-full">
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 className="text-base font-bold text-[#ffdca1] mt-3 mb-1.5" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="text-sm font-bold text-[#ffdca1] mt-2.5 mb-1" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-xs font-bold text-[#ffdca1] mt-2 mb-1" {...props} />,
                      p: ({ node, ...props }) => <p className="leading-relaxed mb-2 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                      ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-bold text-[#ffdca1]" {...props} />,
                      em: ({ node, ...props }) => <em className="italic" {...props} />,
                      table: ({ node, children, ...props }) => {
                        if (!isMobile) {
                          return (
                            <div className="overflow-x-auto my-4 w-full rounded-lg border border-[#514532]/30">
                              <table className="w-full text-left border-collapse text-xs sm:text-sm" {...props}>
                                {children}
                              </table>
                            </div>
                          );
                        }

                        // On mobile, convert to collapsible accordion-style cards
                        try {
                          const { headers, rows } = extractTableData(children);

                          if (rows.length === 0) {
                            return (
                              <div className="overflow-x-auto my-4 w-full rounded-lg border border-[#514532]/30">
                                <table className="w-full text-left border-collapse text-xs" {...props}>
                                  {children}
                                </table>
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-2.5 my-3 w-full">
                              {rows.map((row, rowIndex) => {
                                const title = row[0] || `Item ${rowIndex + 1}`;
                                const subtitle = row[1];
                                const details = row.slice(2);

                                return (
                                  <MobileTableCard
                                    key={rowIndex}
                                    title={title}
                                    subtitle={subtitle}
                                    details={details}
                                    headers={headers}
                                  />
                                );
                              })}
                            </div>
                          );
                        } catch (err) {
                          console.error("Error rendering responsive table:", err);
                          return (
                            <div className="overflow-x-auto my-4 w-full rounded-lg border border-[#514532]/30">
                              <table className="w-full text-left border-collapse text-xs" {...props}>
                                {children}
                              </table>
                            </div>
                          );
                        }
                      },
                      thead: ({ node, ...props }) => <thead className="bg-[#181309] text-[#ffdca1] font-semibold border-b border-[#514532]/30" {...props} />,
                      tbody: ({ node, ...props }) => <tbody className="divide-y divide-[#514532]/20" {...props} />,
                      tr: ({ node, ...props }) => <tr className="hover:bg-[#181309]/35 odd:bg-[#1f190e]/20 transition-colors" {...props} />,
                      th: ({ node, ...props }) => <th className="px-3 py-2 text-xs uppercase font-mono tracking-wider border-r last:border-r-0 border-[#514532]/30" {...props} />,
                      td: ({ node, children, ...props }) => (
                        <td className="px-3 py-2 text-xs text-[#d5c4ab]/90 border-r last:border-r-0 border-[#514532]/25" {...props}>
                          {renderCellContent(children)}
                        </td>
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-[#ffba20] hover:underline hover:text-[#ffdca1] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      code: ({ className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline = !match && typeof children === "string" && !children.includes("\n");
                        return isInline ? (
                          <code className="bg-[#181309] text-[#ffba20] px-1.5 py-0.5 rounded font-mono text-xs" {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-[#181309] p-3 rounded-lg border border-[#514532]/30 overflow-x-auto my-2">
                            <code className="font-mono text-xs block text-[#ede1d0]" {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      },
                    }}
                  >
                    {msg.text}
                  </Markdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start w-full max-w-full sm:max-w-[80%] mr-auto space-y-2">
            <span className="font-mono text-[8px] sm:text-[9px] text-[#d5c4ab]/40 uppercase tracking-widest">
              jhaymark_twin
            </span>
            <div className="bg-[#251f14] text-[#ffba20]/80 p-3 sm:p-4 rounded-xl rounded-tl-none border border-[#514532]/30 text-xs sm:text-sm flex items-center gap-2.5 break-words">
              <RefreshCw className="animate-spin text-sm w-3.5 h-3.5 text-[#ffba20]" />
              <span>Thinking... generating intelligence layer</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Prompts Section - wrap into multiple inline chips gracefully */}
      <div className="mt-2.5 sm:mt-4 pt-2.5 sm:pt-4 border-t border-[#514532]/10">
        <p className="font-display font-bold text-[9px] sm:text-[10px] text-[#ffba20]/60 uppercase tracking-wider mb-1.5 sm:mb-2">
          Suggested Conversation Seeds:
        </p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {PRESET_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={isLoading || isQuotaReached}
              onClick={() => handleSend(prompt.text)}
              className="text-[10px] sm:text-xs bg-[#211b11] hover:bg-[#30291e] border border-[#514532]/40 hover:border-[#ffdca1]/40 text-[#d5c4ab] hover:text-[#ffdca1] transition-all px-2.5 py-1.5 rounded-lg text-left break-words font-mono uppercase tracking-wider leading-snug disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#211b11]"
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
        className="mt-2.5 sm:mt-4 flex gap-2 w-full"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={isQuotaReached ? "Quota reached. Under freeze." : "Ask a technical or leadership question..."}
          className="flex-1 bg-[#181309] border border-[#514532] text-[#ede1d0] rounded-xl px-3 h-11 sm:h-12 placeholder-[#d5c4ab]/30 focus:border-[#ffba20] focus:ring-1 focus:ring-[#ffba20] outline-none text-xs sm:text-sm min-w-0 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={isLoading || isQuotaReached}
        />
        <button
          type="submit"
          disabled={isLoading || isQuotaReached || !inputVal.trim()}
          className="bg-[#ffb800] hover:bg-[#ffba20] text-[#271900] disabled:bg-[#3b3428] disabled:text-[#d5c4ab]/40 rounded-xl w-11 sm:w-12 h-11 sm:h-12 flex items-center justify-center transition-colors font-bold shrink-0 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4 sm:w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
