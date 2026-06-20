/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { X, Save, Trash2, Image as ImageIcon } from "lucide-react";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "ugc" | "model" | "game" | "gfx" | "user" | "sfx";
  item: any; // Can be UgcProduct, ModelAsset, GameProject, GfxItem, or UserInfo
  onSave: (updatedData: any) => void;
  onDelete?: () => void;
}

export default function EditItemModal({
  isOpen,
  onClose,
  itemType,
  item,
  onSave,
  onDelete
}: EditItemModalProps) {
  const [formData, setFormData] = useState<any>({ ...item });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "metrics_0_value" || name === "metrics_0_label") {
      const idx = parseInt(name.split("_")[1]);
      const field = name.split("_")[2];
      const newMetrics = [...(formData.metrics || [])];
      newMetrics[idx] = { ...newMetrics[idx], [field]: value };
      setFormData((prev: any) => ({ ...prev, metrics: newMetrics }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleArrayChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value.split(",").map((s) => s.trim()).filter(Boolean)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred overlay background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050506]/90 backdrop-blur-md cursor-pointer"
      />

      {/* Editor Main Portal Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header decoration */}
        <div className="p-6 border-b border-slate-900 flex justify-between items-center bg-slate-900/10">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-brand-pink uppercase block mb-1">
              Portfolio Content Editor
            </span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
              Edit {itemType === "user" ? "Profile Info" : `${itemType.toUpperCase()} Item`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 text-xs font-mono rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
          >
            ESC ✕
          </button>
        </div>

        {/* Scrollable form area */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* USER INFO FIELDS */}
          {itemType === "user" && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Custom Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Title Roles Overlay</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Tagline</label>
                <textarea
                  name="tagline"
                  rows={2}
                  value={formData.tagline || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Custom Avatar Image URL</label>
                <input
                  type="text"
                  name="avatar"
                  value={formData.avatar || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">About Me (Left Column)</label>
                <textarea
                  name="aboutLeft"
                  rows={3}
                  value={formData.aboutLeft || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">About Me (Right Column)</label>
                <textarea
                  name="aboutRight"
                  rows={3}
                  value={formData.aboutRight || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                />
              </div>

              {/* Metrics values list */}
              <div className="border-t border-slate-900 pt-3">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 font-bold">Metrics (Quick Stats)</span>
                <div className="grid grid-cols-2 gap-3">
                  {(formData.metrics || []).map((metric: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-905 border border-slate-900 rounded-xl space-y-2">
                      <span className="text-[10px] font-mono text-brand-pink block">Stat #{idx + 1}</span>
                      <input
                        type="text"
                        placeholder="Value (e.g. 10M+)"
                        value={metric.value}
                        onChange={(e) => {
                          const newMetrics = [...formData.metrics];
                          newMetrics[idx].value = e.target.value;
                          setFormData({ ...formData, metrics: newMetrics });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Label"
                        value={metric.label}
                        onChange={(e) => {
                          const newMetrics = [...formData.metrics];
                          newMetrics[idx].label = e.target.value;
                          setFormData({ ...formData, metrics: newMetrics });
                        }}
                        className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-white outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Header override texts */}
              <div className="border-t border-slate-900 pt-5 mt-4 space-y-4">
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Customize Section Titles &amp; Descriptions</span>
                
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono text-brand-pink block font-bold">// UGC CATALOG SECTION</span>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="ugcTitle"
                      placeholder="UGC Catalog Title"
                      value={formData.ugcTitle || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none"
                    />
                    <textarea
                      name="ugcDesc"
                      placeholder="UGC Catalog Subdescription"
                      rows={2}
                      value={formData.ugcDesc || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono text-brand-pink block font-bold">// 3D ASSETS VAULT SECTION</span>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="modelTitle"
                      placeholder="Model Vault Title"
                      value={formData.modelTitle || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none"
                    />
                    <textarea
                      name="modelDesc"
                      placeholder="Model Vault Subdescription"
                      rows={2}
                      value={formData.modelDesc || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono text-brand-pink block font-bold">// GAMEDEV SECTION</span>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="gameTitle"
                      placeholder="Gamedev Launcher Title"
                      value={formData.gameTitle || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none"
                    />
                    <textarea
                      name="gameDesc"
                      placeholder="Gamedev Launcher Subdescription"
                      rows={2}
                      value={formData.gameDesc || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono text-brand-pink block font-bold">// GFX GALLERY SECTION</span>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="gfxTitle"
                      placeholder="GFX Gallery Title"
                      value={formData.gfxTitle || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none"
                    />
                    <textarea
                      name="gfxDesc"
                      placeholder="GFX Gallery Subdescription"
                      rows={2}
                      value={formData.gfxDesc || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <span className="text-[10px] font-mono text-brand-pink block font-bold">// SFX LOUNGE SECTION</span>
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      name="sfxTitle"
                      placeholder="SFX Lounge Title"
                      value={formData.sfxTitle || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none"
                    />
                    <textarea
                      name="sfxDesc"
                      placeholder="SFX Lounge Subdescription"
                      rows={2}
                      value={formData.sfxDesc || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-white outline-none text-xs"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* UGC ITEM FIELDS */}
          {itemType === "ugc" && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Accessory Title Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Category Type</label>
                  <select
                    name="category"
                    value={formData.category || "Head"}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  >
                    <option value="Head">Head</option>
                    <option value="Face">Face</option>
                    <option value="Back">Back</option>
                    <option value="Accessory">Accessory</option>
                    <option value="Worn">Worn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Price (R$ Robux)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price ?? ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Item Image Source Link</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                    <input
                      type="text"
                      name="image"
                      value={formData.image || ""}
                      onChange={handleChange}
                      placeholder="e.g. https://picsum.photos/seed/..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50 text-[11px]"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Sales Volume</label>
                  <input
                    type="text"
                    name="salesCount"
                    value={formData.salesCount || ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Release Badge Status</label>
                  <select
                    name="status"
                    value={formData.status || "Available"}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  >
                    <option value="Available">Available</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Featured">Featured</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Catalog Buy Link URL</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Short Description</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
            </>
          )}

          {/* MODEL ASSET FIELDS */}
          {itemType === "model" && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Model Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Model Category</label>
                  <select
                    name="category"
                    value={formData.category || "Props"}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  >
                    <option value="Weapons">Weapons</option>
                    <option value="Environment">Environment</option>
                    <option value="Props">Props</option>
                    <option value="Characters">Characters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Polygon/Tris Stat</label>
                  <input
                    type="text"
                    name="polygonCount"
                    value={formData.polygonCount || ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                    placeholder="e.g. 1,180 Tris"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Custom Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  placeholder="https://picsum.photos/seed/..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Software Engines (Comma separated)</label>
                <input
                  type="text"
                  value={formData.software?.join(", ") || ""}
                  onChange={(e) => handleArrayChange("software", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  placeholder="e.g. Blender, Substance Painter"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
            </>
          )}

          {/* GAME PROJECT FIELDS */}
          {itemType === "game" && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Game Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Owner Role Title</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role || ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                    placeholder="Solo Creator / Co-Owner"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre || ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Visits Count</label>
                  <input
                    type="text"
                    name="visits"
                    value={formData.visits || ""}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Players Concurrent</label>
                  <input
                    type="text"
                    name="activePlayers"
                    value={formData.activePlayers || ""}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Player Rating</label>
                  <input
                    type="text"
                    name="rating"
                    value={formData.rating || ""}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Thumbnail Image Link</label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Roblox Play Link</label>
                <input
                  type="text"
                  name="playLink"
                  value={formData.playLink || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Summary Description</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
            </>
          )}

          {/* GFX ITEM FIELDS */}
          {itemType === "gfx" && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Portfolio Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">GFX Style Category</label>
                  <select
                    name="category"
                    value={formData.category || "Render"}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  >
                    <option value="Game Thumbnail">Game Thumbnail</option>
                    <option value="Game Icon">Game Icon</option>
                    <option value="Logo Design">Logo Design</option>
                    <option value="Render">Render</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Image Aspect Resolution</label>
                  <input
                    type="text"
                    name="resolution"
                    value={formData.resolution || ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                    placeholder="e.g. 1920x1080"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">GFX Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  placeholder="https://picsum.photos/seed/..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Software Engines (Comma separated)</label>
                <input
                  type="text"
                  value={formData.softwareUsed?.join(", ") || ""}
                  onChange={(e) => handleArrayChange("softwareUsed", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                  placeholder="e.g. Blender Cycles, Lightroom"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Description Details</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none"
                  required
                />
              </div>
            </>
          )}

          {/* SFX ITEM FIELDS */}
          {itemType === "sfx" && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Sound Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Display Category</label>
                  <select
                    name="category"
                    value={formData.category || "UI Sync"}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                  >
                    <option value="UI Sync">UI Sync</option>
                    <option value="Combat">Combat</option>
                    <option value="Magic">Magic</option>
                    <option value="Ambient">Ambient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Duration (Seconds/Desc)</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration || ""}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                    placeholder="e.g. 0.4s"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Sound Audio Type (Synthesizer Oscillator)</label>
                <select
                  value={formData.soundConfig?.[0]?.type || "sine"}
                  onChange={(e) => {
                    const soundConfig = [...(formData.soundConfig || [{ type: "sine", frequency: 440, delay: 0, duration: 0.3 }])];
                    soundConfig[0] = { ...soundConfig[0], type: e.target.value as any };
                    setFormData({ ...formData, soundConfig });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#111] border border-slate-800 text-white outline-none focus:border-brand-pink/50"
                >
                  <option value="sine">Sine Wave (Soft, Pure)</option>
                  <option value="square">Square Wave (Chiptune, Buzzing)</option>
                  <option value="sawtooth">Sawtooth Wave (Retro, High energy)</option>
                  <option value="triangle">Triangle Wave (Mellow, Flute-like)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Pitch Frequency (Hz)</label>
                  <input
                    type="number"
                    value={formData.soundConfig?.[0]?.frequency || 440}
                    onChange={(e) => {
                      const soundConfig = [...(formData.soundConfig || [{ type: "sine", frequency: 440, delay: 0, duration: 0.3 }])];
                      soundConfig[0] = { ...soundConfig[0], frequency: Number(e.target.value) };
                      setFormData({ ...formData, soundConfig });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Synthesizer Effect Mod</label>
                  <select
                    value={formData.soundConfig?.[0]?.effects || "none"}
                    onChange={(e) => {
                      const soundConfig = [...(formData.soundConfig || [{ type: "sine", frequency: 440, delay: 0, duration: 0.3 }])];
                      soundConfig[0] = { ...soundConfig[0], effects: e.target.value as any };
                      setFormData({ ...formData, soundConfig });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none text-xs"
                  >
                    <option value="none">No Effects (Clean)</option>
                    <option value="vibrato">Vibrato (Shaking)</option>
                    <option value="echo">Echo (Delay)</option>
                    <option value="phaser">Phaser (Woosh Sweep)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  value={formData.description || ""}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none"
                  required
                />
              </div>
            </>
          )}

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-900 gap-3 mt-6">
            {onDelete && itemType !== "user" ? (
              <button
                type="button"
                onClick={onDelete}
                className="px-4 py-3 rounded-xl bg-red-950/40 hover:bg-red-900 border border-red-900/60 transition-colors text-red-200 hover:text-white flex items-center gap-1.5 font-semibold text-xs font-mono"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>DELETE ITEM</span>
              </button>
            ) : (
              <div />
            )}
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors font-mono text-xs"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-pink to-brand-purple hover:brightness-110 text-white font-bold transition-all flex items-center gap-1.5 shadow-lg font-mono text-xs"
              >
                <Save className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
