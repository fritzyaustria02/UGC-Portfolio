/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, ShoppingBag, X, ExternalLink, Sparkles, AlertCircle, ShoppingCart, Edit, Plus, Trash2 } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { UgcProduct } from "../data";
import EditItemModal from "./EditItemModal";

// Roblox-style custom Robux Icon
const RobuxIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <span className={`${className} bg-[#3fda8a]/10 text-[#3fda8a] rounded px-1.5 py-0.5 font-bold font-mono text-[10px] uppercase tracking-wider inline-flex items-center`}>
    R$
  </span>
);

export default function UgcCatalog() {
  const { 
    ugcProducts, 
    updateUgcProduct, 
    addUgcProduct, 
    deleteUgcProduct, 
    editMode,
    userInfo
  } = usePortfolio();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItem, setActiveItem] = useState<UgcProduct | null>(null);

  // Editing state
  const [editingItem, setEditingItem] = useState<UgcProduct | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const categories = ["All", "Head", "Face", "Back", "Accessory"];

  const filteredProducts = ugcProducts.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEditClick = (e: React.MouseEvent, product: UgcProduct) => {
    e.stopPropagation(); // Avoid opening the inspect drawer
    setEditingItem(product);
  };

  const handleAddNew = () => {
    const freshTemplate: Omit<UgcProduct, "id"> = {
      name: "New Accessory Blueprint",
      description: "An incredibly optimized design styled in the signature Goth-Panda colors.",
      category: "Head",
      price: 100,
      image: "https://picsum.photos/seed/gothnew/300/300",
      status: "Available",
      link: "https://www.roblox.com/catalog",
      salesCount: "0"
    };
    setIsAddingNew(true);
    setEditingItem(freshTemplate as any);
  };

  const handleSaveItem = (updatedData: any) => {
    if (isAddingNew) {
      addUgcProduct(updatedData);
    } else {
      updateUgcProduct(updatedData.id, updatedData);
    }
    // Sync the expanded inspect modal if active
    if (activeItem && activeItem.id === updatedData.id) {
      setActiveItem(updatedData);
    }
  };

  const handleDeleteItem = () => {
    if (editingItem && "id" in editingItem) {
      deleteUgcProduct(editingItem.id);
      if (activeItem?.id === editingItem.id) {
        setActiveItem(null);
      }
    }
  };

  return (
    <section id="ugc" className="py-20 border-t border-slate-900 bg-gradient-to-b from-slate-950/20 to-[#050506]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 bg-brand-pink rounded-full"></span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
                {userInfo.ugcTitle || "UGC Creator Shop"}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl font-medium">
              {userInfo.ugcDesc || "Browsing virtual Roblox catalog items manufactured, skinned, and distributed by Ayumi. Tap any item to inspect its polygons and details."}
            </p>
          </div>
          
          {/* Quick Counter */}
          <div className="mt-4 md:mt-0 font-mono text-xs text-slate-500 py-1.5 px-3.5 rounded-lg border border-slate-800 bg-slate-900/10 flex items-center gap-4">
            {editMode && (
              <button
                onClick={handleAddNew}
                className="flex items-center gap-1.5 text-xs text-brand-pink font-semibold uppercase hover:brightness-110 tracking-widest font-mono"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            )}
            <span>
              SHOWING <span className="text-brand-pink font-semibold">{filteredProducts.length}</span> OF <span className="text-white">{ugcProducts.length}</span> ITEMS
            </span>
          </div>
        </div>

        {/* Toolbar: Category Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
          {/* Filters */}
          <div className="md:col-span-8 flex flex-wrap gap-2 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium font-mono transition-all duration-200 outline-none ${
                  selectedCategory === cat
                    ? "bg-brand-pink text-white shadow-lg shadow-brand-pink/15"
                    : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {cat.toUpperCase()} {cat !== "All" && `(${ugcProducts.filter(p => p.category === cat).length})`}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="md:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search catalog catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-brand-pink/50 transition-colors"
            />
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-300">No accessories found</h3>
            <p className="text-slate-500 text-xs mt-1">Try refining your category search filters.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layoutId={`ugc-card-${product.id}`}
                  className="group relative rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 p-5 transition-all duration-300 cursor-pointer shadow-lg overflow-hidden flex flex-col justify-between"
                  onClick={() => setActiveItem(product)}
                  whileHover={{ y: -4 }}
                >
                  {/* Subtle Sparkle Overlays for Featured Items */}
                  {product.status === "Featured" && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                  )}

                  {/* Edit Pencil Overlay Badge */}
                  {editMode && (
                    <button
                      onClick={(e) => handleEditClick(e, product)}
                      className="absolute top-4 right-4 z-20 flex items-center gap-1 p-2 rounded-lg bg-teal-500 hover:bg-white text-white hover:text-teal-950 shadow-md transition-colors"
                      title="Edit Item Details"
                    >
                      <Edit className="w-3.5 h-3.5 animate-pulse" />
                      <span className="text-[9px] font-bold font-mono tracking-wider uppercase pr-1">EDIT</span>
                    </button>
                  )}

                  <div>
                    {/* Item Image Box */}
                    <div className="relative aspect-square w-full rounded-xl bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-[85%] h-[85%] object-contain group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Interactive Badge */}
                      <div className="absolute top-3 inset-x-3 flex justify-between items-center pointer-events-none">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-widest font-semibold uppercase ${
                          product.status === "Featured" ? "bg-rose-500/20 text-rose-300 border border-rose-500/20" :
                          product.status === "Limited Edition" ? "bg-amber-500/20 text-amber-300 border border-amber-500/20" :
                          product.status === "Upcoming" ? "bg-purple-500/20 text-purple-300 border border-purple-500/20" :
                          "bg-slate-800 text-slate-300"
                        }`}>
                          {product.status}
                        </span>
                        
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 mt-0.5">
                        <RobuxIcon />
                        <span className="text-sm font-bold text-slate-200 font-mono">{product.price}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions / Stats Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-950 text-[11px] font-mono mt-auto">
                    <span className="text-slate-500">
                      SALES: <span className="text-slate-300 font-medium">{product.salesCount}</span>
                    </span>
                    <button className="text-brand-pink font-semibold group-hover:underline flex items-center gap-1 transition-all">
                      <span>INSPECT</span>
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Selected UGC Inspector Modal / Drawer */}
        <AnimatePresence>
          {activeItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backing Blurry Shield */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveItem(null)}
                className="absolute inset-0 bg-[#050506] bg-opacity-70 backdrop-blur-md cursor-pointer"
              />

              {/* Holographic Portal Card */}
              <motion.div
                layoutId={`ugc-card-${activeItem.id}`}
                className="relative bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl z-10"
              >
                {/* Dismiss Button */}
                <button
                  onClick={() => setActiveItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
                  {/* Photo Space */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="aspect-square w-full rounded-2xl bg-slate-900/40 border border-slate-900/60 p-6 flex items-center justify-center relative select-none">
                      <img
                        src={activeItem.image}
                        alt={activeItem.name}
                        className="w-[90%] h-[90%] object-contain animate-float"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#3fda8a]/10 text-[#3fda8a] text-[9px] font-mono leading-none tracking-widest uppercase border border-[#3fda8a]/20">
                        <ShoppingCart className="w-3 h-3" /> Fully Fit Tested
                      </span>
                    </div>
                  </div>

                  {/* Specification Space */}
                  <div className="flex flex-col justify-between">
                    <div>
                      {/* Breadcrumbs */}
                      <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-slate-500 uppercase">
                        <span>ROBLOX SHOP</span>
                        <span>/</span>
                        <span className="text-brand-pink">{activeItem.category}</span>
                      </div>

                      {/* Header Title */}
                      <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                        {activeItem.name}
                      </h3>

                      {/* Accent Status Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 font-mono border border-slate-800">
                          {activeItem.category.toUpperCase()} ITEM
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#3fda8a]/10 text-[#3fda8a] font-mono border border-[#3fda8a]/10">
                          SALES: {activeItem.salesCount}
                        </span>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed mb-6">
                        {activeItem.description}
                      </p>

                      {/* Poly counts & Optimization metrics */}
                      <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-900/80 mb-6 font-mono text-xs">
                        <div className="flex justify-between items-center mb-1.5 py-1 border-b border-slate-950/40">
                          <span className="text-slate-500 font-medium">POLYGONS:</span>
                          <span className="text-slate-200 font-bold">1,180 Tris</span>
                        </div>
                        <div className="flex justify-between items-center mb-1.5 py-1 border-b border-slate-950/40">
                          <span className="text-slate-500 font-medium">TEXTURE MAPS:</span>
                          <span className="text-slate-200">1 (512x512 Atlased)</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500 font-medium">CATALOG ID:</span>
                          <span className="text-slate-300 font-bold">#9281048{activeItem.id.slice(-2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing panel */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-850">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Catalog Value</span>
                        <div className="flex items-center gap-1.5">
                          <RobuxIcon className="w-5 h-5 px-2 text-xs" />
                          <span className="text-xl font-extrabold text-white font-mono">{activeItem.price}</span>
                        </div>
                      </div>

                      <a
                        href={activeItem.link}
                        target="_blank"
                        rel="noreferrer"
                        referrerPolicy="no-referrer"
                        className="px-5 py-3 rounded-xl bg-brand-pink hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-brand-pink/20 shrink-0"
                      >
                        <span>Buy on Catalog</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Global Catalog Items editor modal popup handler */}
        <AnimatePresence>
          {editingItem && (
            <EditItemModal
              isOpen={!!editingItem}
              onClose={() => {
                setEditingItem(null);
                setIsAddingNew(false);
              }}
              itemType="ugc"
              item={editingItem}
              onSave={handleSaveItem}
              onDelete={handleDeleteItem}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
