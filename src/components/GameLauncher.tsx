/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, Users, Heart, Shield, Laptop, Smartphone, Gamepad, Play, CheckCircle, Edit, Plus } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { GameProject } from "../data";
import EditItemModal from "./EditItemModal";

export default function GameLauncher() {
  const { 
    gameProjects, 
    updateGameProject, 
    addGameProject, 
    deleteGameProject, 
    editMode,
    userInfo
  } = usePortfolio();

  const [activeGame, setActiveGame] = useState<string>(gameProjects[0]?.id || "");
  const [editingGame, setEditingGame] = useState<GameProject | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fallback if no games exist (or if the active one got deleted)
  const availableProjects = gameProjects && gameProjects.length > 0 ? gameProjects : [];
  const selectedGame = availableProjects.find(g => g.id === activeGame) || availableProjects[0];

  const handleEditClick = (e: React.MouseEvent, game: GameProject) => {
    e.stopPropagation();
    setEditingGame(game);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const freshTemplate: Omit<GameProject, "id"> = {
      title: "New Simulator Tycoon: Remastered",
      genre: "Simulator",
      platforms: ["PC", "Mobile"],
      role: "Solo Developer",
      description: "An incredibly engaging virtual simulator custom coded with Luau serverside mechanics, optimized frameworks, and cute pets.",
      thumbnail: "https://picsum.photos/seed/gamethumb/600/350",
      playLink: "https://www.roblox.com/games",
      visits: "10K+",
      activePlayers: "15 Players",
      rating: "98.5%",
      features: [
        "Structured incremental saving logic (Datastorereplicas)",
        "Fully optimized local physics rendering pipelines",
        "Engaging UI/UX elements with smooth layout updates"
      ]
    };
    setIsAddingNew(true);
    setEditingGame(freshTemplate as any);
  };

  const handleSaveGame = (updatedData: any) => {
    if (isAddingNew) {
      const added = addGameProject(updatedData);
      if (added) {
        setActiveGame(added.id);
      }
    } else {
      updateGameProject(updatedData.id, updatedData);
    }
  };

  const handleDeleteGame = () => {
    if (editingGame && "id" in editingGame) {
      deleteGameProject(editingGame.id);
      // Auto-switch to next available game id
      const remaining = availableProjects.filter(p => p.id !== editingGame.id);
      if (remaining.length > 0) {
        setActiveGame(remaining[0].id);
      } else {
        setActiveGame("");
      }
    }
  };

  return (
    <section id="gamedev" className="py-20 border-t border-slate-900 bg-gradient-to-b from-[#050506] to-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 bg-brand-cyan rounded-full"></span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
                {userInfo.gameTitle || "Roblox Game Development"}
                {editMode && (
                  <button
                    onClick={handleAddNew}
                    className="ml-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan/25 hover:bg-brand-cyan border border-brand-cyan/30 text-brand-cyan hover:text-slate-900 transition-all rounded-lg text-xs font-mono font-bold uppercase cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl font-medium">
              {userInfo.gameDesc || "Immersive, high-performance virtual experiences programmed, scripted, or visually directed within the Luau Luau ecosystem."}
            </p>
          </div>

          {/* Quick Selector buttons */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0 font-mono text-xs">
            {availableProjects.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveGame(g.id)}
                className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                  activeGame === g.id
                    ? "bg-brand-cyan/10 border-brand-cyan text-slate-100 font-bold"
                    : "bg-slate-900/40 border-slate-900 text-slate-500 hover:text-slate-300"
                }`}
              >
                {g.title.split(":")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Game Case Study Banner */}
        {selectedGame ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedGame.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/10 border border-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-sm overflow-hidden relative"
            >
              {/* Background cyber accent glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />

              {/* Edit Button overlay */}
              {editMode && (
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={(e) => handleEditClick(e, selectedGame)}
                    className="flex items-center gap-1.5 p-2 rounded-lg bg-teal-500 hover:bg-white text-white hover:text-teal-950 shadow-md transition-all text-xs font-mono font-bold"
                    title="Edit Game"
                  >
                    <Edit className="w-4 h-4" />
                    <span>EDIT SPECS</span>
                  </button>
                </div>
              )}

              {/* Left: Cinematic GFX Thumbnail */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="relative group aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
                  <img
                    src={selectedGame.thumbnail}
                    alt={selectedGame.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Embedded Play Button Overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] hover:backdrop-blur-none transition-all flex items-center justify-center">
                    <motion.a
                      href={selectedGame.playLink || "https://www.roblox.com"}
                      target="_blank"
                      rel="noreferrer"
                      referrerPolicy="no-referrer"
                      className="p-5 rounded-full bg-brand-cyan text-[#050506] shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 pointer-events-auto"
                      whileHover={{ rotate: 10 }}
                    >
                      <Play className="w-6 h-6 fill-current pl-0.5" />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Right: Detailed Specifications */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                
                {/* Profile Bio */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded bg-brand-cyan/15 border border-brand-cyan/20 text-brand-cyan font-mono text-[9px] uppercase tracking-widest font-semibold">
                      {selectedGame.genre}
                    </span>
                    
                    {/* Platforms */}
                    <div className="flex gap-1.5 text-slate-500">
                      {selectedGame.platforms?.includes("PC") && <Laptop className="w-3.5 h-3.5" title="PC compatible" />}
                      {selectedGame.platforms?.includes("Mobile") && <Smartphone className="w-3.5 h-3.5" title="Mobile compatible" />}
                      {selectedGame.platforms?.includes("Console") && <Gamepad className="w-3.5 h-3.5" title="Console compatible" />}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
                    {selectedGame.title}
                  </h3>

                  <p className="text-xs font-mono text-slate-400 mb-4 pb-4 border-b border-slate-900">
                    ROLE: <span className="text-slate-200">{selectedGame.role}</span>
                  </p>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {selectedGame.description}
                  </p>

                  {/* Major Achievements Checklist */}
                  <h4 className="text-[10px] font-mono text-brand-cyan font-bold tracking-widest uppercase mb-3 text-left">CORE TECHNICAL ACHIEVEMENTS //</h4>
                  <ul className="space-y-2 mb-8 text-left">
                    {selectedGame.features?.map((feat, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Game Stats Hub */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-900 text-center font-mono text-xs select-none mt-auto col-span-1">
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase tracking-widest block mb-0.5">Visits</span>
                    <span className="text-slate-200 text-sm font-bold">{selectedGame.visits}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase tracking-widest block mb-0.5">Active</span>
                    <div className="flex items-center justify-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-slate-200 text-xs font-bold leading-none">{selectedGame.activePlayers?.split(" ")[0]}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[8px] uppercase tracking-widest block mb-0.5">Likes</span>
                    <span className="text-brand-cyan font-bold">{selectedGame.rating}</span>
                  </div>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-20 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
            <h3 className="text-base font-semibold text-slate-300">No game projects loaded</h3>
            {editMode && (
              <button
                onClick={handleAddNew}
                className="mt-4 px-4 py-2 bg-brand-cyan text-[#050506] rounded-xl text-xs font-bold font-mono tracking-widest"
              >
                + ADD GAME BLUEPRINT
              </button>
            )}
          </div>
        )}

      </div>

      {/* Editing dialog */}
      <AnimatePresence>
        {editingGame && (
          <EditItemModal
            isOpen={!!editingGame}
            onClose={() => {
              setEditingGame(null);
              setIsAddingNew(false);
            }}
            itemType="game"
            item={editingGame}
            onSave={handleSaveGame}
            onDelete={handleDeleteGame}
          />
        )}
      </AnimatePresence>

    </section>
  );
}
