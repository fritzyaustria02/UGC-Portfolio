/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import UgcCatalog from "./components/UgcCatalog";
import ModelVault from "./components/ModelVault";
import GameLauncher from "./components/GameLauncher";
import GfxGallery from "./components/GfxGallery";
import SfxLounge from "./components/SfxLounge";
import { Sparkles, Heart, RefreshCw } from "lucide-react";
import { PortfolioProvider, usePortfolio } from "./context/PortfolioContext";

function MainAppContent() {
  const { editMode, resetAll } = usePortfolio();

  return (
    <div className="bg-[#050506] text-slate-100 min-h-screen relative font-sans overflow-x-hidden selection:bg-brand-pink/30 selection:text-white pb-12">
      {/* Universal Floating Cosmic Stars Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,102,178,0.015),transparent_60%)] pointer-events-none" />
      
      {/* Sticky frosted glass structural navigation rail */}
      <Navigation />

      {/* Dynamic Editing Banner if active */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 84 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-x-0 z-30 mx-auto max-w-3xl px-4"
          >
            <div className="flex items-center justify-between gap-3 p-3 px-4 rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border border-brand-pink/35 shadow-lg shadow-brand-pink/5 text-[11px] text-slate-200 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-brand-pink/10 text-brand-pink animate-pulse">✍️</span>
                <p>
                  <span className="font-bold text-brand-pink uppercase tracking-wider text-[10px] mr-1.5 bg-brand-pink/10 px-1.5 py-0.5 rounded border border-brand-pink/20">Edit Mode</span>
                  Click the <span className="text-white font-semibold">✏️ edit badge</span> on any section or card to update text instantly!
                </p>
              </div>
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-705 text-[10px] uppercase font-mono tracking-wider font-semibold text-slate-350 hover:text-white transition-all shrink-0"
                title="Reset portfolio to default sample designs"
              >
                <RefreshCw className="w-3 h-3 animate-spin-slow" />
                <span>Reset Default</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Visual Flow */}
      <main className="relative z-10">
        <Hero />
        <UgcCatalog />
        <ModelVault />
        <GameLauncher />
        <GfxGallery />
        <SfxLounge />
      </main>

      {/* Global Aesthetic Footer */}
      <footer className="mt-20 pt-16 border-t border-slate-900 bg-slate-950/40 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-pink/[0.01] to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-slate-920">
            <div>
              {/* Brand label */}
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded bg-slate-900 text-brand-pink text-[10px] font-mono leading-none border border-slate-800">🐼</span>
                <span className="font-extrabold text-sm text-white tracking-widest uppercase font-display">
                  Ayumi<span className="text-brand-pink font-light">HeartPanda</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                UGC Creator, 3D Modeler, Game Developer & Multi-disciplinary Digital Artist specializing in adorable Goth-Panda brand concepts.
              </p>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              <a href="#home" className="hover:text-brand-pink transition-colors">HOME</a>
              <span>•</span>
              <a href="#ugc" className="hover:text-brand-pink transition-colors">UGC SHOP</a>
              <span>•</span>
              <a href="#models" className="hover:text-brand-pink transition-colors">3D VAULT</a>
              <span>•</span>
              <a href="#gfx" className="hover:text-brand-pink transition-colors">GFX</a>
              <span>•</span>
              <a href="#sfx" className="hover:text-brand-pink transition-colors">SFX</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between py-8 text-[11px] font-mono text-slate-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} AyumiHeartPanda. All virtual assets, character structures, and code designs fully reserved.
            </p>
            <p className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-brand-pink fill-current" />
              <span>&amp; Roblox magic.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainAppContent />
    </PortfolioProvider>
  );
}
