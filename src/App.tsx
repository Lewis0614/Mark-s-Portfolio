/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PROFILE } from "./data";
import HomeView from "./components/HomeView";
import WorkView from "./components/WorkView";
import StoryView from "./components/StoryView";
import ContactView from "./components/ContactView";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }

      if (e.key === "Tab" && isMobileMenuOpen) {
        const focusableElements = document.querySelectorAll<HTMLElement>(".mobile-menu-focusable");
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const renderActiveView = () => {
    const navHandler = (tab: string) => {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    switch (activeTab) {
      case "Home":
        return <HomeView onNavigate={navHandler} />;
      case "Work":
        return <WorkView onNavigate={navHandler} />;
      case "Story":
        return <StoryView onNavigate={navHandler} />;
      case "Contact":
        return <ContactView onNavigate={navHandler} />;
      default:
        return <HomeView onNavigate={navHandler} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#181309] text-[#ede1d0] font-sans antialiased flex flex-col justify-between overflow-x-hidden relative selection:bg-[#ffb800]/30 selection:text-[#ffdca1]">
      
      {/* Absolute Dynamic Grid Matrix Pattern Overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#51453210_1px,transparent_1px),linear-gradient(to_bottom,#51453210_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Hamburger Menu Button (Mobile ONLY) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-expanded={isMobileMenuOpen}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="mobile-menu-focusable fixed top-3 left-4 sm:top-4 sm:left-8 z-50 md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-[#130d05]/80 backdrop-blur-md border border-[#ffba20]/25 shadow-[0_0_12px_rgba(255,186,32,0.15)] focus:outline-none focus:ring-2 focus:ring-[#ffba20] active:scale-95 transition-all text-[#ede1d0] cursor-pointer"
      >
        <div className="w-5 h-[14px] flex flex-col justify-between relative">
          <span
            className={`h-[2px] bg-[#ede1d0] rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[6px] bg-[#ffba20]" : "w-full"
            }`}
          />
          <span
            className={`h-[2px] bg-[#ede1d0] rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0 w-0" : "w-4/5"
            }`}
          />
          <span
            className={`h-[2px] bg-[#ede1d0] rounded-full transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[6px] bg-[#ffba20]" : "w-full"
            }`}
          />
        </div>
      </button>

      {/* Mobile Navigation Panel Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#181309]/95 backdrop-blur-lg md:hidden flex flex-col justify-center items-center"
            onClick={() => setIsMobileMenuOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* Subtle Amber Glow Background and Grid overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#5145320d_1px,transparent_1px),linear-gradient(to_bottom,#5145320d_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ffba20]/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="flex flex-col items-center gap-6 z-10 w-full px-8 max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {["Home", "Story", "Work", "Contact"].map((tab, idx) => (
                <motion.button
                  key={tab}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.05 }}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`mobile-menu-focusable w-full py-4 text-center font-display text-2xl tracking-[0.25em] transition-all relative border border-[#ffba20]/0 hover:border-[#ffba20]/15 hover:bg-[#ffba20]/5 rounded-lg cursor-pointer ${
                    activeTab === tab
                      ? "text-[#ffba20] font-black scale-105"
                      : "text-[#ede1d0]/75 hover:text-white uppercase font-bold"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navbar Header */}
      <nav className="fixed top-0 left-0 right-0 z-30 bg-[#181309]/80 backdrop-blur-md border-b border-[#514532]/10 px-4 sm:px-8 lg:px-12 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <button
            onClick={() => setActiveTab("Home")}
            className="flex items-center cursor-pointer group pl-14 md:pl-0"
          >
            <span className="font-display font-bold uppercase tracking-[0.1em] text-xl sm:text-2xl text-[#ede1d0] group-hover:text-white transition-colors">
              Jhay Mark A.
            </span>
          </button>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-2">
            {["Home", "Story", "Work", "Contact"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-display uppercase tracking-widest font-semibold transition-all relative cursor-pointer ${
                  activeTab === tab
                    ? "text-[#ede1d0]"
                    : "text-[#d5c4ab]/60 hover:text-white"
                }`}
              >
                {/* Underline indicator exactly like the screenshot */}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#ffba20]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Action button */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab("Contact")}
              className="px-3 py-2 sm:px-6 sm:py-2.5 bg-[#ffba20] text-[#181309] font-display text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest font-bold hover:bg-[#ffdca1] transition-colors rounded cursor-pointer"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </nav>

      {/* Main Sections Body View */}
      <main className="flex-1 pt-20 sm:pt-24 pb-0 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

