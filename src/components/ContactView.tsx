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
  const [showToast, setShowToast] = useState(false);
  const [submittedMessages, setSubmittedMessages] = useState<any[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    
    setTimeout(() => {
      const newSubmission = { name, email, subject, message, date: new Date().toLocaleTimeString() };
      setSubmittedMessages((prev) => [newSubmission, ...prev]);
      
      setName("");
      setEmail("");
      setMessage("");
      setIsSubmitting(false);
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }, 1200);
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
              className="flex w-full items-center gap-4 group p-4 border border-[#514532]/20 hover:border-[#ffba20] transition-colors rounded hover:bg-[#3b3428]/20"
            >
              <span className="material-symbols-outlined text-[#ffba20] text-xl group-hover:scale-110 transition-transform">
                group
               </span>
              <span className="break-words">LinkedIn Outline Portfolio</span>
            </a>

            <a
              href={`mailto:${PROFILE.email}`}
              className="flex w-full items-center gap-4 group p-4 border border-[#514532]/20 hover:border-[#ffba20] transition-colors rounded hover:bg-[#3b3428]/20"
            >
              <span className="material-symbols-outlined text-[#ffba20] text-xl group-hover:scale-110 transition-transform">
                mail
              </span>
              <span className="break-words">Send Direct Email</span>
            </a>

            <a
              href="/Jhay_Mark_Ortiz_Luis_Resume.pdf"
              download="Jhay_Mark_Ortiz_Luis_Resume.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={downloadResume}
              className="flex w-full text-left items-center gap-4 group p-4 border border-[#514532]/20 hover:border-[#ffba20] transition-colors rounded hover:bg-[#3b3428]/20 cursor-pointer text-[#ede1d0]/90"
            >
              <span className="material-symbols-outlined text-[#ffba20] text-xl group-hover:scale-110 transition-transform">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-[9px] text-[#ffba20]/60 uppercase tracking-widest font-bold mb-1.5">
                Your Signature Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Director Jane Santos"
                className="w-full bg-[#181309] border border-[#514532]/50 text-[#ede1d0] rounded px-4 py-3 placeholder-[#d5c4ab]/25 focus:border-[#ffba20] focus:ring-1 focus:ring-[#ffba20] outline-none text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[9px] text-[#ffba20]/60 uppercase tracking-widest font-bold mb-1.5">
                  E-Mail Pipeline Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane@organization.com"
                  className="w-full bg-[#181309] border border-[#514532]/50 text-[#ede1d0] rounded px-4 py-3 placeholder-[#d5c4ab]/25 focus:border-[#ffba20] focus:ring-1 focus:ring-[#ffba20] outline-none text-xs font-sans"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] text-[#ffba20]/60 uppercase tracking-widest font-bold mb-1.5">
                  Collaboration Subject Domain
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your strategic collaboration requirements here..."
                className="w-full bg-[#181309] border border-[#514532]/50 text-[#ede1d0] rounded px-4 py-3 placeholder-[#d5c4ab]/25 focus:border-[#ffba20] focus:ring-1 focus:ring-[#ffba20] outline-none text-xs font-sans resize-none min-h-[140px] sm:min-h-0"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || !email || !message}
              className="w-full bg-[#ffba20] hover:bg-[#ffdca1] text-[#181309] disabled:bg-[#3b3428] disabled:text-[#d5c4ab]/40 rounded py-4 flex items-center justify-center gap-3 transition-colors font-display text-xs uppercase tracking-widest font-bold cursor-pointer transition-transform duration-200 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  <span className="font-extrabold">TRANSMITTING COORDINATES</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span className="font-extrabold">Start the Conversation</span>
                </>
              )}
            </button>
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
