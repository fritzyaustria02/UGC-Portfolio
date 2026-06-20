/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, User, Twitter, MessageCircle, Palette, Sparkles, ExternalLink, Edit } from "lucide-react";
import { SOCIAL_LINKS } from "../data";
import { usePortfolio } from "../context/PortfolioContext";
import EditItemModal from "./EditItemModal";

// Helper to dynamically render Lucide Icons by name
const IconRenderer = ({ name, className }: { name: string; className?: string }) => {
  switch (name) {
    case "Twitter":
      return <Twitter className={className} />;
    case "Gamepad2":
      return <Gamepad2 className={className} />;
    case "User":
      return <User className={className} />;
    case "MessageCircle":
      return <MessageCircle className={className} />;
    case "Palette":
      return <Palette className={className} />;
    default:
      return <User className={className} />;
  }
};

export default function Hero() {
  const { userInfo, updateUserInfo, editMode } = usePortfolio();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  } as const;

  return (
    <section id="home" className="relative pt-24 pb-16 md:py-32 overflow-hidden">
      {/* Dynamic Grid Background with Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.04),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Floating Admin Edit Button for Hero Section */}
        {editMode && (
          <div className="absolute right-4 top-0 z-20">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-pink/20 hover:bg-brand-pink border border-brand-pink/40 text-brand-pink hover:text-white transition-all text-xs font-semibold font-mono"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>EDIT HERO &amp; BIO TEXT</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left */}
          <motion.div 
            className="lg:col-span-7 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status Chip */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 backdrop-blur-md mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-pink"></span>
              </span>
              <span className="text-xs font-medium font-mono text-slate-300 tracking-wider uppercase">Portfolio Active &amp; Live</span>
            </motion.div>

            {/* Main Name & Title */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-[1.1]"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-rose-300 to-purple-200">
                {userInfo.name}
              </span>
              <span className="text-lg sm:text-xl md:text-2xl font-light tracking-wide text-slate-400 block mt-2 font-display">
                {userInfo.title}
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed"
            >
              {userInfo.tagline}
            </motion.p>

            {/* Social Link Badges */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10"
            >
              {SOCIAL_LINKS.map((link) => (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/40 border border-slate-800 hover:border-brand-pink/50 hover:bg-slate-900/80 text-slate-300 hover:text-white transition-all duration-300 font-mono text-xs shadow-md"
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconRenderer name={link.iconName} className="w-3.5 h-3.5 text-brand-pink" />
                  <span>{link.username}</span>
                </motion.a>
              ))}
            </motion.div>

            {/* Call To Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-12"
            >
              <a 
                href="#ugc" 
                className="px-8 py-4 rounded-xl font-bold text-sm text-center bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-lg hover:shadow-brand-pink/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>View UGC Shop</span>
                <Sparkles className="w-4 h-4 animate-bounce" />
              </a>
              <a 
                href="#gfx" 
                className="px-8 py-4 rounded-xl font-bold text-sm text-center bg-slate-900/60 border border-slate-800 hover:border-slate-705 text-slate-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Explore Creations</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </motion.div>
          </motion.div>

          {/* Hero GFX Avatar Right */}
          <motion.div 
            className="lg:col-span-5 flex justify-center h-full relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, delay: 0.3 }}
          >
            <div className="relative group w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96">
              {/* Outer Cosmic Aura */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand-pink via-purple-600 to-cyan-400 opacity-60 blur-xl group-hover:opacity-80 transition-all duration-700 animate-pulse" />
              
              {/* Inner Avatar Frame */}
              <div className="relative w-full h-full rounded-2xl border-2 border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center shadow-2xl">
                <img 
                  src={userInfo.avatar} 
                  alt="Ayumi GFX Render" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Embedded Stars Overlay */}
                <div className="absolute top-4 left-4 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
                  <span className="text-[10px] font-mono tracking-widest text-brand-pink uppercase font-medium">Rendered GFX v1.0</span>
                </div>
              </div>

              {/* Floating aesthetic tags */}
              <motion.div 
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg bg-indigo-950/90 border border-indigo-800 text-[10px] font-mono text-indigo-200 uppercase tracking-widest shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                ✨ Blender Pro
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-lg bg-rose-950/90 border border-rose-800 text-[10px] font-mono text-rose-200 uppercase tracking-widest shadow-lg"
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              >
                🐼 Kawaii Goth
              </motion.div>
            </div>
          </motion.div>

        </div>

        {/* Stats / Metrics Bar */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/40 to-slate-950/60 border border-slate-900 backdrop-blur-md divide-y-0 divide-x-0 md:divide-x divide-slate-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {userInfo.metrics.map((metric, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4 py-3 md:py-0">
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 font-display">
                {metric.value}
              </span>
              <span className="text-xs text-slate-400 font-mono tracking-wider uppercase mt-1">
                {metric.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* About Short Bio */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-24 pt-16 border-t border-slate-900">
          <motion.div 
            className="md:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-brand-pink font-mono">//</span> About Ayumi
            </h2>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase mt-1">THE PANDA BEHIND THE MESH</p>
          </motion.div>
          <motion.div 
            className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-300 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div>
              <p>{userInfo.aboutLeft}</p>
            </div>
            <div>
              <p>{userInfo.aboutRight}</p>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Editing dialog */}
      <AnimatePresence>
        {isEditOpen && (
          <EditItemModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            itemType="user"
            item={userInfo}
            onSave={updateUserInfo}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
