import React from 'react';
import { 
  Gamepad2, 
  Trophy, 
  ShieldCheck, 
  Users, 
  Crown, 
  Sparkles, 
  Layers, 
  X, 
  Flame,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface PlatformSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFairness?: () => void;
  onSelectTable?: (tableId: string) => void;
  activeTableId?: string;
  isMobileDrawer?: boolean;
}

export function PlatformSidebar({
  isOpen,
  onClose,
  onOpenFairness,
  onSelectTable,
  activeTableId = 'table_1',
  isMobileDrawer = false
}: PlatformSidebarProps) {
  const { tables } = useGameStore();
  const tablesList = Object.values(tables).filter(t => t.status !== 'closed' && t.status !== 'closing' && t.settings.isPublic);

  const categories = [
    { id: 'lobby', name: 'All Games', icon: Layers, href: '/', active: false },
    { id: 'blackjack', name: 'Blackjack VIP', icon: Flame, href: '/t/table_1', active: true, tag: 'Live' },
    { id: 'tournament', name: 'Tournaments', icon: Trophy, href: '/play', active: false, tag: 'PVP' },
    { id: 'fairness', name: 'Provably Fair', icon: ShieldCheck, onClick: onOpenFairness, active: false, badge: 'VRF' },
    { id: 'friends', name: 'Friends & Social', icon: Users, href: `${import.meta.env.VITE_MAIN_SITE_URL || window.location.origin}/friends`, active: false },
    { id: 'ranks', name: 'Hall of Fame', icon: Crown, active: false }
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between text-neutral-200 select-none">
      <div className="flex flex-col gap-4">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide text-white uppercase">Categories</span>
          </div>
          {isMobileDrawer && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Categories */}
        <nav className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 px-2 py-1">
            Explore
          </span>
          {categories.map((cat) => {
            const Icon = cat.icon;
            if (cat.onClick) {
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    cat.onClick?.();
                    if (isMobileDrawer) onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/80 transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{cat.name}</span>
                  </div>
                  {cat.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <a
                key={cat.id}
                href={cat.href || '#'}
                onClick={(e) => {
                  if (cat.id === 'ranks') {
                    e.preventDefault();
                    if (isMobileDrawer) onClose();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  cat.active
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${cat.active ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <span>{cat.name}</span>
                </div>
                {cat.tag && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    cat.active ? 'bg-amber-500/30 text-amber-200' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {cat.tag}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Live Active Tables Quick Switch */}
        <div className="flex flex-col gap-1.5 pt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 px-2 py-1 flex items-center justify-between">
            <span>Live Tables</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">● {tablesList.length}</span>
          </span>
          <div className="flex flex-col gap-1 max-h-[260px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tablesList.map((t) => {
              const isCurrent = t.id === activeTableId;
              const seatedCount = t.seats.filter(s => s.userId !== null).length;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTable?.(t.id);
                    if (isMobileDrawer) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold'
                      : 'bg-neutral-900/40 hover:bg-neutral-800/80 border border-neutral-800/60 text-neutral-300'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate font-medium text-xs">{t.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Min Bet: {t.settings.minBet}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {seatedCount}/{t.seats.length}
                    </span>
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-neutral-800/80 flex flex-col gap-1 text-[11px] text-neutral-500">
        <div className="flex items-center justify-between">
          <span>Randseed Engine</span>
          <span className="text-emerald-400 font-mono text-[10px]">VRF Certified</span>
        </div>
        <p className="text-[10px] text-neutral-600">
          Decentralized on-chain verifiable randomness.
        </p>
      </div>
    </div>
  );
}
