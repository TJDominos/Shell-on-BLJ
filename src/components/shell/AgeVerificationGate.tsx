import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../lib/sounds';

interface AgeVerificationGateProps {
  ageRating?: string;
  gameId?: string;
  onConfirm?: () => void;
  onExit: () => void;
  className?: string;
}

export function AgeVerificationGate({
  ageRating = '18+',
  gameId = 'blackjack_vip',
  onConfirm,
  onExit,
  className = ''
}: AgeVerificationGateProps) {
  const normalizedRating = (ageRating || '').toUpperCase();
  const isNsfw = normalizedRating.includes('NSFW');
  const is18Plus = normalizedRating.includes('18+') || normalizedRating.includes('MATURE');

  // If the game does not require 18+ or NSFW verification, do not block
  const requiresGate = isNsfw || is18Plus;

  const storageKey = isNsfw 
    ? `randseed_gate_confirmed_nsfw_${gameId}` 
    : `randseed_gate_confirmed_18_${gameId}`;

  const [isConfirmed, setIsConfirmed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  });

  // NSFW one-time combined consent agreement
  const [nsfwAgreed, setNsfwAgreed] = useState<boolean>(true);

  // Sync if age rating or gameId changes
  useEffect(() => {
    try {
      const confirmed = localStorage.getItem(storageKey) === 'true';
      setIsConfirmed(confirmed);
      if (confirmed && onConfirm) {
        onConfirm();
      }
    } catch {
      setIsConfirmed(false);
    }
  }, [storageKey, onConfirm]);

  if (!requiresGate || isConfirmed) {
    return null;
  }

  const handleConfirm = () => {
    soundManager.playClick();
    try {
      localStorage.setItem(storageKey, 'true');
    } catch (e) {
      console.error(e);
    }
    setIsConfirmed(true);
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
        className={`absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label="Age Verification Gate"
      >
        {/* Compact Modal Card (Max Width ~360px) */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 5 }}
          transition={{ duration: 0.18 }}
          className="w-full max-w-[360px] bg-[#141722] border border-neutral-700/80 rounded-2xl p-5 shadow-2xl text-neutral-100 flex flex-col space-y-4"
        >
          {/* Header Title */}
          <div className="text-center pt-1">
            <h3 className="text-lg font-bold text-white tracking-wide">
              {isNsfw ? 'Content & Age Advisory' : '18+ Age Verification'}
            </h3>
          </div>

          {/* Context Advisory Box */}
          {isNsfw ? (
            /* NSFW Mode: Age & Risk Advisory (One-Time Confirmation) */
            <div className="space-y-3">
              <div className="p-3.5 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2 text-neutral-200">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B6BC9] mt-2 shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">
                    <strong className="text-white">Mature Content:</strong> Contains adult themes, mature storylines, or sensitive imagery.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B6BC9] mt-2 shrink-0" />
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    <strong className="text-white">Risk Advisory:</strong> Viewer discretion and voluntary participation advised.
                  </p>
                </div>
              </div>

              {/* One-time combined consent agreement */}
              <label 
                onClick={() => setNsfwAgreed(!nsfwAgreed)}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors text-left"
              >
                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                  nsfwAgreed ? 'bg-[#5F40A1] text-white font-bold' : 'border border-neutral-600 bg-neutral-800'
                }`}>
                  {nsfwAgreed && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-[11px] text-neutral-300 leading-snug select-none">
                  I am 18+, acknowledge the mature content and simulated risks.
                </span>
              </label>
            </div>
          ) : (
            /* 18+ Standard Mode: Enlarged prompt text */
            <div className="space-y-2.5">
              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl">
                <p className="text-sm sm:text-base font-semibold text-neutral-100 text-center leading-relaxed">
                  This game contains mature content intended for players aged 18 and older.
                </p>
              </div>

              {/* Please confirm note positioned right above buttons with 4px margin */}
              <p className="text-xs text-neutral-400 text-center leading-snug mb-1">
                Please confirm that you are at least 18 years of age or the legal age of majority in your jurisdiction to play.
              </p>
            </div>
          )}

          {/* Action Buttons: Formatted according to RS Design System (.btn .btn--solid & .btn--outline, pill radius) */}
          <div className="space-y-2 pt-0">
            {/* Primary Solid Button: RS High-Contrast Solid (White on Dark Surface) */}
            <button
              type="button"
              disabled={isNsfw && !nsfwAgreed}
              onClick={handleConfirm}
              className={`w-full min-h-[40px] px-5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 shadow-sm ${
                isNsfw && !nsfwAgreed
                  ? 'bg-neutral-800 text-neutral-500 border border-neutral-700/60 cursor-not-allowed shadow-none'
                  : 'bg-white hover:bg-neutral-100 text-[#000000] active:bg-neutral-200 shadow-neutral-900/40'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{isNsfw ? 'Confirm & Enter Game' : 'I Am 18 or Older · Enter'}</span>
            </button>

            {/* Secondary Outline Button: RS Outline (.btn--outline, pill radius) */}
            <button
              type="button"
              onClick={onExit}
              className="w-full min-h-[38px] px-5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white bg-transparent border border-neutral-700 hover:bg-neutral-800/80 hover:border-neutral-600 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Under 18 · Exit to Lobby</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
