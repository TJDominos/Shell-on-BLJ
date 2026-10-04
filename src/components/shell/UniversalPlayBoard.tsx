import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Crown, Zap, Coins, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface UniversalPlayBoardProps {
  isOpen: boolean;
  onClose: () => void;
  tableId?: string;
}

export function UniversalPlayBoard({ isOpen, onClose, tableId }: UniversalPlayBoardProps) {
  const [activeTab, setActiveTab] = useState<'online' | 'records'>('online');
  const { tables, activeTableId, gameRecords } = useGameStore();

  const currentTableId = tableId || activeTableId || 'table_1';
  const table = tables[currentTableId] || Object.values(tables)[0];

  // Cumulative statistics calculation
  const cumulative = React.useMemo(() => {
    const stats: Record<string, { rounds: number; wins: number; amountWon: number }> = {};
    const relevantRecords = gameRecords.filter(r => !table?.id || r.tableId === table.id);

    relevantRecords.forEach(record => {
      const usersInRound = new Set<string>();
      record.seatResults?.forEach(sr => {
        if (sr.userId) usersInRound.add(sr.userId);
      });

      usersInRound.forEach(uid => {
        if (!stats[uid]) stats[uid] = { rounds: 0, wins: 0, amountWon: 0 };
        stats[uid].rounds += 1;
      });

      record.seatResults?.forEach(sr => {
        if (!sr.userId) return;
        const isWin = sr.action.includes('won') || sr.action.includes('blackjack') || (sr.net || 0) > 0;
        if (isWin) {
          stats[sr.userId].wins += 1;
        }
        stats[sr.userId].amountWon += (sr.net || 0);
      });
    });

    const computed = Object.entries(stats).map(([userId, data]) => ({
      userId,
      name: userId.replace('bot_', 'Bot ').substring(0, 12),
      ...data
    })).sort((a, b) => b.amountWon - a.amountWon);

    if (computed.length === 0) {
      return [
        { userId: 'player_1', name: 'HighRoller_88', rounds: 34, wins: 19, amountWon: 12500 },
        { userId: 'player_2', name: 'LuckyCard_VIP', rounds: 28, wins: 14, amountWon: 8400 },
        { userId: 'player_3', name: 'VegasAce', rounds: 19, wins: 9, amountWon: 3200 },
        { userId: 'player_4', name: 'CardCounter99', rounds: 42, wins: 18, amountWon: -1500 },
      ];
    }
    return computed;
  }, [gameRecords, table]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* Sidebar drawer from left */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-[110] w-[340px] max-w-[85vw] bg-[#12151e] border-r border-neutral-800 shadow-2xl flex flex-col pointer-events-auto text-neutral-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-[#161924]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-wide">Play Board</h2>
                  <p className="text-[11px] text-neutral-400">Table activity & player statistics</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-neutral-800 bg-neutral-900/50 p-1 gap-1">
              <button
                onClick={() => setActiveTab('online')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'online'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Active Table</span>
              </button>

              <button
                onClick={() => setActiveTab('records')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'records'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Leader Stats</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {activeTab === 'online' ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Current Table Seats</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Live</span>
                  </div>

                  {table && table.seats ? (
                    <div className="space-y-2">
                      {table.seats.map((seat, idx) => {
                        const occupied = !!seat.userId;
                        const userName = seat.userId ? seat.userId.replace('bot_', 'Bot ').substring(0, 12) : '';
                        const seatBet = seat.hand?.bet || 0;
                        return (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              occupied
                                ? 'bg-neutral-900/80 border-neutral-700/80'
                                : 'bg-neutral-900/30 border-neutral-800/50 border-dashed text-neutral-500'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-neutral-800 text-[10px] font-bold flex items-center justify-center text-neutral-400">
                                {idx + 1}
                              </span>
                              <div>
                                <div className="text-xs font-bold text-neutral-200">
                                  {occupied ? userName : 'Empty Seat'}
                                </div>
                                {occupied && seatBet > 0 && (
                                  <div className="text-[10px] text-amber-400 font-mono">
                                    Bet: {seatBet.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            {occupied ? (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                                Playing
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-500">Available</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500 text-xs">
                      No active seats loaded.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Top Performance
                  </div>
                  {cumulative.map((p, index) => (
                    <div
                      key={p.userId || index}
                      className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {index + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-neutral-200 flex items-center gap-1">
                            <span>{p.name}</span>
                            {index === 0 && <Crown className="w-3 h-3 text-yellow-400" />}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {p.rounds} rounds · {p.wins} wins
                          </div>
                        </div>
                      </div>
                      <div className={`text-xs font-bold font-mono ${p.amountWon >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {p.amountWon >= 0 ? `+${p.amountWon.toLocaleString()}` : p.amountWon.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
