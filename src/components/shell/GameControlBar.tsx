import React, { useState, useRef, useEffect } from 'react';
import { 
  Star, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ShieldCheck, 
  Heart, 
  Flame,
  CloudCheck, 
  Gamepad2, 
  X,
  Plus,
  Trash2,
  Edit3,
  Check,
  RotateCcw
} from 'lucide-react';
import { useGameReviewStore, GameControlItem } from '../../store/gameReviewStore';

interface GameControlBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRefreshGame?: () => void;
  onOpenFairness: () => void;
  className?: string;
  usesVRF?: boolean;
}

export function GameControlBar({
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onOpenFairness,
  className = '',
  usesVRF = true // This game is on-chain VRF simulated
}: GameControlBarProps) {
  const { openReviewModal, getFormattedRating, metadata, updateControls } = useGameReviewStore();
  const formattedScore = getFormattedRating();

  // Like state
  const [isLiked, setIsLiked] = useState<boolean>(() => {
    return localStorage.getItem('randseed_game_liked') === 'true';
  });
  const [likeCount, setLikeCount] = useState<number>(16240);

  // Popups state
  const [showControls, setShowControls] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  // Creator editing mode state for custom controls
  const [isEditingControls, setIsEditingControls] = useState(false);
  const [draftControls, setDraftControls] = useState<GameControlItem[]>([]);

  const controlsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const controlsList = metadata.controls || [];

  // Listen for dynamic PostMessage from inside the game iframe:
  // e.g. window.parent.postMessage({ type: 'RANDSEED_SET_CONTROLS', controls: [...] }, '*')
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event.data && event.data.type === 'RANDSEED_SET_CONTROLS' && Array.isArray(event.data.controls)) {
          updateControls(event.data.controls);
        }
      } catch (err) {
        console.error('Error receiving controls postMessage:', err);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [updateControls]);

  const handleToggleLike = () => {
    setIsLiked(prev => {
      const next = !prev;
      setLikeCount(c => next ? c + 1 : c - 1);
      localStorage.setItem('randseed_game_liked', String(next));
      return next;
    });
  };

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) {
        setShowControls(false);
        setIsEditingControls(false);
      }
      if (progressRef.current && !progressRef.current.contains(e.target as Node)) {
        setShowProgress(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatLikes = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 >= 100 ? 1 : 0)}K`;
    return num.toString();
  };

  // Creator Control Editing Handlers
  const handleStartEdit = () => {
    setDraftControls(JSON.parse(JSON.stringify(controlsList)));
    setIsEditingControls(true);
  };

  const handleSaveControls = () => {
    const valid = draftControls.filter(c => c.key.trim() || c.action.trim());
    updateControls(valid);
    setIsEditingControls(false);
  };

  const handleAddRow = () => {
    setDraftControls(prev => [...prev, { key: '', action: '' }]);
  };

  const handleDeleteRow = (index: number) => {
    setDraftControls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateRow = (index: number, field: 'key' | 'action', value: string) => {
    setDraftControls(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleApplyTemplate = (type: 'aim' | 'card' | 'wasd') => {
    if (type === 'aim') {
      setDraftControls([
        { key: 'Arrow Keys', action: 'Aim' },
        { key: 'Q / E', action: 'Adjust power' }
      ]);
    } else if (type === 'card') {
      setDraftControls([
        { key: 'Space / Enter', action: 'Deal / Hit' },
        { key: 'S', action: 'Stand' },
        { key: 'D', action: 'Double Down' },
        { key: 'P', action: 'Split Pairs' },
        { key: '← / → Arrow', action: 'Adjust Bet' }
      ]);
    } else {
      setDraftControls([
        { key: 'W / A / S / D', action: 'Move Player' },
        { key: 'Space', action: 'Jump / Action' },
        { key: 'Shift', action: 'Sprint' }
      ]);
    }
  };

  return (
    <div 
      className={`w-full bg-[#111420] border-t border-neutral-800/90 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-neutral-300 select-none relative z-30 ${className}`}
      aria-label="Game Panel"
    >
      {/* Left Section: 1. Game Name -> 2. Fair Icon -> 3. Review Rate (Category removed) */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-wrap">
        {/* 1. Game Name */}
        <span className="font-bold text-sm sm:text-base text-white tracking-wide truncate max-w-[200px] sm:max-w-[280px]">
          {metadata.name}
        </span>

        {/* 2. Fair Icon (only on games use VRF api), shown directly after the game name */}
        {usesVRF && (
          <button
            onClick={onOpenFairness}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 text-xs font-semibold cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
            title="Provably Fair (On-Chain VRF Verified) - Click to verify randomness"
            aria-label="Provably Fair"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-bold">Fair</span>
          </button>
        )}

        {/* 3. Review Rate */}
        <button
          onClick={() => openReviewModal('manual')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
          title="Rate this game & Write Review"
          aria-label="Game Rating"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-mono text-white text-xs">{formattedScore}</span>
          <span className="text-[11px] font-medium text-amber-200/90 ml-0.5">Rate</span>
        </button>
      </div>

      {/* Right Section: Action Controls in exact requested order */}
      {/* 4. Sound (icon only) -> 5. Like Icon -> 6. Progress -> 7. Game Control -> 8. Full Screen */}
      <div className="flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 shrink-0 flex-wrap">
        {/* 4. Sound (keep icon only, switch to muted icon on click) */}
        <button
          onClick={onToggleMute}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border border-neutral-800 md:border-transparent text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Volume2 className="w-4 h-4 text-neutral-200 shrink-0" />
          )}
        </button>

        {/* 5. Like / Heat Icon (Heart Icon + Count, interactive like toggle) */}
        <button
          onClick={handleToggleLike}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:py-2 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 ${
            isLiked
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
              : 'hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border-neutral-800 md:border-transparent text-neutral-300 hover:text-white'
          }`}
          title={isLiked ? "Unlike" : "Like this game"}
          aria-label="Like game"
        >
          <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-neutral-300'} shrink-0`} />
          <span className="text-xs font-bold font-mono">{formatLikes(likeCount)}</span>
        </button>

        {/* 6. Progress (attached image 2): Cloud check icon with tooltip popover */}
        <div ref={progressRef} className="relative">
          <button
            onClick={() => setShowProgress(prev => !prev)}
            onMouseEnter={() => setShowProgress(true)}
            onMouseLeave={() => setShowProgress(false)}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border border-neutral-800 md:border-transparent text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
            title="Game Save Progress"
            aria-label="Game Save Progress"
          >
            <CloudCheck className="w-4 h-4 text-neutral-200 shrink-0" />
          </button>

          {/* Progress Toast / Popover matching attached image 2 */}
          {showProgress && (
            <div className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
              <div className="bg-[#242738] border border-neutral-600/60 text-neutral-100 text-xs sm:text-[13px] px-3.5 py-2 rounded-xl shadow-2xl whitespace-nowrap flex items-center gap-2">
                <CloudCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>This game doesn't have any save yet</span>
              </div>
              {/* Pointer triangle */}
              <div className="w-2.5 h-2.5 bg-[#242738] border-r border-b border-neutral-600/60 rotate-45 mx-auto -mt-1.5" />
            </div>
          )}
        </div>

        {/* 7. Game Control (attached image 1): D-pad / Gamepad icon with Creator Custom Controls card */}
        <div ref={controlsRef} className="relative">
          <button
            onClick={() => setShowControls(prev => !prev)}
            className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0 border ${
              showControls 
                ? 'bg-neutral-800 border-neutral-700 text-amber-300' 
                : 'hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border-neutral-800 md:border-transparent text-neutral-300 hover:text-white'
            }`}
            title="Game Controls & Shortcuts"
            aria-label="Game Controls"
          >
            <Gamepad2 className="w-4 h-4 shrink-0" />
          </button>

          {/* Controls Popover Card matching attached image 1 */}
          {showControls && (
            <div className="absolute bottom-[calc(100%+12px)] right-0 sm:-right-8 w-[300px] sm:w-[340px] bg-[#1d2130] border border-neutral-700 rounded-2xl p-4 sm:p-5 shadow-2xl z-50 text-neutral-200 animate-in fade-in zoom-in-95 duration-150">
              {/* Header with Title, Creator Edit button & Close button */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-700/80">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-sm sm:text-base text-white">Controls</h4>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={isEditingControls ? () => setIsEditingControls(false) : handleStartEdit}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-neutral-700 text-[11px] text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer border border-neutral-700"
                    title={isEditingControls ? "Back to Player View" : "Creator Mode: Input/Edit Controls"}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>{isEditingControls ? 'View' : 'Creator Edit'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowControls(false);
                      setIsEditingControls(false);
                    }}
                    className="p-1 rounded-lg hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Creator Edit Mode: Game creator can directly input key bindings & actions */}
              {isEditingControls ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-medium">Quick Templates:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleApplyTemplate('aim')}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 cursor-pointer"
                        title="Aim & Power (Arrow Keys = Aim, Q/E = Power)"
                      >
                        Aim/Power
                      </button>
                      <button
                        onClick={() => handleApplyTemplate('card')}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-300 border border-neutral-700 cursor-pointer"
                        title="Blackjack Card Rules"
                      >
                        Card Game
                      </button>
                      <button
                        onClick={() => handleApplyTemplate('wasd')}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-sky-300 border border-neutral-700 cursor-pointer"
                        title="WASD Action Game"
                      >
                        WASD
                      </button>
                    </div>
                  </div>

                  {/* Editable Control Rows - No up/down scrollbar */}
                  <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {draftControls.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-neutral-900/60 p-1.5 rounded-lg border border-neutral-800">
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) => handleUpdateRow(idx, 'key', e.target.value)}
                          placeholder="Key (e.g. Arrow Keys)"
                          className="w-[45%] bg-neutral-800 text-neutral-100 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none focus:border-amber-400 font-mono"
                        />
                        <span className="text-neutral-500 text-xs">=</span>
                        <input
                          type="text"
                          value={item.action}
                          onChange={(e) => handleUpdateRow(idx, 'action', e.target.value)}
                          placeholder="Action (e.g. Aim)"
                          className="flex-1 min-w-0 bg-neutral-800 text-neutral-100 text-xs px-2 py-1 rounded border border-neutral-700 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handleDeleteRow(idx)}
                          className="p-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete binding"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleAddRow}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Row</span>
                    </button>
                    <button
                      onClick={handleSaveControls}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Controls</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Player View Mode: Renders creator-provided controls directly matching attached image 1 (no scrollbar) */
                <div className="flex flex-col gap-2.5 text-xs max-h-[320px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {controlsList.length === 0 ? (
                    <div className="py-4 text-center text-neutral-500 text-xs">
                      No custom controls configured yet.
                      <div className="mt-1">
                        <button 
                          onClick={handleStartEdit}
                          className="text-amber-400 hover:underline cursor-pointer"
                        >
                          Click here to input controls
                        </button>
                      </div>
                    </div>
                  ) : (
                    controlsList.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-neutral-300 font-medium">{item.action}</span>
                        <kbd className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-[11px] font-semibold">
                          {item.key}
                        </kbd>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Bottom pointer arrow pointing to the controller button */}
              <div className="absolute -bottom-2 right-4 sm:right-11 w-4 h-4 bg-[#1d2130] border-r border-b border-neutral-700 rotate-45 pointer-events-none" />
            </div>
          )}
        </div>

        {/* 8. Full Screen */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 sm:p-2.5 rounded-xl hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border border-neutral-800 md:border-transparent text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4 shrink-0" /> : <Maximize className="w-4 h-4 shrink-0" />}
        </button>
      </div>
    </div>
  );
}
