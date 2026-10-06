import React, { useState } from 'react';
import { X, CheckCircle2, Gamepad2, Users, Play, ExternalLink, Share2, Sparkles } from 'lucide-react';
import { useGameReviewStore } from '../../store/gameReviewStore';
import { GameTipButton } from './GameTipButton';

export function CreatorProfileModal() {
  const { isCreatorProfileOpen, setCreatorProfileOpen, metadata } = useGameReviewStore();
  const creator = metadata.creator;

  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isCreatorProfileOpen) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/creator/${encodeURIComponent(creator.handle)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[230] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#141722] border border-neutral-700/80 rounded-2xl w-full max-w-md shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-neutral-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="creator-title"
      >
        {/* Banner with gradient */}
        <div className="h-28 w-full bg-gradient-to-r from-emerald-900 via-amber-900 to-indigo-950 relative">
          <button
            onClick={() => setCreatorProfileOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-neutral-300 hover:text-white hover:bg-black/80 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col space-y-4">
          {/* Avatar floating over banner */}
          <div className="-mt-14 flex items-end justify-between">
            <div className="relative">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-20 h-20 rounded-2xl bg-neutral-900 border-4 border-[#141722] shadow-xl object-cover"
              />
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 text-white shadow-md" title="Verified Randseed Creator">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <GameTipButton variant="info-section" />

              <button
                onClick={handleShare}
                className="p-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors text-xs flex items-center gap-1.5"
                title="Share Creator"
              >
                <Share2 className="w-4 h-4 text-[#B49CDF]" />
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>

              <button
                onClick={() => setFollowing(!following)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                  following
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 hover:brightness-110 active:scale-95'
                }`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          {/* Name & Handle */}
          <div>
            <div className="flex items-center gap-1.5">
              <h2 id="creator-title" className="text-xl font-bold text-white">
                {creator.name}
              </h2>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xs text-neutral-400 font-mono mt-0.5">
              {creator.handle} · Member since {creator.joinedDate}
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
            {creator.bio}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800">
              <div className="text-base font-bold text-amber-400 font-mono">{creator.totalPlays}</div>
              <div className="text-[10px] text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
                <Play className="w-3 h-3 text-neutral-500" /> Plays
              </div>
            </div>
            <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800">
              <div className="text-base font-bold text-emerald-400 font-mono">{creator.gamesCount}</div>
              <div className="text-[10px] text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
                <Gamepad2 className="w-3 h-3 text-neutral-500" /> Titles
              </div>
            </div>
            <div className="bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-800">
              <div className="text-base font-bold text-blue-400 font-mono">
                {(creator.followers + (following ? 1 : 0)).toLocaleString()}
              </div>
              <div className="text-[10px] text-neutral-400 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3 h-3 text-neutral-500" /> Followers
              </div>
            </div>
          </div>

          {/* Published Games Preview */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-neutral-400 flex items-center justify-between">
              <span>Popular Games by {creator.name}</span>
              <span className="text-[10px] text-emerald-400 cursor-pointer hover:underline">View All (12)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={metadata.coverImage}
                  alt={metadata.name}
                  className="w-10 h-10 rounded-lg object-cover border border-neutral-700"
                />
                <div>
                  <div className="text-xs font-bold text-white">{metadata.name}</div>
                  <div className="text-[10px] text-neutral-400">Blackjack · ⭐ 4.8 · 1.2M Plays</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Playing Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
