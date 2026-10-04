import React from 'react';
import { 
  Star, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  ShieldCheck, 
  Home
} from 'lucide-react';
import { useGameReviewStore } from '../../store/gameReviewStore';

interface GameControlBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onRefreshGame: () => void;
  onExitGame: () => void;
  onOpenFairness: () => void;
  className?: string;
}

export function GameControlBar({
  isMuted,
  onToggleMute,
  isFullscreen,
  onToggleFullscreen,
  onRefreshGame,
  onExitGame,
  onOpenFairness,
  className = ''
}: GameControlBarProps) {
  const { openReviewModal, getFormattedRating, metadata } = useGameReviewStore();
  const formattedScore = getFormattedRating();

  return (
    <div 
      className={`w-full bg-[#111420] border-t border-neutral-800 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4 text-neutral-300 select-none ${className}`}
      aria-label="Game Toolbar"
    >
      {/* Line 1 (Mobile Row 1 / Desktop Left): Game Title, Badge & Rating Score */}
      <div className="w-full md:w-auto flex items-center justify-between gap-3 min-w-0 pb-2 md:pb-0 border-b border-neutral-800/80 md:border-b-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[150px] sm:max-w-[200px]">
            {metadata.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold shrink-0">
            VIP
          </span>
          <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 font-medium shrink-0">
            {metadata.category}
          </span>
        </div>

        {/* Rating Score Badge & Rate Button */}
        <button
          onClick={() => openReviewModal('manual')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
          title="Rate this game & Write Review"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-mono">{formattedScore}</span>
          <span className="text-[11px] font-medium text-amber-200/80 ml-0.5">Rate</span>
        </button>
      </div>

      {/* Line 2 (Mobile Row 2 / Desktop Right): In-Game Action Controls */}
      <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-1.5 sm:gap-2 shrink-0">
        {/* Provably Fair */}
        <button
          onClick={onOpenFairness}
          className="flex-1 md:flex-initial flex items-center justify-center gap-1 px-2.5 py-2 md:py-1.5 rounded-xl hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border border-neutral-800 md:border-transparent text-emerald-400 hover:text-emerald-300 transition-colors text-xs active:scale-95"
          title="Provably Fair VRF Verification"
          aria-label="Provably Fair"
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="text-[11px] font-medium">Fair</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleMute}
          className="flex-1 md:flex-initial flex items-center justify-center gap-1 px-2.5 py-2 md:py-1.5 rounded-xl hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border border-neutral-800 md:border-transparent text-neutral-300 hover:text-white transition-colors text-xs active:scale-95"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
          aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400 shrink-0" /> : <Volume2 className="w-4 h-4 text-neutral-200 shrink-0" />}
          <span className="text-[11px] font-medium">{isMuted ? 'Muted' : 'Sound'}</span>
        </button>

        {/* Reload / Refresh Game */}
        <button
          onClick={onRefreshGame}
          className="flex-1 md:flex-initial flex items-center justify-center gap-1 px-2.5 py-2 md:py-1.5 rounded-xl hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border border-neutral-800 md:border-transparent text-neutral-300 hover:text-white transition-colors text-xs active:scale-95"
          title="Restart Game Instance"
          aria-label="Restart Game"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span className="text-[11px] font-medium">Reload</span>
        </button>

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          className="flex-1 md:flex-initial flex items-center justify-center gap-1 px-2.5 py-2 md:py-1.5 rounded-xl hover:bg-neutral-800 bg-neutral-900/60 md:bg-transparent border border-neutral-800 md:border-transparent text-neutral-300 hover:text-white transition-colors text-xs active:scale-95"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4 shrink-0" /> : <Maximize className="w-4 h-4 shrink-0" />}
          <span className="text-[11px] font-medium">{isFullscreen ? 'Exit' : 'Full'}</span>
        </button>

        <div className="h-4 w-[1px] bg-neutral-800 mx-1 hidden md:block" />

        {/* Exit to Lobby */}
        <button
          onClick={onExitGame}
          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 md:py-1.5 rounded-xl bg-neutral-800 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 border border-neutral-700 text-xs font-semibold transition-all group shrink-0 active:scale-95"
          title="Exit to Platform Lobby"
        >
          <Home className="w-3.5 h-3.5 text-neutral-400 group-hover:text-red-300 transition-colors shrink-0" />
          <span>Exit</span>
        </button>
      </div>
    </div>
  );
}
