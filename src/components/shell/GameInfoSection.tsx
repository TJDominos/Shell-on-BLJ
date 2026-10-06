import React, { useState, useMemo } from 'react';
import { 
  Share2, 
  Calendar, 
  Tag, 
  ShieldAlert, 
  Laptop, 
  Globe2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ThumbsUp, 
  MessageSquarePlus, 
  Copy,
  Sparkles,
  X
} from 'lucide-react';
import { useGameReviewStore, formatRating } from '../../store/gameReviewStore';
import { StarRating } from './StarRating';
import { GameTipButton } from './GameTipButton';

export function GameInfoSection() {
  const {
    metadata,
    reviews,
    getAverageRating,
    setCreatorProfileOpen,
    openReviewModal,
    likeReview
  } = useGameReviewStore();

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const averageRating = getAverageRating();
  const formattedScore = formatRating(averageRating);

  // Description truncation at 300 words
  const words = metadata.description.split(/\s+/);
  const isDescriptionLong = words.length > 300;
  const truncatedDescription = useMemo(() => {
    if (!isDescriptionLong || isDescriptionExpanded) {
      return metadata.description;
    }
    return words.slice(0, 300).join(' ') + '...';
  }, [metadata.description, isDescriptionLong, isDescriptionExpanded, words]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="w-full bg-[#121520] border border-neutral-800 rounded-2xl p-4 sm:p-6 md:p-8 space-y-6 shadow-xl text-neutral-100">
      {/* Top Header: Cover Thumbnail, Game Name, Rating, Share Button */}
      <div className="flex flex-col lg:flex-row gap-5 items-start justify-between border-b border-neutral-800/80 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start flex-1 min-w-0 w-full">
          {/* Game Cover Thumbnail */}
          <div className="relative group shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-700 bg-neutral-900">
            <img
              src={metadata.coverImage}
              alt={metadata.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 space-y-2.5 min-w-0 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight break-words">
                {metadata.name}
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-semibold border border-emerald-500/30 shrink-0">
                Official
              </span>
            </div>

            {/* Rating display (0.5 - 5 half-star step, average formatted with 1 decimal and .0 stripped) */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-800 shadow-inner">
                <StarRating
                  value={averageRating}
                  interactive={false}
                  size="sm"
                />
                <span className="font-mono font-bold text-amber-400 text-sm sm:text-base">
                  {formattedScore}
                </span>
                <span className="text-xs text-neutral-400 font-medium">
                  ({reviews.length} reviews)
                </span>
              </div>

              <button
                onClick={() => openReviewModal('manual')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5F40A1]/15 hover:bg-[#5F40A1]/25 border border-[#5F40A1]/40 text-[#D3C3ED] hover:text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Rate & Review</span>
              </button>
            </div>

            {/* Creator Info (Clickable to enter profile) */}
            <div 
              onClick={() => setCreatorProfileOpen(true)}
              className="group inline-flex items-center gap-2.5 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-neutral-700 px-3 py-1.5 rounded-xl cursor-pointer transition-all w-fit mt-1"
              title="Click to view creator profile"
            >
              <img
                src={metadata.creator.avatar}
                alt={metadata.creator.name}
                className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 object-cover"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-neutral-200 group-hover:text-amber-400 transition-colors">
                  {metadata.creator.name}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  ({metadata.creator.handle})
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold ml-1">
                  Profile →
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Support / Tip Creator + Share Game */}
        <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto justify-start lg:justify-end flex-wrap pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-800/60">
          {/* Standalone Support / Tip Creator Button */}
          <GameTipButton variant="info-section" />

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 hover:text-white transition-all shadow active:scale-95 shrink-0 cursor-pointer"
            title="Share this game"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B49CDF]" />
            <span>Share Game</span>
          </button>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 text-xs">
        <div className="space-y-1">
          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" /> Released
          </span>
          <p className="font-semibold text-neutral-200">{metadata.released}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-neutral-400" /> Category
          </span>
          <p className="font-semibold text-neutral-200">{metadata.category}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-neutral-400" /> Age Rating
          </span>
          <p className="font-semibold text-amber-400">{metadata.ageRating}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-neutral-400" /> Device Support
          </span>
          <p className="font-semibold text-neutral-200">{metadata.deviceSupport}</p>
        </div>

        <div className="space-y-1 col-span-2 sm:col-span-1 lg:col-span-1">
          <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-neutral-400" /> Language
          </span>
          <p className="font-semibold text-neutral-200">{metadata.language}</p>
        </div>
      </div>

      {/* Description Section (500 words, collapses at 300 words) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">
            Game Description & Rules
          </h2>
          <span className="text-[11px] text-neutral-500 font-mono">
            {words.length} words
          </span>
        </div>

        <div className="relative">
          <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line font-normal">
            {truncatedDescription}
          </div>

          {/* Fade overlay when collapsed */}
          {isDescriptionLong && !isDescriptionExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#121520] to-transparent pointer-events-none" />
          )}
        </div>

        {/* Collapse / Expand Button */}
        {isDescriptionLong && (
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="mt-1 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            {isDescriptionExpanded ? (
              <>
                <span>Show Less (Collapse)</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Read More (Full 500-Word Description)</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Comments & Reviews Section (Displayed directly after description, newest first) */}
      <div className="space-y-4 pt-6 border-t border-neutral-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Player Comments & Verified Reviews</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                {reviews.length}
              </span>
            </h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Public player ratings · Displayed reverse-chronologically (newest first)
            </p>
          </div>

          <button
            onClick={() => openReviewModal('manual')}
            className="px-4 py-2 rounded-xl bg-[#5F40A1] hover:bg-[#4C3380] text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            + Write a Review
          </button>
        </div>

        {/* Comments List (reverse chronological order) */}
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No comments yet. Be the first to leave a review!
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-2.5 transition-colors hover:border-neutral-700/80"
              >
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-neutral-200">
                          {rev.userName}
                        </span>
                        {rev.isGuest && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                            Guest
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {rev.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Rating stars */}
                  <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
                    <StarRating value={rev.rating} size="sm" />
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {formatRating(rev.rating)}
                    </span>
                  </div>
                </div>

                {/* Comment text */}
                {rev.comment && (
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pl-10">
                    {rev.comment}
                  </p>
                )}

                {/* Footer Actions: Likes / Helpful */}
                <div className="flex items-center justify-end gap-3 pl-10 pt-1 text-[11px] text-neutral-400">
                  <button
                    onClick={() => likeReview(rev.id)}
                    className={`flex items-center gap-1.5 hover:text-white transition-colors ${
                      rev.liked ? 'text-amber-400 font-semibold' : ''
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${rev.liked ? 'fill-amber-400' : ''}`} />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Share Modal Dialog with Game Cover Thumbnail */}
      {showShareModal && (
        <div className="fixed inset-0 z-[240] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141722] border border-neutral-700 rounded-2xl w-full max-w-sm p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#B49CDF]" />
                <span>Share {metadata.name}</span>
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Share Card Preview with Cover Thumbnail */}
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center gap-3">
              <img
                src={metadata.coverImage}
                alt={metadata.name}
                className="w-14 h-14 rounded-lg object-cover border border-neutral-700"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{metadata.name}</div>
                <div className="text-[11px] text-amber-400 flex items-center gap-1 mt-0.5">
                  <StarRating value={averageRating} size="sm" />
                  <span className="font-mono">({formattedScore})</span>
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                  By {metadata.creator.name}
                </div>
              </div>
            </div>

            {/* Share link input */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-neutral-400">Game Share Link</label>
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent text-neutral-300 w-full outline-none text-[11px] truncate font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-lg bg-[#5F40A1] hover:bg-[#4C3380] text-white font-semibold text-xs shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="text-[10px] text-neutral-500 text-center">
              Thumbnail & metadata will automatically render on Discord, Telegram, and Twitter.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
