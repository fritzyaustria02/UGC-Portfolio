/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles, Send, Edit, Check } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { editMode, setEditMode } = usePortfolio();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "UGC Item Shop", href: "#ugc" },
    { name: "3D Vault", href: "#models" },
    { name: "Games", href: "#gamedev" },
    { name: "GFX", href: "#gfx" },
    { name: "SFX", href: "#sfx" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-305 ${
      scrolled 
        ? "bg-[#050506]/85 backdrop-blur-md border-b border-slate-900/60 py-4 shadow-lg shadow-[#050506]/10" 
        : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo / Brand Name */}
          <a href="#home" className="flex items-center gap-2 group">
            <span className="p-1 px-2 rounded-lg bg-slate-900 border border-slate-805 text-brand-pink text-xs font-mono font-bold leading-none tracking-widest uppercase transition-colors group-hover:bg-slate-800">
              🐼 AyumiHP
            </span>
            <span className="text-sm font-bold text-white tracking-widest hidden sm:inline uppercase font-display">
              Ayumi<span className="text-brand-pink font-light">HeartPanda</span>
            </span>
          </a>

          {/* Desktop Nav Actions */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-white rounded-lg transition-all hover:bg-slate-900/20"
              >
                {link.name.toUpperCase()}
              </a>
            ))}
          </div>

          {/* New Portal Edit Toggle Option instead of commissions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`relative group px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 overflow-hidden shadow-lg select-none outline-none ${
                editMode 
                  ? "bg-brand-pink border-brand-pink text-white hover:brightness-110 shadow-brand-pink/20" 
                  : "bg-slate-900/80 border-slate-800 hover:border-brand-pink/40 text-slate-200"
              }`}
            >
              <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-[5%] transition-opacity" />
              {editMode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white animate-bounce" />
                  <span>DONE EDITING</span>
                </>
              ) : (
                <>
                  <Edit className="w-3.5 h-3.5 text-brand-pink" />
                  <span>EDIT PORTFOLIO</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Edit Mode status and burger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                editMode 
                  ? "bg-brand-pink border-brand-pink text-white" 
                  : "bg-slate-900 border-slate-805 text-slate-400"
              }`}
              title="Toggle Edit Mode"
            >
              {editMode ? "✍️ ON" : "✍️ EDIT"}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors outline-none focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Slide list */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b border-slate-900 bg-[#050506]/95 backdrop-blur-lg overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl hover:bg-slate-900 text-slate-300 hover:text-white font-mono text-xs tracking-wider"
                >
                  {link.name.toUpperCase()}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-900">
                <button
                  onClick={() => {
                    setEditMode(!editMode);
                    setIsOpen(false);
                  }}
                  className={`block w-full py-3 rounded-xl text-center text-xs font-bold transition-all ${
                    editMode 
                      ? "bg-gradient-to-r from-teal-500 to-emerald-600 text-white" 
                      : "bg-gradient-to-r from-brand-pink to-brand-purple text-white"
                  }`}
                >
                  {editMode ? "✍️ FINISH EDITING" : "✍️ EDIT PORTFOLIO TEXT"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
