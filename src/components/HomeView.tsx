import { motion } from "motion/react";
import { PROFILE, SPECIALIZATIONS } from "../data";
import Footer from "./Footer";
import { downloadResume } from "../utils/downloadResume";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-10 sm:space-y-24 md:space-y-32">
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] xs:min-h-[45vh] sm:min-h-[60vh] lg:min-h-[65vh] flex flex-col justify-center pt-0 sm:pt-4 lg:pt-6 pb-4 sm:pb-12 overflow-hidden">
        {/* Background Atmospheric Lighting */}
        <div className="absolute inset-0 z-0 bg-[#181309]/50">
          <div
            className="absolute top-1/4 left-1/3 w-[80vw] h-[80vw] sm:w-[50vw] sm:h-[50vw] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255, 184, 0, 0.08) 0%, rgba(255, 184, 0, 0) 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        {/* Content Canvas */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 flex flex-col items-start max-w-7xl mx-auto flex-1 justify-center py-1 sm:py-6">
          <div className="grid grid-cols-12 w-full gap-8 items-center">
            {/* Vertical Editorial Metadata */}
            <div className="hidden lg:block col-span-1 border-r border-[#514532]/20 pr-6 h-48 flex items-center justify-center">
              <div className="flex flex-col gap-12 transform rotate-180 [writing-mode:vertical-lr] items-center text-[#d5c4ab]/30 select-none">
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] font-medium">CREATIVE ENGINEERING</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.5em] font-medium">PORTFOLIO MMXXIV</span>
              </div>
            </div>

            {/* Display Hero Title and descriptions */}
            <div className="col-span-12 lg:col-span-11 pl-0 lg:pl-6 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="space-y-2 sm:space-y-6 mb-3 sm:mb-10"
              >
                <div>
                  <span className="inline-block font-mono text-[8.5px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.3em] text-[#ffba20] bg-[#271f11]/60 px-2 py-1 sm:px-4 sm:py-2 border border-[#ffba20]/20 rounded font-bold">
                    FUTURE-FORWARD DEVELOPMENT
                  </span>
                </div>
                <h1 className="font-display text-[1.75rem] xs:text-[2.3rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] text-[#ede1d0] font-black leading-[0.92] sm:leading-[0.9] tracking-tight sm:tracking-tighter max-w-6xl">
                  <span className="text-[#f1e5d1] tracking-tight drop-shadow-[0_0_25px_rgba(255,186,32,0.15)] block">JHAY MARK</span>
                  <span className="text-[#ede1d0] font-bold block">ORTIZ LUIS</span>
                </h1>
              </motion.div>

              {/* Grid Column Layout under name */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-8 mb-4 sm:mb-12 border-t border-[#514532]/15 pt-3 sm:pt-8"
              >
                <div className="md:col-span-6 border-l-2 border-[#ffba20] pl-3.5 sm:pl-6 py-0.5">
                  <h2 className="font-display text-[12.5px] xs:text-sm sm:text-2xl text-[#ede1d0]/90 leading-snug font-bold">
                    Computer Engineering Student <br />
                    <span className="text-[#ffba20] sm:text-[#ede1d0]/90">System Developer | AI Conversation</span> <br className="hidden sm:inline" />
                    <span className="text-[#ffba20] sm:text-[#ede1d0]/90">Specialist</span>
                  </h2>
                </div>
                <div className="md:col-span-6 flex items-center">
                  <p className="font-sans text-[11px] xs:text-[11.5px] sm:text-base text-[#d5c4ab]/85 leading-relaxed max-w-xl">
                    Building intelligent systems, optimizing AI conversations, and developing digital experiences that combine technology, functionality, and creativity.
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons with high-fidelity badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 items-stretch sm:items-center w-[92%] xs:w-[90%] sm:w-full mx-auto sm:mx-0"
              >
                <button
                  onClick={() => onNavigate("Work")}
                  className="group relative overflow-hidden bg-[#ffba20] hover:bg-[#ffdca1] text-[#181309] px-5 py-3.5 xs:px-8 xs:py-4 sm:px-10 sm:py-4 rounded-lg sm:rounded transition-all active:scale-95 duration-300 font-display text-[11px] xs:text-xs uppercase tracking-widest font-black flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span className="relative z-10">View Projects</span>
                  <span className="material-symbols-outlined relative z-10 transition-transform group-hover:translate-x-1 text-sm font-black">
                    arrow_forward
                  </span>
                </button>
                <a
                  href="/Jhay_Mark_Ortiz_Luis_Resume.pdf"
                  download="Jhay_Mark_Ortiz_Luis_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  onClick={downloadResume}
                  className="group px-4 py-3 xs:px-6 xs:py-4 sm:px-8 sm:py-4 border border-[#514532]/70 hover:border-[#ffba20] text-[#ede1d0] rounded-lg sm:rounded font-display text-[11px] xs:text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors backdrop-blur-sm hover:bg-[#3b3428]/35 font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] sm:text-[18px]">download</span>
                  <span>Download Resume</span>
                </a>
                
                {/* Available status badge */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 px-3 py-1.5 sm:px-1.5 sm:py-0.5 mt-2 sm:mt-0 border border-[#514532]/40 sm:border-none rounded-full sm:rounded-none bg-[#130d05]/60 sm:bg-transparent font-mono text-[8.5px] sm:text-[10px] tracking-wider uppercase font-semibold text-[#d5c4ab]/70 self-center sm:self-auto">
                  <span className="inline-block w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
                  <span>Available for challenges</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="relative z-10 text-center pb-4 select-none pointer-events-none hidden md:block">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#d5c4ab]/40 block mb-1">
            SCROLL
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#ffba20]/50 to-transparent mx-auto" />
        </div>
      </section>

      {/* Bento Grid layout (Specializations / The Approach) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto py-6 sm:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 sm:mb-12 gap-3 md:gap-6 pb-4 sm:pb-6 border-b border-[#514532]/10">
          <div>
            <h3 className="font-mono text-[10px] sm:text-xs text-[#ffba20] uppercase tracking-widest mb-1 sm:mb-2">
              The Approach
            </h3>
            <h4 className="font-display text-2xl sm:text-5xl font-black text-[#ede1d0] leading-tight sm:leading-none tracking-tight">
              Intersection of logic <br className="hidden sm:inline" /> and aesthetic vision.
            </h4>
          </div>
          <span className="font-mono text-[9px] sm:text-[11px] text-[#d5c4ab]/40 uppercase tracking-widest font-bold">01 // CORE COMPETENCIES</span>
        </div>

        {/* Three highly stylized bento-like panels matching column 1 layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SPECIALIZATIONS.map((spec) => (
            <div
              key={spec.id}
              className="group relative bg-[#130d05] border border-[#514532]/20 hover:border-[#ffba20]/30 transition-all duration-500 rounded-lg overflow-hidden p-5 xs:p-6 sm:p-10 flex flex-col justify-between min-h-[210px] xs:min-h-[230px] sm:min-h-[360px] cinematic-glow"
            >
              {/* Giant faint counter number */}
              <div className="font-display text-4xl sm:text-6xl text-[#514532]/15 font-black select-none text-right transition-colors duration-500 group-hover:text-[#ffba20]/5 leading-none">
                {spec.num}
              </div>
              
              <div className="relative z-10 space-y-2.5 sm:space-y-4">
                <span className="material-symbols-outlined text-[#ffba20] text-[28px] sm:text-[44px] mb-0.5 sm:mb-2 block drop-shadow-[0_0_12px_rgba(255,186,32,0.25)]">
                  {spec.icon}
                </span>
                <h5 className="font-display text-base sm:text-xl font-bold uppercase tracking-wider text-[#ede1d0]">
                  {spec.title}
                </h5>
                <p className="font-sans text-[11px] xs:text-xs sm:text-sm text-[#d5c4ab]/70 leading-relaxed">
                  {spec.description}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="h-[2px] w-12 bg-gradient-to-r from-[#ffba20] to-transparent group-hover:w-full transition-all duration-700" />
              
              {/* Deep twilight glow overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#ffba20]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          ))}
        </div>
      </section>

      {/* Localized Footer Instance */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
