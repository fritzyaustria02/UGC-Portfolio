/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, HelpCircle, Shield, RotateCw, ExternalLink, ArrowRight, Grid, MonitorPlay, Edit, Plus } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { ModelAsset } from "../data";
import EditItemModal from "./EditItemModal";

export default function ModelVault() {
  const { 
    modelAssets, 
    updateModelAsset, 
    addModelAsset, 
    deleteModelAsset, 
    editMode,
    userInfo
  } = usePortfolio();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingAsset, setEditingAsset] = useState<ModelAsset | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const categories = ["All", "Weapons", "Environment", "Props", "Characters"];

  const filteredAssets = modelAssets.filter((asset) => {
    return activeCategory === "All" || asset.category === activeCategory;
  });

  const handleEditClick = (e: React.MouseEvent, asset: ModelAsset) => {
    e.stopPropagation();
    setEditingAsset(asset);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const freshTemplate: Omit<ModelAsset, "id"> = {
      name: "New Custom Model Blueprint",
      category: "Props",
      polygonCount: "1,200 Tris",
      software: ["Blender"],
      description: "A highly optimized, clean topology prop perfect for immersive gameplay scenes.",
      image: "https://picsum.photos/seed/renderprop/400/400",
      interactiveDetails: {
        textures: "1K Handpainted",
        rigged: false,
        animated: false
      }
    };
    setIsAddingNew(true);
    setEditingAsset(freshTemplate as any);
  };

  const handleSaveAsset = (updatedData: any) => {
    if (isAddingNew) {
      addModelAsset(updatedData);
    } else {
      updateModelAsset(updatedData.id, updatedData);
    }
  };

  const handleDeleteAsset = () => {
    if (editingAsset && "id" in editingAsset) {
      deleteModelAsset(editingAsset.id);
    }
  };

  return (
    <section id="models" className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full"></span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
                {userInfo.modelTitle || "3D Production Vault"}
                {editMode && (
                  <button
                    onClick={handleAddNew}
                    className="ml-4 inline-flex items-center gap-1 px-3 py-1.5 bg-brand-purple/20 hover:bg-brand-purple border border-brand-purple/30 hover:border-brand-purple text-brand-purple hover:text-white transition-all rounded-lg text-xs font-mono font-bold uppercase"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Model</span>
                  </button>
                )}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl font-medium">
              {userInfo.modelDesc || "Showcase of low-poly character attachments, environment props, and assets custom modeled, UV unwrapped, and handpainted or baked in Substance."}
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 mt-6 md:mt-0 bg-slate-900/40 p-1 rounded-xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors outline-none cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredAssets.map((asset) => (
            <motion.div
              key={asset.id}
              layout
              className="group relative bg-slate-900/25 border border-slate-900 rounded-2xl overflow-hidden hover:border-slate-800/85 hover:bg-slate-900/40 transition-all duration-300 flex flex-col sm:flex-row"
              whileHover={{ y: -3 }}
            >
              {/* Left: Viewport Asset Image */}
              <div className="relative w-full sm:w-48 md:w-56 aspect-square sm:aspect-auto overflow-hidden bg-slate-950 shrink-0 border-r-0 sm:border-r border-slate-900 flex items-center justify-center">
                {/* Simulated Wireframe Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <img
                  src={asset.image}
                  alt={asset.name}
                  className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg"
                  referrerPolicy="no-referrer"
                />

                {/* Software tags */}
                <div className="absolute bottom-3 left-3 flex gap-1 pointer-events-none">
                  {asset.software.map((sw) => (
                    <span key={sw} className="text-[9px] font-mono font-medium rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 px-1.5 py-0.5 leading-none">
                      {sw}
                    </span>
                  ))}
                </div>

                {/* Viewport label */}
                <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-1 bg-brand-purple/10 text-brand-purple rounded px-1.5 py-0.5 text-[8px] font-mono leading-none font-bold uppercase tracking-widest border border-brand-purple/15">
                  <Grid className="w-2.5 h-2.5" /> Wire-O
                </div>
              </div>

              {/* Edit overlay */}
              {editMode && (
                <button
                  onClick={(e) => handleEditClick(e, asset)}
                  className="absolute top-4 right-4 z-20 flex items-center gap-1 p-2 rounded-lg bg-teal-500 hover:bg-white text-white hover:text-teal-950 shadow-md transition-colors"
                  title="Edit Asset Details"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold font-mono tracking-wider uppercase pr-1">EDIT</span>
                </button>
              )}

              {/* Right: Asset Copy */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                      {asset.category}
                    </span>
                    <span className="text-[10px] font-mono text-rose-300 bg-rose-950/20 px-2 py-0.5 rounded leading-none border border-rose-900/10">
                      {asset.polygonCount?.split(" ")[0] || "1K"} TRIS
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-colors">
                    {asset.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {asset.description}
                  </p>
                </div>

                {/* Asset Tech Properties */}
                <div className="pt-4 border-t border-slate-950 mt-auto">
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center select-none">
                    <div className="p-1 px-1.5 rounded bg-slate-950 border border-slate-804 flex flex-col justify-center">
                      <span className="text-slate-500 text-[8px] uppercase tracking-wider block mb-0.5">Textures</span>
                      <span className="text-slate-300 text-[9px] font-bold">
                        {asset.interactiveDetails?.textures.split(" ")[0] || "1K HandP"}
                      </span>
                    </div>
                    <div className="p-1 px-1.5 rounded bg-slate-950 border border-slate-804 flex flex-col justify-center">
                      <span className="text-slate-500 text-[8px] uppercase tracking-wider block mb-0.5">Rigged</span>
                      <span className={`text-[9px] font-bold ${asset.interactiveDetails?.rigged ? "text-emerald-400" : "text-slate-600"}`}>
                        {asset.interactiveDetails?.rigged ? "YES" : "NO"}
                      </span>
                    </div>
                    <div className="p-1 px-1.5 rounded bg-slate-950 border border-slate-804 flex flex-col justify-center">
                      <span className="text-slate-500 text-[8px] uppercase tracking-wider block mb-0.5">Animated</span>
                      <span className={`text-[9px] font-bold ${asset.interactiveDetails?.animated ? "text-emerald-400" : "text-slate-600"}`}>
                        {asset.interactiveDetails?.animated ? "YES" : "NO"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Tip / Info Box to increase design density and details */}
        <div className="mt-12 p-5 rounded-2xl bg-gradient-to-r from-slate-900/20 via-indigo-950/10 to-transparent border border-slate-900 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-950/50 border border-indigo-900 shrink-0 text-brand-purple">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">Mesh Optimizations & Fitting Standards</h4>
            <p className="text-slate-400 text-xs leading-relaxed mt-1 max-w-4xl">
              All manufactured meshes conform precisely to Roblox Avatar Fitting Standards. Poly meshes maintain airtight manifolds, watertight hulls, perfect weighting configurations, and unified Atlased texture maps to avoid multiple render drawcalls.
            </p>
          </div>
        </div>

      </div>

      {/* Editing Dialog */}
      <AnimatePresence>
        {editingAsset && (
          <EditItemModal
            isOpen={!!editingAsset}
            onClose={() => {
              setEditingAsset(null);
              setIsAddingNew(false);
            }}
            itemType="model"
            item={editingAsset}
            onSave={handleSaveAsset}
            onDelete={handleDeleteAsset}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
