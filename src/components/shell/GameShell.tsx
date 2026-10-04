import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlatformPlayerHeader } from '../PlatformPlayerHeader';
import type { RuntimeState } from '../../player-runtime/runtimeProtocol';
import { useGameStore } from '../../store/gameStore';
import { useUIStore, selectPlayMode } from '../../store/uiStore';
import { useGameReviewStore } from '../../store/gameReviewStore';
import { RulesModal } from '../../views/RulesModal';
import { X, Check, ShieldCheck, Coins, Bell } from 'lucide-react';
import { CurrencyIcon } from '../CurrencyIcon';

// Shell & Game Info Components
import { GameControlBar } from './GameControlBar';
import { GameInfoSection } from './GameInfoSection';
import { GameReviewModal } from './GameReviewModal';
import { CreatorProfileModal } from './CreatorProfileModal';

export function GameShell() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tableId = id || 'table_1';

  const { currentUser, login, updateBalance } = useGameStore();
  const playMode = useUIStore(selectPlayMode);
  const setPlayMode = useUIStore((s) => s.setPlayMode);

  // Shell State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showFairnessModal, setShowFairnessModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  // Review Store & Play Time Tracking
  const {
    incrementPlayTime,
    hasUserReviewedCurrentVersion,
    openReviewModal,
    metadata
  } = useGameReviewStore();

  const gameCardRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Play time accumulation timer (1 tick per second)
  useEffect(() => {
    const timer = setInterval(() => {
      incrementPlayTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [incrementPlayTime]);

  // Fullscreen toggle on game container
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gameCardRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Safe Exit interceptor (Condition: played > 1 min and not reviewed current sha)
  const handleSafeExit = () => {
    const { playTimeSeconds, hasUserReviewedCurrentVersion, openReviewModal } = useGameReviewStore.getState();
    const alreadyReviewed = hasUserReviewedCurrentVersion(currentUser?.id);

    if (playTimeSeconds >= 60 && !alreadyReviewed) {
      openReviewModal('exit-1min', () => navigate('/'));
    } else {
      navigate('/');
    }
  };

  // PostMessage bridge between shell & game iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      const { type, payload } = event.data || {};
      if (type === 'GAME_REQUEST_DEPOSIT') {
        setShowDepositModal(true);
      } else if (type === 'GAME_SET_CURRENCY' && payload?.currency) {
        setPlayMode(payload.currency);
      } else if (type === 'GAME_REQUEST_LOBBY') {
        handleSafeExit();
      } else if (type === 'GAME_TOGGLE_SOUND') {
        setIsMuted(prev => !prev);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, setPlayMode, currentUser?.id]);

  // Sync state down to iframe when muted or playMode changes
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'SHELL_SYNC_STATE',
        payload: {
          isMuted,
          playMode,
          userBalance: currentUser?.balance || 0,
          userBonusBalance: currentUser?.bonusBalance || 0
        }
      }, window.location.origin);
    }
  }, [isMuted, playMode, currentUser?.balance, currentUser?.bonusBalance]);

  const handleDeposit = (amount: number, currency: 'Gcoin' | 'Bonus') => {
    if (currency === 'Gcoin') {
      updateBalance(amount);
    } else {
      updateBalance(amount, 'Bonus');
    }

    setDepositSuccessMsg(`Added ${amount.toLocaleString()} ${currency === 'Gcoin' ? 'GC' : 'SC'} to your platform wallet!`);
    setTimeout(() => {
      setDepositSuccessMsg(null);
      setShowDepositModal(false);
    }, 1500);
  };

  const handleRefreshGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = `/t/${tableId}?embed=true&t=${Date.now()}`;
    }
  };

  const runtimeState: RuntimeState = {
    session: {
      status: currentUser ? 'authenticated' : 'unauthenticated',
      user: currentUser ? {
        displayName: currentUser.name,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        id: currentUser.id
      } : undefined
    },
    notifications: {
      unreadCount: 2
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#0b0e14] text-neutral-100">
      {/* Universal Platform Shell Header */}
      <PlatformPlayerHeader
        gameName={metadata.name}
        state={runtimeState}
        onNavigateHome={handleSafeExit}
        onSignIn={() => login('Player')}
        signInPending={false}
        onSignOut={() => useGameStore.setState({ currentUser: null })}
        onOpenNotifications={() => setShowNotifications(true)}
        onToggleMute={() => setIsMuted(prev => !prev)}
      />

      {/* Main Page Layout: Game Frame Container (1280px) + Game Info Section below */}
      <main className="w-full max-w-[1280px] mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-4 flex flex-col gap-4 sm:gap-6 flex-1">
        {/* Game Window Card: 1280px width, 720px game height */}
        <div 
          ref={gameCardRef}
          className={`w-full max-w-[1280px] mx-auto bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col ${
            isFullscreen ? 'fixed inset-0 z-[300] rounded-none border-0 max-w-none' : 'relative'
          }`}
        >
          {/* Game Viewport / Iframe: 720px natural height matching the game table */}
          <div 
            className={`w-full relative bg-[#0f121a] overflow-hidden ${
              isFullscreen ? 'flex-1 h-full' : 'h-[720px]'
            }`}
          >
            <iframe
              ref={iframeRef}
              src={`/t/${tableId}?embed=true`}
              title="Game Frame"
              className="w-full h-full border-0 absolute inset-0 overflow-hidden block"
              scrolling="no"
              style={{ overflow: 'hidden' }}
              allow="autoplay; fullscreen"
            />
          </div>

          {/* Game Control Bar: Docked directly underneath the game viewport, ZERO overlap with mobile play panel! */}
          <GameControlBar
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(prev => !prev)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onRefreshGame={handleRefreshGame}
            onExitGame={handleSafeExit}
            onOpenFairness={() => setShowFairnessModal(true)}
          />
        </div>

        {/* Game Information Section: Directly displayed below the game! */}
        <GameInfoSection />
      </main>

      {/* Universal Game Review Modal */}
      <GameReviewModal />

      {/* Universal Creator Profile Modal */}
      <CreatorProfileModal />

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-neutral-700 rounded-2xl w-full max-w-md p-5 text-white shadow-2xl relative">
            <button
              onClick={() => setShowNotifications(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold">Platform Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                <div className="font-semibold text-white mb-1">Daily Login Bonus Ready</div>
                <div className="text-neutral-400">Claim your daily 10,000 GCoin reward in the lobby!</div>
              </div>
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                <div className="font-semibold text-white mb-1">Weekend Blackjack Tournament</div>
                <div className="text-neutral-400">Join the High Roller tournament table now for 50,000 GC prize pool.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit / Coin Store Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-amber-500/30 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-bold shadow-lg">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Platform Coin Store</h3>
                <p className="text-xs text-slate-400">Claim free coins or top up your game wallet</p>
              </div>
            </div>

            {depositSuccessMsg ? (
              <div className="my-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 text-sm font-semibold">
                <Check className="w-5 h-5" />
                <span>{depositSuccessMsg}</span>
              </div>
            ) : (
              <div className="space-y-4 my-4">
                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CurrencyIcon currency="Gcoin" className="w-6 h-6" />
                    <div>
                      <div className="font-bold text-sm text-[#ffc53d]">+10,000 GCoin Pack</div>
                      <div className="text-[11px] text-slate-400">Standard Play Chips</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeposit(10000, 'Gcoin')}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow"
                  >
                    Claim Free
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CurrencyIcon currency="Bonus" className="w-6 h-6" />
                    <div>
                      <div className="font-bold text-sm text-[#4096ff]">+50 Bonus Coins (SC)</div>
                      <div className="text-[11px] text-slate-400">Promotional Redeemable Play</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeposit(50, 'Bonus')}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow"
                  >
                    Claim Free
                  </button>
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-500 text-center mt-4">
              Simulated platform store for instant testing. No purchase necessary.
            </div>
          </div>
        </div>
      )}

      {/* Rules Modal */}
      {showRulesModal && (
        <RulesModal onClose={() => setShowRulesModal(false)} />
      )}

      {/* Provably Fair Modal */}
      {showFairnessModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-emerald-500/30 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowFairnessModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Provably Fair System (VRF)</h3>
                <p className="text-xs text-slate-400">Cryptographically verifiable randomness</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Every round of Blackjack on this platform utilizes cryptographic Verifiable Random Functions (VRF) combined with client seeds. Results cannot be manipulated by the platform or players once dealt.
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Protocol:</span>
                <span className="text-emerald-400">HMAC-SHA256 VRF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deck Configuration:</span>
                <span className="text-slate-200">6 Decks (312 cards), reshuffled at 50% penetration</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Blackjack Payout:</span>
                <span className="text-amber-400">3 to 2</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowFairnessModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
