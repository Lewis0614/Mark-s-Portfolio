import { useState } from "react";
import { EXPERIENCE, PROFILE } from "../data";
import Footer from "./Footer";

const FAO_EVENTS = [
  {
    name: "PUP Arts Olympiad",
    role: "Internal President & Coordinator",
    stat: "Gold Cup Champions",
    budget: "Strict systematic allocation",
    desc: "Managed the financial planning, rehearsal schedules, and overall operations for over 30 performers, resulting in an award-winning staging.",
  },
  {
    name: "Grand Intramural Parade",
    role: "Director of Logistics",
    stat: "1,200+ Audience Members",
    budget: "Artistic/Supply clearance",
    desc: "Created complex blocking layouts, sound systems alignment, and physical safety routes for the grand opening dance routine.",
  },
];

interface StoryViewProps {
  onNavigate: (tab: string) => void;
}

export default function StoryView({ onNavigate }: StoryViewProps) {
  const [profileImgSrc, setProfileImgSrc] = useState<string>(PROFILE.profileImage);

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32">
      
      {/* 1. Header & PUP Journey Section (Column 2) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto pt-8 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Portrait Photo on Left */}
          <div className="col-span-12 lg:col-span-5 relative group z-10">
            <div className="absolute -inset-4 bg-[#ffba20]/5 rounded-3xl blur-3xl pointer-events-none" />
            <div className="relative rounded-2xl border border-[#514532]/25 group-hover:border-[#ffba20]/50 group-hover:shadow-[0_0_25px_rgba(255,186,32,0.3)] transition-all duration-500 aspect-[4/5] max-w-md mx-auto bg-[#130d05] shadow-2xl">
              <div className="absolute inset-0 bg-[#ffdca1]/5 mix-blend-overlay pointer-events-none z-10 rounded-2xl" />
              <img
                src={profileImgSrc}
                alt={PROFILE.name}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (profileImgSrc !== "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600") {
                    setProfileImgSrc("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600");
                  }
                }}
                className="w-full h-full object-cover transition-all duration-500 ease-out rounded-2xl"
              />
              
              {/* "System Dev" Caption Overlay Badge */}
              <div className="absolute bottom-2 right-2 sm:-bottom-4 sm:-right-4 bg-[#1a140c] border border-[#ffba20]/30 rounded-xl px-4 py-3 sm:px-6 sm:py-4 shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-20 min-w-[160px] sm:min-w-[200px]">
                <span className="font-mono text-[8px] sm:text-[9px] text-[#ffba20]/75 uppercase tracking-[0.25em] font-bold block mb-1">
                  CURRENT // FOCUS
                </span>
                <span className="font-display text-xl sm:text-3xl font-black text-[#ede1d0] tracking-tight block leading-none">
                  System Dev
                </span>
              </div>
            </div>
          </div>

          {/* Educational description on Right */}
          <div className="col-span-12 lg:col-span-7 space-y-6 lg:space-y-8 lg:pl-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-[1.5px] bg-[#d5c4ab]/40 shrink-0" />
              <span className="font-mono text-[10px] sm:text-xs text-[#d5c4ab]/70 uppercase tracking-[0.25em] font-bold">
                CHAPTER 01: THE ORIGIN
              </span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#f1e5d1] tracking-tight leading-[1.05] sm:leading-[0.98] uppercase">
              Architecting <br className="hidden sm:inline" /> 
              the Future <br className="hidden sm:inline" /> 
              at PUP
            </h2>

            <div className="font-sans text-sm sm:text-base text-[#d5c4ab]/85 space-y-6 leading-relaxed max-w-2xl">
              <p>
                As a Computer Engineering student at the <strong className="text-[#f1e5d1] font-bold">Polytechnic University of the Philippines</strong>, my journey is defined by a relentless pursuit of technical mastery and innovative leadership.
              </p>
              <p>
                Specializing in <strong className="text-[#ffba20] font-bold">System Development</strong>, I bridge the gap between high-level architectural design and granular code execution. My transition from standard development into the realm of <strong className="italic text-[#f1e5d1] font-bold">Artificial Intelligence</strong> represents a shift towards building sentient digital experiences rather than just functional tools.
              </p>
              <p>
                Leadership isn't just about managing teams; for me, it's about setting a standard of excellence in the PUP engineering community, fostering a culture where code meets cinematic storytelling.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              {["VISIONARY", "ENGINEER", "STRATEGIST"].map((tag) => (
                <span
                  key={tag}
                  className="px-6 py-2.5 bg-[#181309]/30 border border-[#514532]/30 text-[#d5c4ab]/65 font-mono text-[10px] uppercase tracking-[0.25em] font-bold rounded-full hover:border-[#ffba20]/50 duration-300 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. "What I Build" Section with Watermark Background (Column 2) */}
      <section className="relative py-16 overflow-hidden">
        {/* Massive Watermark Lettering */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="font-display text-[9vw] sm:text-[14vw] font-black text-[#ffba20]/[0.02] tracking-[0.2em] leading-none uppercase select-none block">
            CREATION
          </span>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.3em] font-semibold">
              02 / TECHNICAL PORTFOLIO
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#ede1d0] uppercase tracking-wide">
              What I Build
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI & Conversational Systems Card - Styled with nice SVG waves */}
            <div className="group relative bg-[#130d05] border border-[#514532]/25 rounded-lg p-6 sm:p-10 min-h-[285px] sm:min-h-[320px] flex flex-col justify-between overflow-hidden cinematic-glow hover:border-[#ffba20]/30 transition-all duration-500">
              {/* Background Network Mesh / Waves SVG */}
              <div className="absolute inset-x-0 bottom-0 top-1/3 opacity-15 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none z-0">
                <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
                  <path d="M0,100 C100,120 120,40 200,100 C280,160 300,50 400,90 L400,200 L0,200 Z" fill="url(#grad)" />
                  <path d="M0,130 C80,80 150,150 220,90 C290,30 350,120 400,140" stroke="#ffba20" strokeWidth="1" strokeDasharray="3 3" />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffba20" />
                      <stop offset="100%" stopColor="#130d05" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-[#ffba20] text-3xl">psychology</span>
                  <span className="font-mono text-[9px] text-[#ffba20] bg-[#ffba20]/10 border border-[#ffba20]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                    AI AGENT GATEWAY
                  </span>
                </div>
                <h4 className="font-display text-2xl font-black uppercase text-[#ede1d0] tracking-wide">
                  AI & Conversational Systems
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/75 leading-relaxed max-w-sm">
                  Developing robust workflows optimizing dialog trees, speech-to-text algorithms, intent parsing, 
                  and integrating responsive digital speech twin pipelines.
                </p>
              </div>

              <span className="font-mono text-[9px] text-[#d5c4ab]/40 uppercase tracking-widest block pt-4 z-10 border-t border-[#514532]/10">
                NLU • ASR • TTS • VOICE AUTOMATION
              </span>
            </div>

            {/* Software Development Card */}
            <div className="group relative bg-[#130d05] border border-[#514532]/25 rounded-lg p-6 sm:p-10 min-h-[285px] sm:min-h-[320px] flex flex-col justify-between overflow-hidden cinematic-glow hover:border-[#ffba20]/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ffba20]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-[#ffba20] text-3xl">developer_board</span>
                  <span className="font-mono text-[9px] text-[#ffba20] bg-[#ffba20]/10 border border-[#ffba20]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                    SYSTEM STACK
                  </span>
                </div>
                <h4 className="font-display text-2xl font-black uppercase text-[#ede1d0] tracking-wide">
                  Software Development
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/75 leading-relaxed max-w-sm">
                  Architecting multi-platform desktop frameworks, responsive high-performance web backends, 
                  and specialized physical IoT database locker modules with QR credential verification.
                </p>
              </div>

              <span className="font-mono text-[9px] text-[#d5c4ab]/40 uppercase tracking-widest block pt-4 z-10 border-t border-[#514532]/10">
                REACT • PYTHON • NODE • POSTGRES • C++
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "Engineering Mindset" Section (Column 2) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pb-6 border-b border-[#514532]/10">
          <div>
            <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.3em] font-semibold block mb-1">
              03 / PHILOSOPHICAL FRAME
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-black text-[#ede1d0] uppercase tracking-wide">
              Engineering Mindset
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#d5c4ab]/40 uppercase tracking-widest font-bold">CORE PARADIGMS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 bg-[#130d05]/30 border border-[#514532]/15 p-6 rounded hover:border-[#ffba20]/20 transition-colors">
            <span className="material-symbols-outlined text-[#ffba20] text-3xl">account_tree</span>
            <h4 className="font-display text-lg font-bold uppercase tracking-wider text-[#ede1d0]">Systems Thinking</h4>
            <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/70 leading-relaxed">
              We analyze full system lifecycles. From initial physical trigger, down database persistence pipelines, to the responsive browser UI interface.
            </p>
          </div>
          
          <div className="space-y-3 bg-[#130d05]/30 border border-[#514532]/15 p-6 rounded hover:border-[#ffba20]/20 transition-colors">
            <span className="material-symbols-outlined text-[#ffba20] text-3xl">troubleshoot</span>
            <h4 className="font-display text-lg font-bold uppercase tracking-wider text-[#ede1d0]">Problem Analysis</h4>
            <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/70 leading-relaxed">
              Deconstructing large, complex, ambiguous requirements down to strict, clean, typed modular procedures that ensure safe deployment.
            </p>
          </div>

          <div className="space-y-3 bg-[#130d05]/30 border border-[#514532]/15 p-6 rounded hover:border-[#ffba20]/20 transition-colors">
            <span className="material-symbols-outlined text-[#ffba20] text-3xl">network_check</span>
            <h4 className="font-display text-lg font-bold uppercase tracking-wider text-[#ede1d0]">Optimization</h4>
            <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/70 leading-relaxed">
              Always optimizing code workflows, maximizing database lookups efficiency, reducing audio response latency, and enforcing clean interfaces.
            </p>
          </div>
        </div>
      </section>

      {/* 4. "Industry Experience" Section (Mobile-First Single Column Redesign) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-4xl lg:max-w-7xl mx-auto py-12 sm:py-20 md:py-24 lg:py-32 lg:grid lg:grid-cols-12 lg:gap-16 items-start">
        
        {/* Section Header */}
        <div className="space-y-4 sm:space-y-6 mb-12 sm:mb-16 lg:mb-0 lg:col-span-6 lg:sticky lg:top-32 lg:pr-16">
          <span className="font-mono text-xs sm:text-sm text-[#ffba20] uppercase tracking-[0.25em] font-bold block">
            04 / PROFESSIONAL TRACK
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[54px] xl:text-[60px] font-black text-[#f1e5d1] tracking-tight leading-[1.05] uppercase lg:leading-[1.1]">
            Industry <br className="hidden sm:inline" />
            Experience
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#d5c4ab]/80 leading-relaxed max-w-2xl lg:text-[#d5c4ab]/70 lg:leading-loose">
            Forging technical proficiency through strategic internships and operational roles.
          </p>
        </div>

        {/* Timeline (Single Column Layout) */}
        <div className="relative border-l border-[#514532]/25 ml-3 sm:ml-4 lg:ml-0 pl-6 sm:pl-10 lg:pl-12 col-span-12 lg:col-span-6 space-y-12 lg:space-y-24 pb-4">
          {EXPERIENCE.filter(e => e.id !== 'exp-3').map((exp) => {
            const isAiRudder = exp.company.includes("AI Rudder");
            const customCompany = isAiRudder 
              ? "AI Rudder Technology Corp" 
              : "Intellismart Technology Inc";
            const customRole = isAiRudder 
              ? "PRODUCT DELIVERY & OPERATIONS SPECIALIST INTERN" 
              : "CONTENT MANAGEMENT & TECH HELPDESK INTERN";
            const customDesc = isAiRudder
              ? "Orchestrating high-stakes delivery cycles for AI-driven voice automation solutions. Bridging the gap between technical infrastructure and operational excellence."
              : "Streamlined content delivery workflows and provided critical technical support for enterprise-level management systems, ensuring seamless digital experiences.";
            const customTags = isAiRudder
              ? ["AI OPS", "PRODUCT DELIVERY", "TECHNICAL QA"]
              : ["CMS", "IT SUPPORT", "WORKFLOW OPTIMIZATION"];

            return (
              <div key={exp.id} className="relative group space-y-3 lg:space-y-4 w-full">
                {/* Timeline yellow glowing indicator node */}
                <div className="absolute -left-[31px] sm:-left-[47px] lg:-left-[53px] top-1.5 lg:top-[53px] w-2.5 h-2.5 bg-[#ffba20] rounded-full ring-[5px] ring-[#ffba20]/15 shadow-[0_0_12px_rgba(255,184,0,0.85)] group-hover:scale-125 transition-all duration-300 pointer-events-none" />
                
                {/* Period/Year - Large and clear above the card */}
                <div className="font-mono text-xs sm:text-sm lg:text-base text-[#ffba20] uppercase tracking-[0.2em] font-bold">
                  {exp.period}
                </div>

                {/* Timeline entry card */}
                <div className="w-full bg-[#130d05]/30 border border-[#514532]/15 hover:border-[#ffba20]/30 hover:bg-[#130d05]/50 rounded-2xl p-5 sm:p-8 transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm space-y-4 lg:bg-transparent lg:border-none lg:p-0 lg:shadow-none lg:backdrop-blur-none lg:space-y-6 lg:hover:bg-transparent">
                  {/* Header info */}
                  <div className="space-y-2 lg:space-y-3">
                    <h3 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-[28px] xl:text-[32px] font-black text-[#f1e5d1] tracking-tight uppercase leading-snug lg:leading-tight break-words">
                      {customCompany}
                    </h3>
                    <p className="font-mono text-[9px] sm:text-xs lg:text-xs text-[#ffba20]/80 uppercase tracking-[0.16em] font-bold leading-relaxed break-words lg:mt-2">
                      {customRole}
                    </p>
                  </div>

                  {/* Body description */}
                  <p className="font-sans text-xs sm:text-sm lg:text-base text-[#d5c4ab]/80 lg:text-[#d5c4ab]/75 leading-relaxed lg:leading-[1.8] break-words lg:max-w-xl">
                    {customDesc}
                  </p>

                  {/* Badges / Tags */}
                  <div className="flex flex-wrap gap-2.5 pt-1 lg:pt-3">
                    {customTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-[14px] lg:py-[7px] bg-[#181309]/50 border border-[#514532]/25 lg:border-[#514532]/35 text-[#d5c4ab]/60 lg:text-[#d5c4ab]/75 font-mono text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[0.22em] font-bold rounded hover:border-[#ffba20]/45 lg:hover:border-[#ffba20]/50 transition-colors duration-300 shrink-0"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. "PUP FAO Dance Crew / Leadership" Section (Column 4) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Pictures Block on Left - Ordered last on mobile, first on desktop */}
        <div className="col-span-12 lg:col-span-5 relative group z-10 order-2 lg:order-1">
          <div className="relative rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden border border-[#514532]/25 aspect-[4/5] max-w-sm sm:max-w-md mx-auto bg-[#130d05] shadow-2xl">
            <div className="absolute inset-0 bg-[#ffdca1]/5 mix-blend-overlay pointer-events-none z-10 rounded-[1.5rem] lg:rounded-[2rem]" />
            <img
              src={PROFILE.danceImage}
              alt="PUP FAO Dance Crew"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-750 ease-out rounded-[1.5rem] lg:rounded-[2rem] pointer-events-none"
            />
            {/* Absolute overlay elements mimicking screenshots */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a05]/95 via-[#0e0a05]/30 to-transparent pointer-events-none z-10" />
            
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-20 space-y-3 sm:space-y-4">
              <div>
                <span className="font-mono text-[8px] sm:text-[9px] text-[#ffba20] uppercase tracking-[0.25em] font-black block mb-1">
                  05 // COMMUNITY COEXISTENCE
                </span>
                <h5 className="font-display text-lg sm:text-2xl lg:text-3xl font-black text-[#f1e5d1] uppercase tracking-wide">
                  PUP FAO Dance Crew
                </h5>
              </div>
              
              {/* Highlight statistics badges as seen on screenshots */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="px-3 py-2 sm:px-4 sm:py-3 bg-[#130d05]/75 border border-[#ffba20]/15 rounded-xl backdrop-blur-md">
                  <span className="font-display text-lg sm:text-2xl font-black text-[#ffba20] block leading-none mb-1">30+</span>
                  <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-[#d5c4ab]/50 font-bold block">Performers</span>
                </div>
                <div className="px-3 py-2 sm:px-4 sm:py-3 bg-[#130d05]/75 border border-[#ffba20]/15 rounded-xl backdrop-blur-md">
                  <span className="font-display text-lg sm:text-2xl font-black text-[#ffba20] block leading-none mb-1">5+</span>
                  <span className="font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-[#d5c4ab]/50 font-bold block">Years Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative block on Right - Ordered first on mobile, last on desktop */}
        <div className="col-span-12 lg:col-span-7 space-y-4 sm:space-y-6 lg:pl-6 order-1 lg:order-2">
          <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.25em] font-bold block">
            05 / LEADERSHIP BEYOND CODE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-[#f1e5d1] tracking-tight leading-[1.05] sm:leading-[0.98] uppercase">
            The Rhythm of <br className="hidden sm:inline" />
            Management
          </h2>
          <div className="font-sans text-xs sm:text-sm md:text-base text-[#d5c4ab]/85 space-y-4 sm:space-y-6 leading-relaxed max-w-2xl">
            <p>
              Leading the <strong className="text-[#ffba20] font-bold">PUP FAO Dance Crew</strong> was not merely an artistic endeavor—it was an intensive lesson in large-scale team orchestration, logistical tracking, and strategic execution.
            </p>
            <p>
              As the Internal President, I steered high-pressure rehearsal regimes, budget planning, supplies coordination, and synchronized performance structures for over 30 actors. Fusing creative layouts with computational task tracking and rigorous compliance files.
            </p>
            <p>
              This valuable role developed my system alignment capability, equipping me to organize resources and resolve complex logistics safely and efficiently under active event constraints.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Philosophy & Final Narrative Section (Column 4) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto py-12 space-y-8 border-t border-[#514532]/15 pt-20">
        <div className="text-center md:text-left">
          <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.3em] font-semibold block mb-1">
            06 / COGNITIVE HORIZONS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-[#ede1d0] uppercase tracking-tight">
            The Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#130d05] border border-[#514532]/25 rounded p-6 sm:p-10 cinematic-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffba20]/5 blur-2xl pointer-events-none" />
            <span className="material-symbols-outlined text-[#ffba20] text-[40px] mb-4">psychology</span>
            <h4 className="font-display text-2xl font-black uppercase text-[#ede1d0] mb-3">
              The AI x SE Intersection
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/80 leading-relaxed">
              I believe the future of software development resides in training models, rather than just writing static lines. 
              My methodology pairs strict system rules (data isolation, typing, dependency safety) with the fluid, adaptive intelligence 
              of intelligent conversation micro-agents.
            </p>
          </div>

          <div className="bg-[#130d05] border border-[#514532]/25 rounded p-6 sm:p-10 cinematic-glow relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#ffba20]/5 blur-2xl pointer-events-none" />
            <span className="material-symbols-outlined text-[#ffba20] text-[40px] mb-4">visibility</span>
            <h4 className="font-display text-2xl font-black uppercase text-[#ede1d0] mb-3">
              Looking Ahead
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/80 leading-relaxed">
              My core drive is to spearhead immersive digital layouts that feel organic and premium to interact with. 
              By harnessing synchronized client states, embedded intelligence logic, and gorgeous layouts, I seek to convert old-school, 
              boring screens into rich cinematic conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Localized Footer Instance */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
