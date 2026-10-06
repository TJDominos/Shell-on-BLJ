import React, { useState, useMemo } from 'react';
import { X, Star, Sparkles, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGameReviewStore } from '../../store/gameReviewStore';
import { useGameStore } from '../../store/gameStore';
import { StarRating } from './StarRating';

export function GameReviewModal() {
  const {
    isReviewModalOpen,
    closeReviewModal,
    submitReview,
    metadata,
    reviewModalTriggerReason
  } = useGameReviewStore();

  const currentUser = useGameStore((s) => s.currentUser);

  const [rating, setRating] = useState<number>(5.0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  // Word count calculation
  const wordCount = useMemo(() => {
    const trimmed = commentText.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [commentText]);

  const isWordLimitExceeded = wordCount > 200;

  if (!isReviewModalOpen) return null;

  const isGuest = !currentUser?.id || currentUser.id === 'guest';
  const reviewerDisplayName = isGuest ? 'Guest' : currentUser.name;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isWordLimitExceeded) return;

    submitReview(rating, commentText, currentUser ? {
      id: currentUser.id,
      name: currentUser.name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`
    } : null);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCommentText('');
      closeReviewModal();
    }, 1200);
  };

  const getRatingFeedback = (score: number) => {
    if (score >= 5) return 'Masterpiece! 🌟🌟🌟🌟🌟';
    if (score >= 4.5) return 'Almost perfect! ✨';
    if (score >= 4) return 'Really enjoyed it! 👍';
    if (score >= 3.5) return 'Good experience! 🙂';
    if (score >= 3) return 'Average, could be improved. ⚖️';
    if (score >= 2.5) return 'Mediocre, needs polish. ⚠️';
    if (score >= 2) return 'Needs work. 🛠️';
    if (score >= 1.5) return 'Poor experience. 😕';
    if (score >= 1) return 'Very poor. 👎';
    return 'Disappointing. 💔';
  };

  return (
    <div className="fixed inset-0 z-[220] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#141721] border border-neutral-700/80 rounded-2xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-neutral-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h2 id="review-modal-title" className="text-base font-bold text-white tracking-wide">
                Rate & Review Game
              </h2>
              <div className="text-xs text-neutral-400">
                {metadata.name} · <span className="font-mono text-neutral-500">{metadata.versionSha}</span>
              </div>
            </div>
          </div>

          <button
            onClick={closeReviewModal}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-in zoom-in-75">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Review Submitted!</h3>
            <p className="text-sm text-neutral-400">
              Thank you for supporting {metadata.name}. Your rating and comments are now visible in Game Info.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Context Notice based on trigger */}
            {reviewModalTriggerReason === 'time-5min' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>You have enjoyed over 5 minutes of play! Share your quick review with the community.</span>
              </div>
            )}
            {reviewModalTriggerReason === 'exit-1min' && (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Leaving so soon? Help us improve by leaving a quick star rating before you go.</span>
              </div>
            )}

            {/* User Identity Display */}
            <div className="flex items-center justify-between text-xs bg-neutral-900/60 border border-neutral-800 rounded-xl px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Posting as:</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isGuest ? 'bg-neutral-400' : 'bg-emerald-400'}`} />
                  {reviewerDisplayName}
                </span>
              </div>
              <span className="text-[11px] text-neutral-500">
                {isGuest ? 'Displayed as Guest publicly' : 'Verified Player'}
              </span>
            </div>

            {/* Interactive 5-Star Rating (0.5 Step) */}
            <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-neutral-800/80 space-y-2.5">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Click or Tap Stars (0.5 Precision)
              </span>

              <div className="py-2">
                <StarRating
                  value={rating}
                  onChange={(val) => {
                    setRating(val);
                    setHoverRating(null);
                  }}
                  onHoverChange={setHoverRating}
                  interactive={true}
                  size="lg"
                  showScoreLabel={true}
                />
              </div>

              <div className="text-xs font-medium text-amber-300/90 h-5 flex items-center justify-center text-center">
                {getRatingFeedback(displayRating)}
              </div>
            </div>

            {/* Optional Comment Section (Max 200 Words) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="review-comments" className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Comments (Optional)</span>
                </label>
                <span className={`text-[11px] font-mono ${isWordLimitExceeded ? 'text-red-400 font-bold' : 'text-neutral-400'}`}>
                  {wordCount} / 200 words
                </span>
              </div>

              <textarea
                id="review-comments"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on the game balance, dealer speed, graphics, or suggestions for the creator..."
                rows={4}
                className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl p-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#5F40A1]/50 focus:border-[#8B6BC9] transition-all resize-none"
              />

              {isWordLimitExceeded && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Comment cannot exceed 200 words. Please shorten your message.</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={closeReviewModal}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
              >
                {reviewModalTriggerReason === 'exit-1min' ? 'Skip & Leave' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isWordLimitExceeded}
                className="px-6 py-2 rounded-full text-xs font-semibold bg-[#5F40A1] hover:bg-[#4C3380] text-white shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
