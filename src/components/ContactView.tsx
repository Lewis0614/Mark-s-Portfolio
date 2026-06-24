import { useState, FormEvent } from "react";
import { PROFILE } from "../data";
import { downloadResume } from "../utils/downloadResume";
import AIChatAgent from "./AIChatAgent";
import Footer from "./Footer";

interface ContactViewProps {
  onNavigate: (tab: string) => void;
}

export default function ContactView({ onNavigate }: ContactViewProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Collaboration");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendStep, setSendStep] = useState(0); // 0: idle, 1: establishing, 2: encrypting, 3: transmitting
  const [showToast, setShowToast] = useState(false);
  const [submittedMessages, setSubmittedMessages] = useState<any[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const [activeActionIdx, setActiveActionIdx] = useState<number | null>(null);

  const validateForm = () => {
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) {
      errors.name = "Your Signature Name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Signature Name must be at least 2 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "E-Mail Pipeline Address is required.";
    } else if (!emailPattern.test(email.trim())) {
      errors.email = "Please enter a valid e-mail address.";
    }

    if (!message.trim()) {
      errors.message = "Encoded Message Payload is required.";
    } else if (message.trim().length < 10) {
      errors.message = "Message payload must be at least 10 characters.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setIsError(false);
    setErrorMessage("");
    setSendStep(1);

    const stepIntervals: NodeJS.Timeout[] = [];
    stepIntervals.push(setTimeout(() => setSendStep(2), 600));
    stepIntervals.push(setTimeout(() => setSendStep(3), 1200));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
        }),
      });

      let result: any = {};
      const responseText = await response.text();
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        // Safe fallback if response is not valid JSON
        result = { error: responseText || "Unable to establish secure delivery due to server response format." };
      }

      // Ensure that our neat security sequencing completes gracefully
      await new Promise((resolve) => setTimeout(resolve, 1800));
      stepIntervals.forEach((t) => clearTimeout(t));

      if (response.ok && result.status === "success") {
        setIsSuccess(true);
        const newSubmission = {
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
          date: new Date().toLocaleTimeString(),
        };
        setSubmittedMessages((prev) => [newSubmission, ...prev]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);

        // Auto-reset the form after 3 seconds to allow sending multiple messages
        setTimeout(() => {
          setName("");
          setEmail("");
          setSubject("General Collaboration");
          setMessage("");
          setIsSuccess(false);
          setIsError(false);
          setErrorMessage("");
          setValidationErrors({});
        }, 3000);
      } else {
        setIsError(true);
        let cleanErr = "Unable to establish secure delivery at this time. Please try again in a moment.";
        if (result.error && typeof result.error === "string") {
          const lower = result.error.toLowerCase();
          if (
            lower.includes("unconfigured") ||
            lower.includes("api_key") ||
            lower.includes("resend_api_key") ||
            lower.includes("environment variable")
          ) {
            cleanErr = result.error;
          } else if (
            !lower.includes("function_invocation_failed") &&
            !lower.includes("internal server error") &&
            !lower.includes("vercel") &&
            !result.error.trim().startsWith("<") &&
            result.error.length < 150
          ) {
            cleanErr = result.error;
          }
        }
        setErrorMessage(
          `${cleanErr} Or, feel free to contact me directly at: jhaymarkortizluis@gmail.com`
        );
      }
    } catch (err: any) {
      stepIntervals.forEach((t) => clearTimeout(t));
      setIsError(true);
      setErrorMessage(
        "Unable to establish secure delivery at this time. Please try again in a moment, or feel free to contact me directly via email at jhaymarkortizluis@gmail.com"
      );
    } finally {
      setIsSubmitting(false);
      setSendStep(0);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#130d05] border-2 border-green-500/80 p-4 rounded shadow-[0_10px_30px_rgba(34,197,94,0.15)] flex gap-3 items-start animate-fadeIn">
          <span className="material-symbols-outlined text-green-500 text-3xl">task_alt</span>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#ede1d0]">Message Transmitted</h4>
            <p className="text-xs text-[#d5c4ab]">
              Coordinates verified. Your submission is registered locally and Jhay Mark will respond via email.
            </p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-[#d5c4ab] hover:text-white text-sm font-bold ml-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Contact Form Section */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto pt-6 sm:pt-16 flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
        
        {/* Left Column (Mockup Column 5 style) */}
        <div className="w-full lg:col-span-5 space-y-8 sm:space-y-10">
          <div className="space-y-3 sm:space-y-4">
            <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.3em] font-semibold block">
              GET IN TOUCH
            </span>
            <h1 className="font-display text-3xl xs:text-4xl sm:text-6xl lg:text-7xl font-black text-[#ede1d0] tracking-tight leading-[1.05] sm:leading-[1.02] uppercase break-words">
              Let&apos;s Build <br className="hidden sm:inline" />
              <span className="italic text-[#ffdca1] font-black inline-block">Something</span> <br className="hidden sm:inline" />
              Meaningful
            </h1>
          </div>

          <p className="font-sans text-xs sm:text-base text-[#d5c4ab]/85 leading-relaxed max-w-md break-words">
            Whether you seek full-lifecycle software deployment, NLU conversational optimization, or specific university leadership collaborations, feel free to transmit a secure note.
          </p>

          {/* Social and Resume Action Links */}
          <div className="space-y-3.5 sm:space-y-4 font-display text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] font-black">
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setActiveActionIdx(0);
                }
              }}
              className={`flex w-full items-center gap-4 group p-4 border transition-colors rounded ${
                activeActionIdx === 0
                  ? "border-[#ffba20] bg-[#3b3428]/30 shadow-[0_0_12px_rgba(255,186,32,0.15)] md:border-[#514532]/20 md:bg-transparent md:shadow-none md:hover:border-[#ffba20] md:hover:bg-[#3b3428]/20"
                  : "border-[#514532]/20 hover:border-[#ffba20] hover:bg-[#3b3428]/20"
              }`}
            >
              <span className={`material-symbols-outlined text-[#ffba20] text-xl transition-transform ${
                activeActionIdx === 0 ? "scale-115 md:scale-100 md:group-hover:scale-110" : "group-hover:scale-110"
              }`}>
                group
               </span>
              <span className="break-words">LinkedIn Outline Portfolio</span>
            </a>

            <a
              href={`mailto:${PROFILE.email}`}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setActiveActionIdx(1);
                }
              }}
              className={`flex w-full items-center gap-4 group p-4 border transition-colors rounded ${
                activeActionIdx === 1
                  ? "border-[#ffba20] bg-[#3b3428]/30 shadow-[0_0_12px_rgba(255,186,32,0.15)] md:border-[#514532]/20 md:bg-transparent md:shadow-none md:hover:border-[#ffba20] md:hover:bg-[#3b3428]/20"
                  : "border-[#514532]/20 hover:border-[#ffba20] hover:bg-[#3b3428]/20"
              }`}
            >
              <span className={`material-symbols-outlined text-[#ffba20] text-xl transition-transform ${
                activeActionIdx === 1 ? "scale-115 md:scale-100 md:group-hover:scale-110" : "group-hover:scale-110"
              }`}>
                mail
              </span>
              <span className="break-words">Send Direct Email</span>
            </a>

            <a
              href="/Jhay_Mark_Ortiz_Luis_Resume.pdf"
              download="Jhay_Mark_Ortiz_Luis_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                downloadResume();
                if (window.innerWidth <= 768) {
                  setActiveActionIdx(2);
                }
              }}
              className={`flex w-full text-left items-center gap-4 group p-4 border transition-colors rounded cursor-pointer text-[#ede1d0]/90 ${
                activeActionIdx === 2
                  ? "border-[#ffba20] bg-[#3b3428]/30 shadow-[0_0_12px_rgba(255,186,32,0.15)] md:border-[#514532]/20 md:bg-transparent md:shadow-none md:hover:border-[#ffba20] md:hover:bg-[#3b3428]/20"
                  : "border-[#514532]/20 hover:border-[#ffba20] hover:bg-[#3b3428]/20"
              }`}
            >
              <span className={`material-symbols-outlined text-[#ffba20] text-xl transition-transform ${
                activeActionIdx === 2 ? "scale-115 md:scale-100 md:group-hover:scale-110" : "group-hover:scale-110"
              }`}>
                download
              </span>
              <span className="break-words">Download PDF Resume</span>
            </a>
          </div>
        </div>

        {/* Right Column Form (Mockup Column 5 style) */}
        <div className="w-full lg:col-span-7 bg-[#130d05] border border-[#514532]/20 p-5 sm:p-10 rounded-lg cinematic-glow space-y-6">
          <div className="border-b border-[#514532]/10 pb-4">
            <h3 className="font-display text-base sm:text-lg font-black uppercase tracking-widest text-[#ede1d0]">
              Secure Transmission Channel
            </h3>
            <p className="text-[9px] sm:text-[10px] font-mono text-[#ffba20] uppercase mt-1 leading-none font-bold">
              TRANS_CHAN_STABLE // ACTIVE_PING_OK
            </p>
          </div>

          {/* Success Banner */}
          {isSuccess && (
            <div className="bg-green-500/5 border border-green-500/30 p-5 rounded-lg space-y-2 mb-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-green-500 font-bold font-display text-xs sm:text-sm">
                <span className="material-symbols-outlined text-base sm:text-md">check_circle</span>
                <span className="tracking-widest">TRANSMISSION RECEIVED</span>
              </div>
              <p className="text-xs text-[#ede1d0]/90 leading-relaxed font-sans">
                Your message has been successfully delivered to Jhay Mark&apos;s direct email. He will review your inquiry and respond within 24 hours.
              </p>
            </div>
          )}

          {/* Error Banner */}
          {isError && (
            <div className="bg-red-500/5 border border-red-500/30 p-5 rounded-lg space-y-2 mb-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-500 font-bold font-display text-xs sm:text-sm">
                <span className="material-symbols-outlined text-base sm:text-md">report</span>
                <span className="tracking-widest">TRANSMISSION FAILED</span>
              </div>
              <p className="text-xs text-[#ede1d0]/90 leading-relaxed font-sans">
                {errorMessage || "Unable to establish secure delivery. Please try again in a moment."}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-[9px] text-[#ffba20]/60 uppercase tracking-widest font-bold mb-1.5">
                Your Signature Name
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setIsSuccess(false);
                  setIsError(false);
                  setErrorMessage("");
                  if (validationErrors.name) {
                    setValidationErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="e.g. Director Jane Santos"
                className={`w-full bg-[#181309] border text-[#ede1d0] rounded px-4 py-3 placeholder-[#d5c4ab]/25 focus:ring-1 outline-none text-xs font-sans transition-colors ${
                  validationErrors.name
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500"
                    : "border-[#514532]/50 focus:border-[#ffba20] focus:ring-[#ffba20]"
                }`}
              />
              {validationErrors.name && (
                <p className="text-[10px] text-red-400 font-mono mt-1 font-semibold flex items-center gap-1">
                  <span>▲</span> {validationErrors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[9px] text-[#ffba20]/60 uppercase tracking-widest font-bold mb-1.5">
                  E-Mail Pipeline Address
                </label>
                <input
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setIsSuccess(false);
                    setIsError(false);
                    setErrorMessage("");
                    if (validationErrors.email) {
                      setValidationErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="e.g. jane@organization.com"
                  className={`w-full bg-[#181309] border text-[#ede1d0] rounded px-4 py-3 placeholder-[#d5c4ab]/25 focus:ring-1 outline-none text-xs font-sans transition-colors ${
                    validationErrors.email
                      ? "border-red-500/60 focus:border-red-500 focus:ring-red-500"
                      : "border-[#514532]/50 focus:border-[#ffba20] focus:ring-[#ffba20]"
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-[10px] text-red-400 font-mono mt-1 font-semibold flex items-center gap-1">
                    <span>▲</span> {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#ffba20]/60 uppercase tracking-widest font-bold mb-1.5">
                  Collaboration Subject Domain
                </label>
                <select
                  disabled={isSubmitting}
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setIsSuccess(false);
                    setIsError(false);
                    setErrorMessage("");
                  }}
                  className="w-full bg-[#181309] border border-[#514532]/50 text-[#ede1d0] rounded px-4 py-3 focus:border-[#ffba20] focus:ring-1 focus:ring-[#ffba20] outline-none text-xs font-sans cursor-pointer h-[46px]"
                >
                  <option value="General Collaboration">General Collaboration</option>
                  <option value="Project Hiring Request">Project Hiring Request</option>
                  <option value="Freelance Consultation">Freelance Consultation</option>
                  <option value="University Engineering Panel">University Panel</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[9px] text-[#ffba20]/60 uppercase tracking-widest font-bold mb-1.5">
                Encoded Message Payload
              </label>
              <textarea
                required
                disabled={isSubmitting}
                rows={5}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setIsSuccess(false);
                  setIsError(false);
                  setErrorMessage("");
                  if (validationErrors.message) {
                    setValidationErrors((prev) => ({ ...prev, message: undefined }));
                  }
                }}
                placeholder="Type your strategic collaboration requirements here..."
                className={`w-full bg-[#181309] border text-[#ede1d0] rounded px-4 py-3 placeholder-[#d5c4ab]/25 focus:ring-1 outline-none text-xs font-sans resize-none min-h-[140px] sm:min-h-0 transition-colors ${
                  validationErrors.message
                    ? "border-red-500/60 focus:border-red-500 focus:ring-red-500"
                    : "border-[#514532]/50 focus:border-[#ffba20] focus:ring-[#ffba20]"
                }`}
              />
              {validationErrors.message && (
                <p className="text-[10px] text-red-400 font-mono mt-1 font-semibold flex items-center gap-1">
                  <span>▲</span> {validationErrors.message}
                </p>
              )}
            </div>

            {isSuccess ? (
              <button
                type="button"
                disabled
                className="w-full bg-[#1c2e17] border border-green-500/40 text-green-400 rounded py-4 flex items-center justify-center gap-3 font-display text-xs uppercase tracking-widest font-bold transition-all duration-300"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span className="font-extrabold">✓ MESSAGE DELIVERED</span>
              </button>
            ) : isSubmitting ? (
              <button
                type="button"
                disabled
                className="w-full bg-[#ffba20]/10 border border-[#ffba20]/30 text-[#ffba20]/80 rounded py-4 flex items-center justify-center gap-3 font-display text-xs uppercase tracking-widest font-semibold"
              >
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span className="font-extrabold">
                  {sendStep === 1 && "ESTABLISHING SECURE CHANNEL..."}
                  {sendStep === 2 && "ENCRYPTING PAYLOAD..."}
                  {sendStep === 3 && "TRANSMITTING MESSAGE..."}
                  {sendStep === 0 && "TRANSMITTING COORDINATES..."}
                </span>
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-[#ffba20] hover:bg-[#ffdca1] text-[#181309] rounded py-4 flex items-center justify-center gap-3 transition-colors font-display text-xs uppercase tracking-widest font-bold cursor-pointer transition-transform duration-200 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span className="font-extrabold">Start the Conversation</span>
              </button>
            )}
          </form>

          {/* Submitted Message Outbox Logs */}
          {submittedMessages.length > 0 && (
            <div className="pt-6 border-t border-[#514532]/10 space-y-3">
              <span className="font-mono text-[9px] text-[#ffba20]/65 uppercase font-bold tracking-widest">
                Local Outbox Cache Transmissions ({submittedMessages.length})
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {submittedMessages.map((msg, idx) => (
                  <div key={idx} className="bg-[#181309] border border-[#514532]/30 p-3 rounded text-xs space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#ffba20]/80">
                      <span className="font-bold">{msg.name}</span>
                      <span>{msg.date}</span>
                    </div>
                    <p className="text-[#d5c4ab]/70 font-sans italic">&ldquo;{msg.message}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* AI Digital Twin Agent Segment (Fills Full Width elegantly underneath) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto py-10 sm:py-16 border-t border-[#514532]/15 pt-12 sm:pt-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-10 mb-8 sm:mb-12">
          <div className="space-y-2 sm:space-y-3">
            <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.3em] font-semibold block">
              INSTANT TELEMETRY RESPONSES
            </span>
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-[#ede1d0] tracking-tight leading-tight uppercase break-words">
              Talk to Jhay Mark&apos;s Digital Twin
            </h2>
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#d5c4ab]/80 leading-relaxed max-w-3xl break-words">
              Don&apos;t wait for a manual email return! Discuss schedules, check project specifications, ask deep computer engineering details, or test dialog models immediately in real time below.
            </p>
          </div>
          <div className="flex items-center shrink-0">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] bg-green-500/10 border border-green-500/30 text-green-500 px-3 py-1.5 rounded uppercase font-bold shadow-[0_0_8px_rgba(34,197,94,0.15)] animate-pulse">
              AI ENGINE READY
            </span>
          </div>
        </div>

        <AIChatAgent />
      </section>

      {/* Localized Footer Instance */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
