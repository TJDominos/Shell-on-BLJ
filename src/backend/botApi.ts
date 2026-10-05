import { Table } from '../store/gameStore';

const BOT_USER_IDS = ['bot_1', 'bot_2', 'bot_3', 'bot_4'];

export const botApi = {
  // Adjust bots based on the position of real users
  arrangeBots(table: Table) {
    if (table.settings.mode === 'tournament') return;

    // Do NOT spawn bots on system tables - keep system tables pure, snappy solo play against the dealer
    if (table.houseId === 'system') {
      table.seats.forEach(s => {
        if (s.userId && s.userId.startsWith('bot_')) {
          s.userId = null;
          s.isReady = false;
          s.hand = null;
        }
      });
      return;
    }

    const realUserIndices: number[] = [];
    const currentBotIndices: number[] = [];

    table.seats.forEach((s, idx) => {
      if (s.userId !== null && !s.userId.startsWith('bot_')) {
        realUserIndices.push(idx);
      } else if (s.userId !== null && s.userId.startsWith('bot_')) {
        currentBotIndices.push(idx);
      }
    });

    // If no real user, clear all bots so the table is fully open
    if (realUserIndices.length === 0) {
      currentBotIndices.forEach(idx => {
        table.seats[idx].userId = null;
        table.seats[idx].isReady = false;
        table.seats[idx].hand = null;
      });
      return;
    }

    // Determine target seats for bots based on real user positions
    // Let's place a bot to the left and/or right of real users if empty
    const desiredSeatIndices = new Set<number>();
    realUserIndices.forEach(idx => {
      const left = idx - 1;
      const right = idx + 1;
      if (left >= 0 && table.seats[left].userId === null) {
        desiredSeatIndices.add(left);
      }
      if (right < table.seats.length && table.seats[right].userId === null) {
        desiredSeatIndices.add(right);
      }
    });

    // We only want a maximum number of bots (e.g., 2)
    const MAX_BOTS = 2;
    let availableDesiredSeats = Array.from(desiredSeatIndices).sort(() => Math.random() - 0.5);

    // Keep existing bots if they are already in desired seats or just re-arrange them
    // For simplicity, we just clear current bots that are not in desired positions
    // and recreate them.
    let activeBotsCount = 0;
    
    // First, keep existing bots if they are in desired positions
    currentBotIndices.forEach(idx => {
      if (desiredSeatIndices.has(idx) && activeBotsCount < MAX_BOTS) {
        activeBotsCount++;
        // remove from availableDesiredSeats since it's already occupied
        availableDesiredSeats = availableDesiredSeats.filter(i => i !== idx);
      } else {
        // Kick bot out
        table.seats[idx].userId = null;
        table.seats[idx].isReady = false;
        table.seats[idx].hand = null;
      }
    });

    // Secondly, assign new bots to remaining desired target seats up to MAX_BOTS
    for (const seatIdx of availableDesiredSeats) {
        if (activeBotsCount >= MAX_BOTS) break;
        if (table.seats[seatIdx].userId !== null) continue; // safety check

        // Find an unused bot ID
        const unusedBotId = BOT_USER_IDS.find(id => !table.seats.some(s => s.userId === id)) || `bot_${Math.random().toString(36).substring(7)}`;
        
        table.seats[seatIdx].userId = unusedBotId;
        table.seats[seatIdx].isReady = false; // Wait for real player to click Deal
        table.seats[seatIdx].hand = null;

        if (!table.userBalances) table.userBalances = {};
        if (!table.userBalances[unusedBotId]) {
            table.userBalances[unusedBotId] = { balance: 5000, initialBuyIn: 5000 };
        }
        activeBotsCount++;
    }
  },

  // Called when the real player clicks Deal to start a round, so companion bots participate
  prepareBotsForDeal(table: Table) {
    if (table.houseId === 'system') return;
    table.seats.forEach(s => {
      if (s.userId && s.userId.startsWith('bot_')) {
        s.isReady = true;
        s.hand = {
          cards: [],
          bet: table.settings.minBet,
          status: 'playing',
          score: 0
        };
        if (!table.userBalances) table.userBalances = {};
        if (!table.userBalances[s.userId]) {
          table.userBalances[s.userId] = { balance: 5000, initialBuyIn: 5000 };
        }
        table.userBalances[s.userId].balance -= table.settings.minBet;
      }
    });
  },

  handleRoundEnd(table: Table) {
    // Reset bots to not ready so they don't auto-start games without the human player
    table.seats.forEach(s => {
      if (s.userId && s.userId.startsWith('bot_')) {
        s.isReady = false;
      }
    });
  }
};
