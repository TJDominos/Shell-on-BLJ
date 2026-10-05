import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { useUIStore, selectPlayMode } from '../../store/uiStore';
import { PlatformPlayerHeader } from '../PlatformPlayerHeader';
import type { RuntimeState } from '../../player-runtime/runtimeProtocol';
import { CurrencyIcon } from '../CurrencyIcon';
import { PlatformSidebar } from './PlatformSidebar';
import { 
  Play, 
  Users, 
  Trophy, 
  Sparkles, 
  Flame, 
  Layers, 
  ShieldCheck, 
  ChevronRight,
  PlusCircle,
  Coins
} from 'lucide-react';

export function PlatformLobby() {
  const navigate = useNavigate();
  const { tables, currentUser, login } = useGameStore();
  const playMode = useUIStore(selectPlayMode);
  const setPlayMode = useUIStore((s) => s.setPlayMode);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'classic' | 'tournament'>('all');

  const activeTablesList = Object.values(tables).filter(t => t.status !== 'closed' && t.status !== 'closing' && t.settings.isPublic);

  const filteredTables = activeTablesList.filter(table => {
    if (selectedFilter === 'tournament') return table.settings.mode === 'tournament';
    if (selectedFilter === 'classic') return table.settings.mode !== 'tournament';
    return true;
  });

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
    <div className="w-full min-h-[100dvh] flex flex-col bg-[#0b0e14] text-slate-100 select-none overflow-y-auto">
      {/* Universal Shell Header in Lobby mode */}
      <PlatformPlayerHeader
        gameName="Randseed Hub"
        state={runtimeState}
        onNavigateHome={() => navigate('/')}
        onSignIn={() => login('Player')}
        signInPending={false}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        onSignOut={() => useGameStore.setState({ currentUser: null })}
        onOpenNotifications={() => {}}
        onToggleMute={() => {}}
      />

      <div className="w-full flex-1 flex relative overflow-x-hidden">
        {/* Desktop Sidebar: pushes main content to the right when open */}
        <aside 
          className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out bg-[#0c0f16] border-r border-neutral-800/80 overflow-hidden ${
            sidebarOpen ? 'w-[260px]' : 'w-0 border-r-0'
          }`}
          aria-label="Game categories"
        >
          <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px] overflow-y-auto p-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <PlatformSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              onSelectTable={(id) => navigate(`/play/${id}`)}
              activeTableId=""
              isMobileDrawer={false}
            />
          </div>
        </aside>

        {/* Mobile Sidebar Overlay: covers the main page content on mobile */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[200] flex">
            {/* Backdrop overlay */}
            <div 
              className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer covering main content */}
            <aside 
              className="relative z-10 w-[280px] max-w-[85vw] h-full bg-[#0c0f16] border-r border-neutral-800 p-4 shadow-2xl overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Game categories"
            >
              <PlatformSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onSelectTable={(id) => navigate(`/play/${id}`)}
                activeTableId=""
                isMobileDrawer={true}
              />
            </aside>
          </div>
        )}

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 min-w-0 transition-all duration-300 ease-in-out">
          {/* Hero Featured Game Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-[#1a1208] via-[#20150b] to-[#121622] p-6 sm:p-10 shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-yellow-600 to-transparent" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>FEATURED GAME &bull; VERIFIABLE VRF</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Blackjack <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">VIP</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience authentic high-limit Vegas rules, real-time multiplayer tables, split/double down, and instant provably fair settlement.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/play/table_1')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 active:scale-95 text-slate-950 font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all group"
              >
                <Play className="w-5 h-5 fill-slate-950 transition-transform group-hover:scale-110" />
                <span>PLAY IN GAME SHELL</span>
              </button>

              <button
                onClick={() => navigate('/host')}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Host Your Own Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills & Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>Live Game Tables</span>
            </h2>
            <p className="text-xs text-slate-400">Join an existing room or observe active rounds</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Tables ({activeTablesList.length})
            </button>
            <button
              onClick={() => setSelectedFilter('classic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'classic'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => setSelectedFilter('tournament')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'tournament'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tournaments
            </button>
          </div>
        </div>

        {/* Live Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {filteredTables.map((table) => {
            const occupiedSeats = table.seats.filter((s: any) => s.userId).length;
            const isTournament = table.settings.mode === 'tournament';

            return (
              <div
                key={table.id}
                onClick={() => navigate(`/play/${table.id}`)}
                className="group relative rounded-2xl border border-white/10 bg-[#141822]/80 hover:bg-[#181d2a] p-5 cursor-pointer transition-all duration-200 hover:border-amber-400/50 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-amber-300 transition-colors">
                          {table.settings.name || 'Blackjack Table'}
                        </span>
                        {isTournament && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Tournament
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        Host: {table.houseId === 'system' ? 'Platform Official' : 'Player House'}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{occupiedSeats}/6</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Min Bet</div>
                      <div className="font-mono font-bold text-amber-300">
                        {table.settings.minBet.toLocaleString()} GC
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Max Bet</div>
                      <div className="font-mono font-bold text-slate-200">
                        {table.settings.maxBet.toLocaleString()} GC
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                  <span className="flex items-center gap-1 text-slate-400 group-hover:text-slate-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    VRF Deck
                  </span>
                  <span className="flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter Table
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      </div>
    </div>
  );
}
