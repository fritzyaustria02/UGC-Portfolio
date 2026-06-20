/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Play, VolumeX, Radio, Music, Award, HelpCircle, Sparkles, Edit, Plus } from "lucide-react";
import { usePortfolio } from "../context/PortfolioContext";
import { SfxSample } from "../data";
import EditItemModal from "./EditItemModal";

export default function SfxLounge() {
  const { 
    sfxSamples, 
    updateSfxSample, 
    addSfxSample, 
    deleteSfxSample, 
    editMode, 
    userInfo 
  } = usePortfolio();
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [pitchFactor, setPitchFactor] = useState<number>(1.0); // Allow pitch modulating slider
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Editing state
  const [editingSfx, setEditingSfx] = useState<SfxSample | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleEditClick = (e: React.MouseEvent, sfx: SfxSample) => {
    e.stopPropagation(); // Avoid playing sound
    setEditingSfx(sfx);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    const freshTemplate: Omit<SfxSample, "id"> = {
      title: "New Magic Laser Spark",
      duration: "0.5s",
      category: "Magic",
      description: "A futuristic charge and pulse laser shot designed with retro synthesize waveforms.",
      soundConfig: [
        { type: "sine", frequency: 580, delay: 0, duration: 0.4 }
      ]
    };
    setIsAddingNew(true);
    setEditingSfx(freshTemplate as any);
  };

  const handleSaveSfx = (updatedData: any) => {
    if (isAddingNew) {
      addSfxSample(updatedData);
    } else {
      updateSfxSample(updatedData.id, updatedData);
    }
  };

  const handleDeleteSfx = () => {
    if (editingSfx && "id" in editingSfx) {
      deleteSfxSample(editingSfx.id);
    }
  };

  const playSynthesizedSfx = (sample: SfxSample) => {
    // Stop any physical playing audio logs/timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) {
      alert("Web Audio API not supported in this frame context.");
      return;
    }

    try {
      const ctx = new AudioCtx();
      setPlayingId(sample.id);

      // Iterate over the custom sound oscillators and delay thresholds
      sample.soundConfig.forEach((cfg) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Apply pitch modifier
        const freqMod = cfg.frequency * pitchFactor;

        osc.type = cfg.type;
        osc.frequency.setValueAtTime(freqMod, ctx.currentTime + cfg.delay);

        // Simple ADSR Envelope
        gain.gain.setValueAtTime(0.001, ctx.currentTime + cfg.delay);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + cfg.delay + 0.05); // quick attack
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + cfg.delay + cfg.duration); // exponential decay

        // Hook up synthesis node path
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + cfg.delay);
        osc.stop(ctx.currentTime + cfg.delay + cfg.duration);
      });

      // Track completion to lower animation flag
      const maxDuration = Math.max(...sample.soundConfig.map(c => c.delay + c.duration));
      
      const tm = setTimeout(() => {
        setPlayingId(null);
        ctx.close();
      }, maxDuration * 1000 + 100);
      
      timeoutsRef.current.push(tm);

    } catch (e) {
      console.error("Audio Context failed to initialize: ", e);
      setPlayingId(null);
    }
  };

  return (
    <section id="sfx" className="py-20 border-t border-slate-900 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 bg-brand-pink rounded-full"></span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
                {userInfo.sfxTitle || "SFX Soundboard Studio"}
                {editMode && (
                  <button
                    onClick={handleAddNew}
                    className="ml-4 inline-flex items-center gap-1 bg-brand-pink/20 hover:bg-brand-pink hover:text-white border border-brand-pink/30 text-brand-pink transition-all px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Sound</span>
                  </button>
                )}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl">
              {userInfo.sfxDesc || "Live interactive sound module. Trigger real-time, custom synthesized gameplay soundscapes. No third-party player plugins required!"}
            </p>
          </div>

          {/* Real-time Pitch Pitch modulation controller */}
          <div className="mt-6 md:mt-0 p-4 rounded-2xl bg-slate-900/40 border border-slate-900/80 backdrop-blur-md max-w-xs w-full flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1 bg-slate-950/25 px-1 rounded">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none font-semibold">Pitch Modulator</span>
              <span className="text-[10px] font-mono text-brand-pink font-bold">x{pitchFactor.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="2.0"
              step="0.1"
              value={pitchFactor}
              onChange={(e) => setPitchFactor(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-brand-pink focus:outline-none"
            />
            <div className="flex justify-between text-[8px] font-mono text-slate-600 mt-1 uppercase">
              <span>Low Dark Pitch</span>
              <span>High Chibi Pitch</span>
            </div>
          </div>
        </div>

        {/* SFX sound cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sfxSamples.map((sample) => {
            const isCurrentPlaying = playingId === sample.id;

            return (
              <div
                key={sample.id}
                className={`relative rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer bg-slate-950/30 ${
                  isCurrentPlaying
                    ? "border-brand-pink/50 bg-slate-900/30 shadow-lg shadow-brand-pink/5"
                    : "border-slate-900 hover:border-slate-800 hover:bg-slate-900/10"
                }`}
                onClick={() => playSynthesizedSfx(sample)}
              >
                {/* Embedded Glowing equalizer lines, animating only when actively playing */}
                {isCurrentPlaying && (
                  <div className="absolute inset-0 bg-brand-pink/[0.02] flex items-end justify-center gap-1 pointer-events-none pb-4">
                    <span className="w-1.5 h-10 bg-brand-pink/15 rounded-t animate-[float_1.5s_infinite_ease-in-out]" />
                    <span className="w-1.5 h-16 bg-brand-pink/20 rounded-t animate-[float_1.2s_infinite_ease-in-out_delay-100]" />
                    <span className="w-1.5 h-8 bg-brand-pink/15 rounded-t animate-[float_1.8s_infinite_ease-in-out_delay-200]" />
                  </div>
                )}

                <div>
                  {/* Card Title Box */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-850">
                      {sample.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {editMode && (
                        <button
                          onClick={(e) => handleEditClick(e, sample)}
                          className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
                          title="Edit Sound Metadata"
                        >
                          <Edit className="w-3 h-3 text-brand-pink" />
                        </button>
                      )}
                      <span className="text-[10px] font-mono text-slate-500">{sample.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mb-2 leading-tight">
                    {sample.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {sample.description}
                  </p>
                </div>

                {/* Bottom section with simulated visual wave and play trigger */}
                <div className="flex items-center justify-between border-t border-slate-950/80 pt-4 mt-auto">
                  <div className="flex items-center gap-1">
                    <Volume2 className={`w-4 h-4 ${isCurrentPlaying ? "text-brand-pink animate-bounce" : "text-slate-500"}`} />
                    <span className="text-[10px] font-mono text-slate-500">
                      {isCurrentPlaying ? "PLAYING..." : "READY TO RUN"}
                    </span>
                  </div>

                  {/* Play circle trigger button */}
                  <button className={`p-2.5 rounded-full transition-all flex items-center justify-center border ${
                    isCurrentPlaying
                      ? "bg-brand-pink border-brand-pink text-white animate-pulse"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
                  }`}>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Audio Systems checklist */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/10 border border-slate-900 flex flex-col md:flex-row md:items-center gap-6 justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-pink/10 border border-brand-pink/25 rounded-xl text-brand-pink shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">Sound Pipeline Specifications</h4>
              <p className="text-slate-400 text-xs leading-relaxed mt-1 max-w-3xl">
                I capture, record, edit, and master 100% custom non-copyrighted gameplay triggers. Audits ensure fully standardized 44.1kHz WAV layouts, formatted specifically to avoid hardware lag during Roblox Client engine loading sequences.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 font-mono text-[10px] shrink-0 border-t md:border-t-0 border-slate-900 pt-4 md:pt-0">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#3fda8a]/15 text-[#3fda8a] leading-none">
              ✔ 44.1Khz Stereo
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#3fda8a]/15 text-[#3fda8a] leading-none">
              ✔ Zero Latency
            </span>
          </div>
        </div>

      </div>

      {/* Editing dialog */}
      <AnimatePresence>
        {editingSfx && (
          <EditItemModal
            isOpen={editingSfx !== null}
            onClose={() => setEditingSfx(null)}
            itemType="sfx"
            item={editingSfx}
            onSave={(updatedData) => {
              handleSaveSfx(updatedData);
              setEditingSfx(null);
            }}
            onDelete={() => {
              handleDeleteSfx();
              setEditingSfx(null);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
