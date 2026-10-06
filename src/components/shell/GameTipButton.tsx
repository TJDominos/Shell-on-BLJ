import React, { useState, useRef, useEffect } from 'react';
import { Gift, X, Check, Sparkles } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useGameReviewStore } from '../../store/gameReviewStore';
import { IconBonus, IconGcoin } from './ShellSvgSymbols';
import { soundManager } from '../../lib/sounds';

export interface GameTipButtonProps {
  /**
   * Layout variant:
   * - 'control-bar': Compact button docked in GameControlBar with popover pointing upwards
   * - 'info-section': Prominent branded button in GameInfoSection with popover pointing downwards
   */
  variant?: 'control-bar' | 'info-section';
  className?: string;
}

export function GameTipButton({ 
  variant = 'control-bar', 
  className = '' 
}: GameTipButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState<'Gcoin' | 'Bonus'>('Bonus');
  const [amountStr, setAmountStr] = useState<string>('1000');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastTipAmount, setLastTipAmount] = useState<{ amount: number; currency: 'Gcoin' | 'Bonus' } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const { currentUser, updateBalance } = useGameStore();
  const { tipsCount, addTip, metadata } = useGameReviewStore();

  const userGcoin = currentUser?.balance || 0;
  const userBonus = currentUser?.bonusBalance || 0;
  const currentBalance = currency === 'Gcoin' ? userGcoin : userBonus;

  // Preset chips for each currency (Gcoin is high-value; Bonus has 4 tiers: 500, 1k, 5k, 10k)
  const presets = currency === 'Gcoin' 
    ? [1, 5, 10, 25] 
    : [500, 1000, 5000, 10000];

  // Adjust default amount when toggling currency
  const handleSelectCurrency = (newCurr: 'Gcoin' | 'Bonus') => {
    setCurrency(newCurr);
    setIsSuccess(false);
    if (newCurr === 'Gcoin') {
      setAmountStr('5');
    } else {
      setAmountStr('1000');
    }
  };

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsSuccess(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setIsSuccess(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const parsedAmount = parseInt(amountStr.replace(/,/g, '') || '0', 10);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;
  const hasSufficientBalance = currentBalance >= parsedAmount;

  const handleSendTip = () => {
    if (!isValidAmount || !hasSufficientBalance) return;

    soundManager.playChip();

    // Deduct user balance
    updateBalance(-parsedAmount, currency);

    // Record tip in game review store
    addTip(parsedAmount, currency, currentUser?.name || 'Player');

    setLastTipAmount({ amount: parsedAmount, currency });
    setIsSuccess(true);

    // Reset success banner after 3 seconds
    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button Variant 1: Compact for GameControlBar */}
      {variant === 'control-bar' && (
        <button
          onClick={() => {
            setIsOpen(prev => !prev);
            setIsSuccess(false);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
            isOpen
              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
              : 'hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border-neutral-800 md:border-transparent text-neutral-300 hover:text-white'
          }`}
          title="Tip the game creator"
          aria-label="Tip the game creator"
          aria-expanded={isOpen}
        >
          <span className="relative flex items-center justify-center">
            <Gift className={`w-4 h-4 transition-transform ${isOpen ? 'text-amber-400 scale-110' : 'text-amber-400/90'}`} />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-75" />
          </span>
          <span className="text-xs font-bold tracking-wide">Tip</span>
          {tipsCount > 0 && (
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
              {tipsCount}
            </span>
          )}
        </button>
      )}

      {/* Trigger Button Variant 2: Prominent for GameInfoSection */}
      {variant === 'info-section' && (
        <button
          onClick={() => {
            setIsOpen(prev => !prev);
            setIsSuccess(false);
          }}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
            isOpen
              ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-1 ring-amber-400/50'
              : 'bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 border-amber-500/40 text-amber-300 hover:text-amber-200'
          }`}
          title="Tip & Support the Creator"
          aria-label="Tip & Support the Creator"
          aria-expanded={isOpen}
        >
          <Gift className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span>Support Creator</span>
          {tipsCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-semibold border border-amber-500/30">
              {tipsCount} tips
            </span>
          )}
        </button>
      )}

      {/* Standalone Non-Modal Popover Panel */}
      {isOpen && (
        <div 
          className={`absolute w-[310px] sm:w-[350px] bg-[#161a26] border border-neutral-700/80 rounded-2xl p-4 shadow-2xl z-50 text-neutral-200 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md ${
            variant === 'control-bar'
              ? 'bottom-[calc(100%+12px)] right-0'
              : 'top-[calc(100%+8px)] right-0'
          }`}
          role="dialog"
          aria-label="Tip Game"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white leading-tight">Tip Game</h4>
                <p className="text-[11px] text-neutral-400">
                  Support {metadata.creator?.name || 'Creator'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close"
              aria-label="Close Tip panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Success Banner */}
          {isSuccess && lastTipAmount ? (
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <div className="p-1 rounded-full bg-emerald-500/30 text-emerald-300">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white">Tip Sent Successfully!</div>
                <div className="text-[11px] text-emerald-200/90 truncate flex items-center gap-1.5 mt-0.5">
                  <span>Sent {lastTipAmount.amount.toLocaleString()}</span>
                  {lastTipAmount.currency === 'Gcoin' ? (
                    <span className="inline-flex items-center text-amber-300 font-bold">
                      <IconGcoin className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-blue-300 font-bold">
                      <IconBonus className="w-3.5 h-3.5 text-blue-400" />
                    </span>
                  )}
                  <span>to {metadata.creator?.name}! 🎉</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Currency Tabs: Gcoin vs Bonus */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">Select Currency</div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0d1017] rounded-xl border border-neutral-800">
              {/* Gcoin Tab */}
              <button
                type="button"
                onClick={() => handleSelectCurrency('Gcoin')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'Gcoin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent'
                }`}
              >
                <IconGcoin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Gcoin</span>
              </button>

              {/* Bonus Tab */}
              <button
                type="button"
                onClick={() => handleSelectCurrency('Bonus')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currency === 'Bonus'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60 border border-transparent'
                }`}
              >
                <IconBonus className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Bonus</span>
              </button>
            </div>
          </div>

          {/* Current Balance Display */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#0d1017]/80 rounded-xl border border-neutral-800/80 mb-3 text-xs">
            <span className="text-neutral-400">Your Balance:</span>
            <div className="flex items-center gap-1.5 font-bold font-mono text-white">
              {currency === 'Gcoin' ? (
                <>
                  <IconGcoin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{userGcoin.toLocaleString()}</span>
                </>
              ) : (
                <>
                  <IconBonus className="w-3.5 h-3.5 text-blue-400" />
                  <span>{userBonus.toLocaleString()}</span>
                </>
              )}
            </div>
          </div>

          {/* Amount Presets */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">Preset Amount</div>
            <div className="grid grid-cols-4 gap-1.5">
              {presets.map((presetVal) => {
                const isSelected = parsedAmount === presetVal;
                return (
                  <button
                    key={presetVal}
                    type="button"
                    onClick={() => {
                      setAmountStr(presetVal.toString());
                      setIsSuccess(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? currency === 'Gcoin'
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md font-extrabold'
                          : 'bg-blue-500 text-white border-blue-400 shadow-md font-extrabold'
                        : 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border-neutral-700/60'
                    }`}
                  >
                    +{presetVal >= 1000 ? `${presetVal / 1000}k` : presetVal}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-1.5">
              <span>Custom Amount</span>
              <button
                type="button"
                onClick={() => {
                  setAmountStr(currentBalance.toString());
                  setIsSuccess(false);
                }}
                className="text-[10px] text-amber-400 hover:text-amber-300 uppercase font-bold cursor-pointer hover:underline"
              >
                Max
              </button>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-neutral-400 pointer-events-none">
                {currency === 'Gcoin' ? (
                  <IconGcoin className="w-4 h-4 text-amber-400" />
                ) : (
                  <IconBonus className="w-4 h-4 text-blue-400" />
                )}
              </div>
              <input
                type="text"
                value={amountStr}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^\d]/g, '');
                  setAmountStr(cleaned);
                  setIsSuccess(false);
                }}
                placeholder="0"
                className="w-full bg-[#0d1017] border border-neutral-700 rounded-xl pl-9 pr-3.5 py-2 text-white font-mono text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            {/* Insufficient balance message */}
            {!hasSufficientBalance && isValidAmount && (
              <p className="mt-1.5 text-[11px] text-rose-400">
                Insufficient {currency} balance (have {currentBalance.toLocaleString()})
              </p>
            )}
          </div>

          {/* Action Button: Plain Send Tip without bracketed amount */}
          <button
            type="button"
            disabled={!isValidAmount || !hasSufficientBalance}
            onClick={handleSendTip}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-lg ${
              !isValidAmount || !hasSufficientBalance
                ? 'bg-neutral-800 text-neutral-500 border border-neutral-700/60 cursor-not-allowed'
                : currency === 'Gcoin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold shadow-amber-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold shadow-blue-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Send Tip</span>
          </button>

          {/* Pointer triangle arrow */}
          {variant === 'control-bar' ? (
            <div className="absolute -bottom-2 right-4 sm:right-6 w-4 h-4 bg-[#161a26] border-r border-b border-neutral-700/80 rotate-45 pointer-events-none" />
          ) : (
            <div className="absolute -top-2 right-6 sm:right-12 w-4 h-4 bg-[#161a26] border-l border-t border-neutral-700/80 rotate-45 pointer-events-none" />
          )}
        </div>
      )}
    </div>
  );
}
