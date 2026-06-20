/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, X, Image, Sparkles, Compass, Palette, Edit, Plus } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { GfxItem } from "../data";
import EditItemModal from "./EditItemModal";

export default function GfxGallery() {
  const { 
    gfxItems, 
    updateGfxItem, 
    addGfxItem, 
    deleteGfxItem, 
    editMode,
    userInfo
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Editing state
  const [editingGfx, setEditingGfx] = useState<GfxItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const tabs = ["All", "Game Thumbnail", "Game Icon", "Render"];

  const filteredGfx = gfxItems.filter((item) => {
    return activeTab === "All" || item.category === activeTab;
  });

  const handleEditClick = (e: React.MouseEvent, gfx: GfxItem) => {
    e.stopPropagation(); // Avoid opening lightbox
    setEditingGfx(gfx);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const freshTemplate: Omit<GfxItem, "id"> = {
      title: "New Sunset GFX Render",
      category: "Render",
      resolution: "1920x1080px (HD)",
      image: "https://picsum.photos/seed/rendergfx/600/450",
      description: "A gorgeous Blender Cycles high-resolution GFX render of game avatars standing in custom scene lighting.",
      softwareUsed: ["Blender", "Photoshop"]
    };
    setIsAddingNew(true);
    setEditingGfx(freshTemplate as any);
  };

  const handleSaveGfx = (updatedData: any) => {
    if (isAddingNew) {
      addGfxItem(updatedData);
    } else {
      updateGfxItem(updatedData.id, updatedData);
    }
  };

  const handleDeleteGfx = () => {
    if (editingGfx && "id" in editingGfx) {
      deleteGfxItem(editingGfx.id);
      setLightboxIndex(null);
    }
  };

  return (
    <section id="gfx" className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 bg-rose-500 rounded-full"></span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
                {userInfo.gfxTitle || "GFX Marketing Design"}
                {editMode && (
                  <button
                    onClick={handleAddNew}
                    className="ml-4 inline-flex items-center gap-1 bg-rose-500/20 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-brand-pink transition-all px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add GFX</span>
                  </button>
                )}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl font-medium">
              {userInfo.gfxDesc || "Eye-catching graphic representations of virtual characters. Crafted with raytraced path lighting in Blender Cycles and painted in Photoshop."}
            </p>
          </div>

          {/* Tab lists */}
          <div className="flex flex-wrap gap-1.5 mt-6 md:mt-0 bg-slate-900/40 p-1 rounded-xl border border-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors outline-none cursor-pointer ${
                  activeTab === tab
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style/Flexible Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGfx.map((gfx, index) => (
            <motion.div
              key={gfx.id}
              layout
              className="group relative rounded-2xl overflow-hidden bg-slate-900/10 border border-slate-900 hover:border-slate-800 transition-all cursor-pointer shadow-lg aspect-4/3 flex items-center justify-center bg-slate-950"
              onClick={() => setLightboxIndex(index)}
              whileHover={{ y: -4 }}
            >
              {/* Graphic container */}
              <img
                src={gfx.image}
                alt={gfx.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Edit button */}
              {editMode && (
                <button
                  onClick={(e) => handleEditClick(e, gfx)}
                  className="absolute top-4 right-4 z-20 flex items-center gap-1 p-2 rounded-lg bg-teal-500 hover:bg-white text-white hover:text-teal-950 shadow-md transition-colors"
                  title="Edit GFX Spec"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold font-mono tracking-wider uppercase pr-1">EDIT</span>
                </button>
              )}

              {/* Viewport Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-5 flex flex-col justify-end">
                <span className="text-[9px] font-mono text-brand-pink uppercase tracking-widest block mb-1">
                  {gfx.category}
                </span>
                <h3 className="text-sm font-bold text-white mb-1">{gfx.title}</h3>
                <p className="text-[10px] font-mono text-slate-400">RESOLUTION: {gfx.resolution}</p>
                
                {/* Expand eye icon */}
                <span className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-slate-300 pointer-events-none">
                  <Eye className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* LIGHTBOX SLIDER MODAL */}
        <AnimatePresence>
          {lightboxIndex !== null && filteredGfx[lightboxIndex] && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxIndex(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
              />

              {/* Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative max-w-4xl w-full bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12"
              >
                {/* Dismiss button */}
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all hover:bg-slate-900 z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Left: HD render */}
                <div className="md:col-span-8 bg-slate-950 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-900 aspect-video md:aspect-auto p-6">
                  <img
                    src={filteredGfx[lightboxIndex].image}
                    alt={filteredGfx[lightboxIndex].title}
                    className="max-h-[70vh] object-contain rounded-xl shadow-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Right: Spec notes */}
                <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-brand-pink font-semibold tracking-widest block uppercase mb-1">
                      {filteredGfx[lightboxIndex].category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-100 mb-2 leading-tight">
                      {filteredGfx[lightboxIndex].title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs leading-relaxed mb-6">
                      {filteredGfx[lightboxIndex].description}
                    </p>

                    {/* Rendering spec file info */}
                    <div className="space-y-3.5 mb-6">
                      <div className="flex items-center gap-2.5">
                        <Compass className="w-4 h-4 text-brand-pink shrink-0" />
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block leading-none">Output Size</span>
                          <span className="text-xs font-semibold text-slate-300 font-mono">{filteredGfx[lightboxIndex].resolution}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Palette className="w-4 h-4 text-brand-pink shrink-0" />
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block leading-none">Software Pipelines</span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {filteredGfx[lightboxIndex].softwareUsed?.map((sw) => (
                              <span key={sw} className="text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded leading-none">
                                {sw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation instructions */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-4 border-t border-slate-900">
                    <span>INDEX: {lightboxIndex + 1} / {filteredGfx.length}</span>
                    <button 
                      onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredGfx.length)}
                      className="text-brand-pink hover:underline active:scale-95 transition-all text-xs flex items-center gap-1"
                    >
                      <span>NEXT RENDER</span>
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* Editing dialog popup */}
      <AnimatePresence>
        {editingGfx && (
          <EditItemModal
            isOpen={!!editingGfx}
            onClose={() => {
              setEditingGfx(null);
              setIsAddingNew(false);
            }}
            itemType="gfx"
            item={editingGfx}
            onSave={handleSaveGfx}
            onDelete={handleDeleteGfx}
          />
        )}
      </AnimatePresence>

    </section>
  );
}
