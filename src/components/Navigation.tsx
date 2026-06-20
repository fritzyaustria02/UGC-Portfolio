/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Sparkles, Send } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

          <div className="hidden lg:flex items-center gap-4">
            {/* Removed Edit Portfolio toggle to publish finalized design */}
          </div>

          {/* Mobile burger button */}
          <div className="flex items-center gap-3 lg:hidden">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
