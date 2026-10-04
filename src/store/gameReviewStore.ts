import { create } from 'zustand';

export interface GameReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isGuest: boolean;
  rating: number; // 0.5 to 5.0 in 0.5 steps
  comment?: string;
  createdAt: string;
  versionSha: string;
  likes: number;
  liked?: boolean;
}

export interface CreatorProfile {
  name: string;
  avatar: string;
  verified: boolean;
  handle: string;
  bio: string;
  gamesCount: number;
  totalPlays: string;
  followers: number;
  joinedDate: string;
}

export interface GameMetadata {
  id: string;
  name: string;
  versionSha: string;
  coverImage: string;
  released: string;
  category: string;
  ageRating: string;
  deviceSupport: string;
  language: string;
  creator: CreatorProfile;
  description: string;
}

export function formatRating(rating: number): string {
  if (isNaN(rating) || rating <= 0) return '0';
  const rounded = Math.round(rating * 10) / 10;
  const str = rounded.toFixed(1);
  return str.endsWith('.0') ? str.slice(0, -2) : str;
}

const DEFAULT_METADATA: GameMetadata = {
  id: 'blackjack_vip',
  name: 'Blackjack VIP: Royal Deck',
  versionSha: 'sha-9f8a32b1',
  coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
  released: 'October 2026',
  category: 'Casino & Table Games',
  ageRating: '18+ / Mature',
  deviceSupport: 'Desktop, Tablet, Mobile (Responsive Canvas/HTML5)',
  language: 'English, 简体中文, Español, 日本語',
  creator: {
    name: 'Randseed Vanguard',
    handle: '@randseed_official',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RandseedVanguard',
    verified: true,
    bio: 'Specialized in next-generation provably fair crypto casino card games, decentralized table protocols, and high-frequency multiplayer real-time gaming engines on Randseed.',
    gamesCount: 12,
    totalPlays: '3.8M',
    followers: 48920,
    joinedDate: 'January 2024'
  },
  // Rich 500-word description detailing gameplay, rules, mathematics and provably fair mechanics
  description: `Welcome to Blackjack VIP: Royal Deck, the definitive high-stakes casino table gaming experience on the Randseed gaming platform. Engineered from the ground up for competitive card players and casino enthusiasts alike, this title combines classic Las Vegas strip rules with state-of-the-art Provably Fair cryptographic verification via HMAC-SHA256 Verifiable Random Functions (VRF).

Every hand is dealt from a 6-deck shoe with 50% penetration reshuffle, ensuring true statistical randomness without operator manipulation or deck tampering. Standard Blackjack pays out at a premium 3 to 2 ratio, with Insurance offered at 2 to 1 whenever the dealer reveals an Ace. The dealer is mathematically bound to stand on all 17s (both hard 17 and soft 17), providing optimal player return-to-player (RTP) rates exceeding 99.5% when adhering to basic strategy.

Players can split pairs up to three times for a total of four concurrent hands, double down on any two initial cards, and utilize surrender options where permitted by specific table rule variations. The multi-seat table layout allows for thrilling solo sessions or synchronized multiplayer action alongside other platform high-rollers. Dynamic chip denominations ranging from 10 to 10,000 accommodate casual entertainment as well as VIP tournament wagering.

Equipped with dual platform currency mechanisms, players can seamlessly switch between standard GCoin entertainment play and promotional Sweepstakes Bonus Coins. Integrated live leaderboard rankings track consecutive winning streaks, highest hand multipliers, and weekly championship tournament standings. Real-time floating player commentary, interactive spectator emoticons, and multi-angle 3D table rendering immerse you into the authentic atmosphere of Monte Carlo and Macau directly in your web browser.

Whether testing your card counting cadence, mastering basic strategy charts, or competing for the top spot on the Randseed global leaderboard, Blackjack VIP delivers unmatched fairness, ultra-fluid animations, and responsive touch controls optimized across all modern mobile and desktop screens.`
};

const INITIAL_REVIEWS: GameReview[] = [
  {
    id: 'rev_1',
    userId: 'user_alex88',
    userName: 'Alex "The Card" Vance',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexVance',
    isGuest: false,
    rating: 5,
    comment: 'Hands down the smoothest Blackjack implementation I have tested. The Provably Fair VRF seed verification actually lets you audit the shoe hashes, and the 3:2 payout on blackjack makes it mathematically sound.',
    createdAt: '2026-10-02 18:30',
    versionSha: 'sha-9f8a32b1',
    likes: 24,
    liked: false
  },
  {
    id: 'rev_2',
    userId: 'user_crypto_whale',
    userName: 'Elena Rostova',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova',
    isGuest: false,
    rating: 4.5,
    comment: 'Love the dual GCoin and Bonus coin toggle right by the balance! The chip animations feel weighted and realistic. Wish there was an optional sound theme for jazz casino background music, but otherwise top tier.',
    createdAt: '2026-10-01 14:15',
    versionSha: 'sha-9f8a32b1',
    likes: 18,
    liked: false
  },
  {
    id: 'rev_3',
    userId: 'guest_9182',
    userName: 'Guest #9182',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest9182',
    isGuest: true,
    rating: 4.5,
    comment: 'Played on mobile safari and the controls are super responsive. Hit 21 three times in a row! Great game for quick breaks.',
    createdAt: '2026-09-29 09:40',
    versionSha: 'sha-9f8a32b1',
    likes: 9,
    liked: false
  },
  {
    id: 'rev_4',
    userId: 'user_david_k',
    userName: 'David K.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidK',
    isGuest: false,
    rating: 5,
    comment: 'The tournament mode leaderboard is genuinely competitive. Excellent dealer animation timing and crystal clear payout calculations.',
    createdAt: '2026-09-26 21:04',
    versionSha: 'sha-9f8a32b1',
    likes: 12,
    liked: false
  },
  {
    id: 'rev_5',
    userId: 'guest_4431',
    userName: 'Guest #4431',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest4431',
    isGuest: true,
    rating: 4,
    comment: 'Clean UI, nice table felt texture, and fair dealing. 10/10 recommendation.',
    createdAt: '2026-09-22 16:55',
    versionSha: 'sha-9f8a32b1',
    likes: 5,
    liked: false
  }
];

interface GameReviewStoreState {
  metadata: GameMetadata;
  reviews: GameReview[];
  reviewedShasByUser: Record<string, string[]>; // userId -> array of reviewed versionShas
  
  // Session play time tracking
  playTimeSeconds: number;
  incrementPlayTime: () => void;
  resetPlayTime: () => void;
  
  // Review modal trigger & control
  isReviewModalOpen: boolean;
  reviewModalTriggerReason: 'time-5min' | 'exit-1min' | 'manual';
  hasTriggeredFiveMinuteModal: boolean;
  exitCallback: (() => void) | null;
  
  // Game Info modal state
  isGameInfoOpen: boolean;
  setGameInfoOpen: (open: boolean) => void;
  
  // Creator profile modal state
  isCreatorProfileOpen: boolean;
  setCreatorProfileOpen: (open: boolean) => void;

  // Actions
  openReviewModal: (reason?: 'time-5min' | 'exit-1min' | 'manual', onExit?: () => void) => void;
  closeReviewModal: () => void;
  submitReview: (rating: number, comment: string | undefined, user: { id?: string; name?: string; avatar?: string } | null) => void;
  hasUserReviewedCurrentVersion: (userId?: string) => boolean;
  likeReview: (reviewId: string) => void;
  getAverageRating: () => number;
  getFormattedRating: () => string;
}

const STORAGE_KEY_REVIEWS = 'randseed_game_reviews_v1';
const STORAGE_KEY_USER_SHAS = 'randseed_reviewed_shas_v1';

function loadPersistedReviews(): GameReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REVIEWS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load reviews from localStorage', e);
  }
  return INITIAL_REVIEWS;
}

function loadPersistedUserShas(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER_SHAS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load user SHAs from localStorage', e);
  }
  return {};
}

export const useGameReviewStore = create<GameReviewStoreState>((set, get) => ({
  metadata: DEFAULT_METADATA,
  reviews: loadPersistedReviews(),
  reviewedShasByUser: loadPersistedUserShas(),
  
  playTimeSeconds: 0,
  hasTriggeredFiveMinuteModal: false,
  isReviewModalOpen: false,
  reviewModalTriggerReason: 'manual',
  exitCallback: null,

  isGameInfoOpen: false,
  setGameInfoOpen: (open) => set({ isGameInfoOpen: open }),

  isCreatorProfileOpen: false,
  setCreatorProfileOpen: (open) => set({ isCreatorProfileOpen: open }),

  incrementPlayTime: () => {
    const nextTime = get().playTimeSeconds + 1;
    set({ playTimeSeconds: nextTime });

    // Trigger condition 1: Experienced game > 5 minutes (300 seconds)
    if (nextTime >= 300 && !get().hasTriggeredFiveMinuteModal) {
      set({ hasTriggeredFiveMinuteModal: true });
      const currentUserId = 'user_current'; // or current logged in id
      if (!get().hasUserReviewedCurrentVersion(currentUserId)) {
        get().openReviewModal('time-5min');
      }
    }
  },

  resetPlayTime: () => {
    set({ playTimeSeconds: 0, hasTriggeredFiveMinuteModal: false });
  },

  hasUserReviewedCurrentVersion: (userId) => {
    const currentSha = get().metadata.versionSha;
    const targetUserId = userId || 'anonymous_guest';
    const reviewedShas = get().reviewedShasByUser[targetUserId] || [];
    return reviewedShas.includes(currentSha);
  },

  openReviewModal: (reason = 'manual', onExit) => {
    set({
      isReviewModalOpen: true,
      reviewModalTriggerReason: reason,
      exitCallback: onExit || null
    });
  },

  closeReviewModal: () => {
    const { exitCallback } = get();
    set({ isReviewModalOpen: false, exitCallback: null });
    if (exitCallback) {
      exitCallback();
    }
  },

  submitReview: (rating, comment, user) => {
    const currentSha = get().metadata.versionSha;
    const isGuest = !user?.id || user.id === 'guest' || user.id.startsWith('user_guest');
    const guestSeed = Math.floor(1000 + Math.random() * 9000);
    const userId = user?.id || `guest_${guestSeed}`;
    const userName = isGuest ? `Guest #${guestSeed}` : (user?.name || 'Player');
    const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`;

    const newReview: GameReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId,
      userName,
      userAvatar,
      isGuest,
      rating,
      comment: comment?.trim() ? comment.trim() : undefined,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      versionSha: currentSha,
      likes: 0,
      liked: false
    };

    // Prepend to list (newest first - reverse chronological order)
    const updatedReviews = [newReview, ...get().reviews];
    
    // Record that this user reviewed this versionSha
    const targetKey = isGuest ? 'anonymous_guest' : userId;
    const currentList = get().reviewedShasByUser[targetKey] || [];
    const updatedShas = {
      ...get().reviewedShasByUser,
      [targetKey]: Array.from(new Set([...currentList, currentSha]))
    };

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updatedReviews));
      localStorage.setItem(STORAGE_KEY_USER_SHAS, JSON.stringify(updatedShas));
    } catch (e) {
      console.error(e);
    }

    set({
      reviews: updatedReviews,
      reviewedShasByUser: updatedShas,
      isReviewModalOpen: false
    });

    const { exitCallback } = get();
    if (exitCallback) {
      set({ exitCallback: null });
      exitCallback();
    }
  },

  likeReview: (reviewId) => {
    const updated = get().reviews.map(r => {
      if (r.id === reviewId) {
        const liked = !r.liked;
        return {
          ...r,
          liked,
          likes: liked ? r.likes + 1 : Math.max(0, r.likes - 1)
        };
      }
      return r;
    });

    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    set({ reviews: updated });
  },

  getAverageRating: () => {
    const reviews = get().reviews;
    if (!reviews.length) return 5.0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },

  getFormattedRating: () => {
    return formatRating(get().getAverageRating());
  }
}));
