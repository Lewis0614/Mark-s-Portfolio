import { useState, useRef, useEffect } from "react";
import { PROJECTS } from "../data";
import Footer from "./Footer";

interface WorkViewProps {
  onNavigate: (tab: string) => void;
}

export default function WorkView({ onNavigate }: WorkViewProps) {
  // Locker states (Project 1)
  const [activeLockerDoc, setActiveLockerDoc] = useState<string | null>("doc1");
  const [lockerUnlocked, setLockerUnlocked] = useState(true);
  
  // Hymn states (Project 2)
  const [isPlayingHymn, setIsPlayingHymn] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const visualizerIntervalRef = useRef<number | null>(null);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(new Array(16).fill(12));

  // Map states (Project 3)
  const [selectedMapPoint, setSelectedMapPoint] = useState<string>("Main Building");

  // Calculator states (Bento)
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcBase, setCalcBase] = useState<"DEC" | "BIN" | "HEX">("DEC");

  const [activeProjectCard, setActiveProjectCard] = useState<number | null>(null);
  const [activeUtilityCard, setActiveUtilityCard] = useState<number | null>(null);

  const docContents: { [key: string]: { code: string; title: string; tech: string } } = {
    doc1: { code: "PUP-REG-2026-X9", title: "PUP Enrollment Grid Registry", tech: "NodeJS + PostgreSQL" },
    doc2: { code: "AI-VOICE-RUDDER-7", title: "AI Speech Integration Blueprint", tech: "Python/TensorFlow" },
    doc3: { code: "CAB-IOT-FIRM-V3", title: "IoT Drawer Firmware Driver", tech: "C++ / ESP32" },
  };

  const handleLockerSelect = (docId: string) => {
    setActiveLockerDoc(docId);
    setLockerUnlocked(false);
    setTimeout(() => {
      setLockerUnlocked(true);
    }, 1000);
  };

  // Web Audio Synthesizer (PUP Hymn looping chords)
  const startSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      
      const notes = [220, 261.63, 329.63, 392.00, 440.00, 329.63, 261.63];
      let currentNoteIdx = 0;

      const playSequence = () => {
        if (!oscillatorRef.current) return;
        const nextFreq = notes[currentNoteIdx];
        osc.frequency.setValueAtTime(nextFreq, ctx.currentTime);
        currentNoteIdx = (currentNoteIdx + 1) % notes.length;
        setVisualizerBars(new Array(16).fill(0).map(() => Math.floor(Math.random() * 75) + 15));
      };

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;

      const synthInterval = window.setInterval(playSequence, 450);
      visualizerIntervalRef.current = synthInterval;

      setIsPlayingHymn(true);
    } catch (e) {
      console.error("Web Audio not blockable or supported:", e);
    }
  };

  const stopSynth = () => {
    if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (e) {}
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }
    oscillatorRef.current = null;
    audioContextRef.current = null;
    setIsPlayingHymn(false);
    setVisualizerBars(new Array(16).fill(12));
  };

  useEffect(() => {
    return () => {
      if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    };
  }, []);

  // Calculator logic
  const handleCalcBtn = (val: string) => {
    if (val === "C") {
      setCalcDisplay("0");
    } else if (val === "=") {
      try {
        const cleaned = calcDisplay.replace(/[^0-9+\-*/.]/g, "");
        const res = Function(`"use strict"; return (${cleaned})`)();
        setCalcDisplay(String(res));
      } catch (e) {
        setCalcDisplay("Error");
      }
    } else {
      setCalcDisplay((prev) => (prev === "0" ? val : prev + val));
    }
  };

  const getConvertedDisplay = () => {
    const num = parseFloat(calcDisplay);
    if (isNaN(num)) return calcDisplay;
    if (calcBase === "BIN") return (Math.floor(num) >>> 0).toString(2);
    if (calcBase === "HEX") return "0x" + (Math.floor(num) >>> 0).toString(16).toUpperCase();
    return calcDisplay;
  };

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32">
      
      {/* Page Header */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto pt-8 sm:pt-16">
        <div className="border-b border-[#514532]/10 pb-8">
          <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.3em] font-semibold block mb-2">
            03 / PORTFOLIO EXPLORATION
          </span>
          <h1 className="font-display text-4xl sm:text-7xl font-black uppercase leading-tight sm:leading-none tracking-tight text-[#ede1d0]">
            Selected Works
          </h1>
        </div>
      </section>

      {/* Project 1: Integrated Filing System */}
      <section
        onClick={() => {
          if (window.innerWidth <= 768) {
            setActiveProjectCard(0);
          }
        }}
        className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center cursor-pointer"
      >
        {/* Project Image Left */}
        <div className="w-full lg:col-span-7 relative group order-2 lg:order-1">
          <div className={`absolute -inset-4 bg-[#ffba20]/5 rounded-3xl blur-3xl transition-opacity duration-700 pointer-events-none ${
            activeProjectCard === 0 ? "opacity-100 md:opacity-0 md:group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
          }`} />
          <div className={`relative overflow-hidden rounded-2xl border shadow-2xl bg-[#130d05] h-auto sm:aspect-[16/10] transition-all duration-500 ${
            activeProjectCard === 0 ? "border-[#ffba20]/55" : "border-[#514532]/25 group-hover:border-[#ffba20]/45"
          }`}>
            <div className="absolute inset-0 bg-[#ffdca1]/5 mix-blend-overlay pointer-events-none z-10" />
            <img
              src={PROJECTS[0].image}
              alt={PROJECTS[0].title}
              referrerPolicy="no-referrer"
              className={`w-full h-auto sm:h-full object-contain sm:object-cover transition-all duration-750 ease-out ${
                activeProjectCard === 0 ? "grayscale-0 contrast-100" : "grayscale contrast-125 md:group-hover:grayscale-0 md:group-hover:contrast-100"
              }`}
            />
          </div>
        </div>

        {/* Project Description Right */}
        <div className="w-full lg:col-span-5 lg:pl-6 order-1 lg:order-2 flex flex-col">
          <div className="flex gap-2 sm:gap-3 flex-wrap mb-4 sm:mb-6">
            {["REACTJS", "NODEJS", "POSTGRESQL", "IOT"].map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-[#181309]/30 border border-[#514532]/30 text-[#d5c4ab]/65 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] font-bold rounded shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black text-[#f1e5d1] tracking-tight leading-[1.05] uppercase break-words mb-6">
            Integrated Filing <br className="hidden sm:inline" />
            System with QR <br className="hidden sm:inline" />
            Code Access
          </h2>
          
          <div className="font-sans text-xs sm:text-sm md:text-base text-[#d5c4ab]/85 space-y-4 leading-relaxed max-w-xl break-words">
            <p>
              A secure, end-to-end document management solution bridging physical storage and digital tracking. Leveraging IoT for real-time drawer interaction and QR technology for instant retrieval.
            </p>
          </div>
        </div>
      </section>

      {/* Project 2: Interactive PUP Hymn Website */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Project Description Left */}
        <div className="w-full lg:col-span-5 lg:pr-6 space-y-6">
          <div className="flex gap-2 flex-wrap">
            {PROJECTS[1].tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-[#1f1a11] border border-[#ffba20]/25 rounded text-[10px] font-mono uppercase text-[#d5c4ab]/80 font-bold shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-[#ede1d0] uppercase leading-tight tracking-tight break-words">
            Interactive PUP Hymn Website
          </h2>
          <div className="font-sans text-xs sm:text-sm md:text-base text-[#d5c4ab]/85 space-y-4 leading-relaxed">
            <p>
              An interactive multimedia web client presenting the university choral anthem with dynamic real-time lyric highlights and fluid scrolling alignment.
            </p>
            <p>
              This application has been developed to showcase microsecond-level synchronization of active verses alongside real audio players, wrapped in a high-contrast elegant night-sky visual board.
            </p>
          </div>
        </div>

        {/* Twilight Sequencer Player Card Right */}
        <div className="w-full lg:col-span-7 relative group">
          <div className={`absolute -inset-4 bg-[#ffba20]/5 rounded-3xl blur-3xl transition-opacity duration-700 pointer-events-none ${
            activeProjectCard === 1 ? "opacity-100 md:opacity-0 md:group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
          }`} />
          <div
            onClick={() => {
              if (window.innerWidth <= 768) {
                setActiveProjectCard(1);
              }
            }}
            className={`relative overflow-hidden rounded-lg border shadow-2xl bg-[#130d05] p-4 sm:p-8 space-y-4 sm:space-y-6 cinematic-glow w-full max-w-none transition-all duration-500 cursor-pointer ${
              activeProjectCard === 1
                ? "border-[#ffba20]/50 shadow-[0_0_20px_rgba(255,186,32,0.25)] md:border-[#514532]/20 md:shadow-none"
                : "border-[#514532]/20 hover:border-[#ffba20]/30 group-hover:border-[#ffba20]/35"
            }`}
          >
            
            {/* Visual Synthesizer Panel */}
            <div className="bg-[#1f1a11]/90 rounded border border-[#ffba20]/25 p-4 sm:p-5 space-y-4 relative overflow-hidden w-full">
              {/* Background Ambient Starry Art/Image block */}
              <div className="absolute inset-0 z-0 bg-[#130d05]/60">
                <img
                  src={PROJECTS[1].image}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-15 mix-blend-color-dodge blur-sm"
                  alt="Background preview"
                />
              </div>

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-black text-[#ede1d0] uppercase tracking-wider break-words leading-snug">
                    PUP Hymn Synthetic Sound Sequencer
                  </h4>
                  <p className="text-[9px] sm:text-[10px] font-mono text-[#d5c4ab]/50 leading-relaxed mt-1 break-words">
                    Web Audio oscillator frequencies & variable sequencers loop
                  </p>
                </div>
                <button
                  type="button"
                  onClick={isPlayingHymn ? stopSynth : startSynth}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isPlayingHymn ? "bg-[#ff571a] text-white shadow-lg shadow-[#ff571a]/25" : "bg-[#ffba20] text-[#181309] font-black hover:scale-105"
                  } shrink-0`}
                >
                  <span className="material-symbols-outlined font-black">
                    {isPlayingHymn ? "pause" : "play_arrow"}
                  </span>
                </button>
              </div>

              {/* Glowing Dynamic Visualizer Sound Bars */}
              <div className="relative z-10 bg-[#130d05]/90 h-16 sm:h-20 rounded border border-[#514532]/35 flex items-end justify-between p-3 sm:p-4 gap-[1.5px] sm:gap-[2.5px] overflow-hidden">
                {visualizerBars.map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="flex-1 bg-gradient-to-t from-[#ff571a] to-[#ffba20] rounded-sm transition-all duration-300 shadow-[0_0_10px_rgba(255,186,32,0.35)]"
                  />
                ))}
              </div>

              {/* Real-time sync text */}
              <div className="relative z-10 text-center font-serif italic text-[10px] sm:text-xs text-[#ffba20]/90 font-semibold min-h-[1.5rem] flex items-center justify-center px-1">
                {isPlayingHymn
                  ? "♪ Imno ng Sintang Paaralan... Gintong liwanag ng karunungan... ♪"
                  : "Listen to the synthetic frequency sequences"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project 3: Interactive PUP Vicinity Map */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Project Description (Order 1 on Mobile, 2 on Desktop) */}
        <div className="w-full lg:col-span-5 lg:pl-6 space-y-6 order-1 lg:order-2">
          <div className="flex gap-2 flex-wrap">
            {PROJECTS[2].tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-[#1f1a11] border border-[#ffba20]/25 rounded text-[10px] font-mono uppercase text-[#d5c4ab]/80 font-bold shrink-0"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-[#ede1d0] uppercase leading-tight tracking-tight break-words">
            Interactive PUP Vicinity Map
          </h2>
          <div className="font-sans text-xs sm:text-sm md:text-base text-[#d5c4ab]/85 space-y-4 leading-relaxed">
            <p>
              A spatial campus directory map plotting PUP landmarks using customized vector overlays, coordinate telemetry tags, and dynamic tooltip panels.
            </p>
            <p>
              Enables active navigation across landmark points, rendering accurate real-time architectural descriptions on selectors click events.
            </p>
          </div>
        </div>

        {/* Vector Map Layout Left (Order 2 on Mobile, 1 on Desktop) */}
        <div className="w-full lg:col-span-7 relative group order-2 lg:order-1">
          <div className={`absolute -inset-4 bg-[#ffba20]/5 rounded-3xl blur-3xl transition-opacity duration-700 pointer-events-none ${
            activeProjectCard === 2 ? "opacity-100 md:opacity-0 md:group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
          }`} />
          <div
            onClick={() => {
              if (window.innerWidth <= 768) {
                setActiveProjectCard(2);
              }
            }}
            className={`relative overflow-hidden rounded-lg border shadow-2xl bg-[#130d05] p-4 sm:p-8 space-y-4 sm:space-y-6 cinematic-glow w-full transition-all duration-500 cursor-pointer ${
              activeProjectCard === 2
                ? "border-[#ffba20]/50 shadow-[0_0_20px_rgba(255,186,32,0.25)] md:border-[#514532]/20 md:shadow-none"
                : "border-[#514532]/20 hover:border-[#ffba20]/30 group-hover:border-[#ffba20]/35"
            }`}
          >
            
            {/* Mesh overlay simulation inside mapping block */}
            <div className="relative overflow-hidden rounded border border-[#514532]/25 bg-[#181309] flex flex-col justify-between p-3 sm:p-4 gap-4 aspect-auto min-h-[460px] xs:min-h-[420px] sm:min-h-0 sm:aspect-video w-full">
              <div className="flex justify-between items-center z-10 gap-2 flex-wrap">
                <span className="font-mono text-[8px] sm:text-[9px] text-[#ffba20] uppercase bg-[#130d05]/95 px-2 py-1 rounded border border-[#514532]/30 break-words max-w-[80%]">
                  TACTICAL CAMPUS VECTOR BLUEPRINT
                </span>
                <span className="font-mono text-[8px] sm:text-[9px] text-[#d5c4ab]/50 uppercase tracking-widest font-black select-none shrink-0">PUP MAIN</span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center p-6 opacity-60 pointer-events-none">
                <svg width="100%" height="80%" viewBox="0 0 400 240" className="opacity-75">
                  <line x1="20" y1="20" x2="380" y2="220" stroke="#514532" strokeWidth="0.4" strokeDasharray="3 3" />
                  <line x1="20" y1="220" x2="380" y2="20" stroke="#514532" strokeWidth="0.4" strokeDasharray="3 3" />
                  <circle cx="200" cy="120" r="75" stroke="#ffba20" strokeWidth="0.5" strokeDasharray="2 2" fill="none" />
                  <path d="M 40,40 L 130,90 L 195,125 L 310,95 L 340,185" stroke="#ffba20" strokeWidth="1.2" fill="none" />
                  <path d="M 130,90 L 270,175 L 340,185" stroke="#ff571a" strokeWidth="0.8" strokeDasharray="3 3" fill="none" />
                </svg>
              </div>

              {/* Selectors map nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 z-10 w-full">
                {[
                  { name: "Main Building", coords: "14.598° N, 121.005° E" },
                  { name: "PUP Obelisk", coords: "14.599° N, 121.004° E" },
                  { name: "Interfaith Chapel", coords: "14.597° N, 121.006° E" },
                  { name: "Linear Park", coords: "14.596° N, 121.003° E" },
                ].map((pt) => {
                  const isActive = selectedMapPoint === pt.name;
                  return (
                    <button
                      key={pt.name}
                      onClick={() => setSelectedMapPoint(pt.name)}
                      className={`p-1.5 sm:p-2 rounded text-left cursor-pointer transition-all border ${
                        isActive
                          ? "bg-[#ffba20]/20 border-[#ffba20] text-[#ffba20]"
                          : "bg-[#130d05]/95 border-[#514532]/40 text-[#d5c4ab] hover:border-[#ffba20]/15"
                      }`}
                    >
                      <h5 className="font-sans text-[9px] sm:text-[10px] font-black leading-tight uppercase tracking-wider break-words">{pt.name}</h5>
                      <p className="text-[7px] sm:text-[8px] font-mono opacity-50 block mt-0.5 leading-normal sm:leading-none break-words">{pt.coords}</p>
                    </button>
                  );
                })}
              </div>

              {/* Data panel display */}
              <div className="bg-[#130d05]/95 border border-[#514532]/25 p-3 rounded z-10 w-full mt-auto">
                <span className="font-mono text-[7px] sm:text-[8px] text-[#ffba20] uppercase font-bold block mb-1 leading-none tracking-wider">
                  PATHFINDER COORDINATES DATABASE
                </span>
                <p className="text-[10px] sm:text-[11px] text-[#d5c4ab]/80 leading-relaxed break-words">
                  {selectedMapPoint === "Main Building" && "Main Building: Anchor coordinates houses administrative registers, engineering departments, and direct system laboratories."}
                  {selectedMapPoint === "PUP Obelisk" && "PUP Obelisk: Gateway pride sculpture landmark. Guides layout entrances with beautiful warm spotlights."}
                  {selectedMapPoint === "Interfaith Chapel" && "Interfaith Chapel: Peaceful spiritual assembly space coordinates supporting interdisciplinary groups."}
                  {selectedMapPoint === "Linear Park" && "Linear Park: Sprawling recreational walkways parallel to Pasig River boundaries."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid layout Utilities (Bottom layouts) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 pb-6 border-b border-[#514532]/10">
          <div>
            <span className="font-mono text-xs text-[#ffba20] uppercase tracking-[0.3em] font-semibold block mb-1">
              04 / COMPLEMENTARY WIDGETS
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-black text-[#ede1d0] uppercase tracking-wide">
              Selected Utilities
            </h3>
          </div>
          <span className="font-mono text-[11px] text-[#d5c4ab]/40 uppercase tracking-widest font-bold">UTILITIES DEPLOYMENTS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Advanced Calculator Card */}
          <div
            onClick={() => {
              if (window.innerWidth <= 768) {
                setActiveUtilityCard(0);
              }
            }}
            className={`group relative bg-[#130d05] transition-all duration-500 rounded p-6 sm:p-10 flex flex-col justify-between overflow-hidden cinematic-glow min-h-[380px] sm:min-h-[460px] border cursor-pointer ${
              activeUtilityCard === 0
                ? "border-[#ffba20]/45 shadow-[0_0_15px_rgba(255,186,32,0.2)] md:border-[#514532]/20 md:shadow-none md:hover:border-[#ffba20]/30"
                : "border-[#514532]/20 hover:border-[#ffba20]/30"
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffba20]/5 blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[#ffba20] text-3xl">calculate</span>
                <span className="font-mono text-[9px] text-[#ffba20] bg-[#ffba20]/10 border border-[#ffba20]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  NUMERIC ENGINE
                </span>
              </div>
              <h4 className="font-display text-2xl font-black uppercase text-[#ede1d0]">
                Advanced Calculator Web App
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/85 leading-relaxed">
                Integrated numeric parser web widget parsing memory caches, base standard calculations, and digital base conversions in dec, bin, hex.
              </p>

              {/* Live Calculator Widget */}
              <div className="bg-[#1f1a11]/90 rounded border border-[#ffba20]/20 p-4 space-y-3 relative z-10 max-w-xs mx-auto md:mx-0">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {["DEC", "BIN", "HEX"].map((base) => (
                      <button
                        key={base}
                        onClick={() => setCalcBase(base as any)}
                        className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                          calcBase === base
                            ? "bg-[#ffba20] border-[#ffba20] text-[#181309] font-black"
                            : "bg-[#130d05] border-[#514532]/35 text-[#d5c4ab]/60"
                        }`}
                      >
                        {base}
                      </button>
                    ))}
                  </div>
                  <span className="font-mono text-[80%] text-[#ffba20]/50 tracking-wide uppercase font-bold">Live Board</span>
                </div>

                <div className="bg-[#130d05]/95 rounded border border-[#514532]/30 p-2 text-right font-mono text-base text-[#ede1d0] h-10 flex items-center justify-end overflow-hidden">
                  {getConvertedDisplay()}
                </div>

                <div className="grid grid-cols-4 gap-1.5 h-32">
                  {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "C", "0", "=", "+"].map((btn) => (
                    <button
                      key={btn}
                      onClick={() => handleCalcBtn(btn)}
                      className={`font-mono py-1 rounded text-[10px] text-center border cursor-pointer hover:bg-[#30291e] transition-colors leading-none font-bold ${
                        btn === "="
                          ? "bg-[#ffba20] border-[#ffba20] text-[#181309] font-black hover:bg-[#ffdca1]"
                          : btn === "C"
                          ? "bg-[#ff571a]/15 border-[#ff571a]/25 text-[#ff571a]"
                          : "bg-[#130d05] border-[#514532]/40 text-[#ede1d0]"
                      }`}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <span className="font-mono text-[9px] text-[#d5c4ab]/30 uppercase tracking-widest block pt-4 border-t border-[#514532]/10 mt-6 select-none">
              HTML • CSS • JAVASCRIPT SYSTEM
            </span>
          </div>

          {/* Python Address Book Card */}
          <div
            onClick={() => {
              if (window.innerWidth <= 768) {
                setActiveUtilityCard(1);
              }
            }}
            className={`group relative bg-[#130d05] transition-all duration-500 rounded p-6 sm:p-10 flex flex-col justify-between overflow-hidden cinematic-glow min-h-[380px] sm:min-h-[460px] border cursor-pointer ${
              activeUtilityCard === 1
                ? "border-[#ffba20]/45 shadow-[0_0_15px_rgba(255,186,32,0.2)] md:border-[#514532]/20 md:shadow-none md:hover:border-[#ffba20]/30"
                : "border-[#514532]/20 hover:border-[#ffba20]/30"
            }`}
          >
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ffba20]/5 blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-[#ffba20] text-3xl">contacts</span>
                <span className="font-mono text-[9px] text-[#ffba20] bg-[#ffba20]/10 border border-[#ffba20]/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  REGISTRY MODULE
                </span>
              </div>
              <h4 className="font-display text-2xl font-black uppercase text-[#ede1d0]">
                Phone Address Book Python Desktop
              </h4>
              <p className="font-sans text-xs sm:text-sm text-[#d5c4ab]/85 leading-relaxed">
                Graphical User Interface (GUI) Address Book program developed to manage, secure, search, and update contacts, backed by clean Object-Oriented layouts.
              </p>

              {/* Simulated UI Contacts Contacts widget */}
              <div className="bg-[#1f1a11]/90 rounded border border-[#ffba20]/20 p-4 space-y-3 relative z-10 max-w-xs mx-auto md:mx-0">
                <div className="flex justify-between items-center pb-2 border-b border-[#514532]/10">
                  <span className="font-mono text-[9px] text-[#ffba20] uppercase font-bold tracking-wider">Live Directory GUI</span>
                  <span className="font-mono text-[8px] text-[#d5c4ab]/40 uppercase">2 Records</span>
                </div>
                
                <div className="space-y-1.5 h-[90px] overflow-y-auto">
                  <div className="bg-[#130d05]/95 border border-[#514532]/20 rounded p-2 flex items-center justify-between">
                    <div>
                      <h5 className="text-[11px] font-black text-[#ede1d0] leading-tight">Juan de la Cruz</h5>
                      <p className="text-[9px] font-mono text-[#d5c4ab]/50 leading-none mt-0.5">+63 912 345 6789</p>
                    </div>
                    <span className="text-[8px] bg-[#ffba20]/10 border border-[#ffba20]/20 text-[#ffba20] px-2 py-0.5 rounded uppercase font-mono font-bold leading-none">PUP</span>
                  </div>
                  <div className="bg-[#130d05]/95 border border-[#514532]/20 rounded p-2 flex items-center justify-between">
                    <div>
                      <h5 className="text-[11px] font-black text-[#ede1d0] leading-tight">Maria Santos</h5>
                      <p className="text-[9px] font-mono text-[#d5c4ab]/50 leading-none mt-0.5">+63 998 765 4321</p>
                    </div>
                    <span className="text-[8px] bg-[#ff571a]/15 border border-[#ff571a]/25 text-[#ff571a] px-2 py-0.5 rounded uppercase font-mono font-bold leading-none">Work</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#514532]/10">
                  <p className="text-[9px] font-mono text-[#d5c4ab]/40 leading-relaxed font-semibold italic">
                    * Interactive lifecycle registers configured in Tkinter structures.
                  </p>
                </div>
              </div>
            </div>
            
            <span className="font-mono text-[9px] text-[#d5c4ab]/30 uppercase tracking-widest block pt-4 border-t border-[#514532]/10 mt-6 select-none">
              PYTHON • TKINTER DESKTOP DEPLOYMENT
            </span>
          </div>
        </div>
      </section>

      {/* Localized Footer Instance */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
