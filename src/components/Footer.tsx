import { PROFILE } from "../data";
import { downloadResume } from "../utils/downloadResume";

interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleNavClick = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-[#130d05] border-t border-[#514532]/15 pt-12 sm:pt-16 pb-12 sm:pb-16 mt-12 sm:mt-24 overflow-hidden">
      {/* Subtle bottom corner ambient glow */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#ffba20]/5 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-16">
        
        {/* Cinematic Call to Action Banner inside footer as shown in the mockup screenshots */}
        <div className="text-center py-6 sm:py-8 border-b border-[#514532]/10 space-y-3 sm:space-y-4">
          <h2 className="font-display text-xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.1em] sm:tracking-[0.18em] text-[#ede1d0]/95 select-none text-glow leading-tight sm:leading-none">
            Let&apos;s create the future.
          </h2>
          <p className="font-mono text-[9px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#ffba20]/65 px-4 leading-relaxed">
            Intersection of logic, design and absolute precision
          </p>
        </div>

        {/* Localized Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-12 pt-4">
          {/* Logo Brand / Bio block */}
          <div className="col-span-2 md:col-span-5 space-y-4">
            <h3 className="font-display font-black uppercase tracking-[0.1em] text-2xl text-[#ede1d0]">
              Jhay Mark A.
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/60 leading-relaxed max-w-sm">
              An aspiring Computer Engineering student from the Polytechnic University of the Philippines. 
              Dedicated to the intersection of artificial intelligence, robust systems development, and high-contrast, immersive user experiences.
            </p>
            <div className="flex gap-4 pt-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[#d5c4ab]/40">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
                Manila, Ph (GMT+8)
              </span>
            </div>
          </div>

          {/* Nav Categories */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffba20] font-bold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#d5c4ab]/70 font-display">
              {["Home", "Story", "Work", "Contact"].map((tab) => (
                <li key={tab}>
                  <button
                     onClick={() => handleNavClick(tab)}
                     className="hover:text-white transition-colors uppercase tracking-[0.1em] text-left cursor-pointer font-semibold text-[11px]"
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Domains / Capabilities */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffba20] font-bold">
              Key Services
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs text-[#d5c4ab]/50 font-mono uppercase tracking-wider">
              <li>System Development</li>
              <li>AI Communications</li>
              <li>NLU & ASR Operations</li>
              <li>Product Delivery</li>
              <li>Technical Helpdesk</li>
            </ul>
          </div>

          {/* Social/Contact Info */}
          <div className="col-span-2 md:col-span-3 space-y-4 md:text-right">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffba20] font-bold md:text-right">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#d5c4ab]/70 font-sans">
              <li>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="hover:text-white transition-colors font-medium hover:underline text-[#ffdca1]"
                >
                  {PROFILE.email}
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors hover:underline"
                >
                  LinkedIn Outline
                </a>
              </li>
              <li>
                <a
                  href="/Jhay_Mark_Ortiz_Luis_Resume.pdf"
                  download="Jhay_Mark_Ortiz_Luis_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={downloadResume}
                  className="hover:text-white transition-colors hover:underline text-[#d5c4ab]/70 text-left cursor-pointer"
                >
                  Download PDF Resume
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright details */}
        <div className="pt-6 sm:pt-12 mt-6 sm:mt-12 border-t border-[#514532]/10 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          <div className="text-[10px] font-mono text-[#d5c4ab]/40 text-center sm:text-left w-full sm:w-auto leading-relaxed">
            © 2026 {PROFILE.name}. Crafted with typographic precision.
          </div>
          <div className="text-[10px] font-mono text-[#d5c4ab]/30 text-center sm:text-right w-full sm:w-auto">
            Bachelor of Science in Computer Engineering
          </div>
        </div>
      </div>
    </footer>
  );
}
