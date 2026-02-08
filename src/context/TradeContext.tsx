/**
 * Trade Context
 * =============
 * Global trade state management with localStorage persistence
 * Manages trade execution, history, portfolio positions, and user balance
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Storage keys
const TRADES_STORAGE_KEY = 'scoutx_trades';
const BALANCE_STORAGE_KEY = 'scoutx_balance';

// Initial demo balance
const INITIAL_BALANCE = 10000;

// Maximum trade as percentage of escrow (10%)
export const MAX_TRADE_ESCROW_PERCENTAGE = 0.1;

// Trade status types
export type TradeStatus = 'pending' | 'confirmed' | 'failed';
export type TradeType = 'YES' | 'NO';

// Trade interface
export interface Trade {
  id: string;
  marketId: string;
  marketName: string;
  amount: number;
  type: TradeType;
  timestamp: number;
  status: TradeStatus;
}

// Position summary for a market
export interface Position {
  marketId: string;
  marketName: string;
  totalAmount: number;
  tradeCount: number;
}

// Context interface
interface TradeContextType {
  trades: Trade[];
  balance: number;
  executeTrade: (marketId: string, marketName: string, amount: number, type: TradeType) => Promise<Trade>;
  getTradesByMarket: (marketId: string) => Trade[];
  getPosition: (marketId: string) => Position | null;
  getAllPositions: () => Position[];
  getTotalInvested: () => number;
  getMaxTradeAmount: (escrowAmount: number) => number;
  resetBalance: () => void;
}

// Create context
const TradeContext = createContext<TradeContextType | undefined>(undefined);

// Helper to generate unique ID
const generateTradeId = (): string => {
  return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Load trades from localStorage
const loadTrades = (): Trade[] => {
  try {
    const stored = localStorage.getItem(TRADES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save trades to localStorage
const saveTrades = (trades: Trade[]): void => {
  try {
    localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
  } catch (error) {
    console.error('Failed to save trades to localStorage:', error);
  }
};

// Load balance from localStorage
const loadBalance = (): number => {
  try {
    const stored = localStorage.getItem(BALANCE_STORAGE_KEY);
    return stored ? parseFloat(stored) : INITIAL_BALANCE;
  } catch {
    return INITIAL_BALANCE;
  }
};

// Save balance to localStorage
const saveBalance = (balance: number): void => {
  try {
    localStorage.setItem(BALANCE_STORAGE_KEY, JSON.stringify(balance));
  } catch (error) {
    console.error('Failed to save balance to localStorage:', error);
  }
};

// Trade Provider component
export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>(() => loadTrades());
  const [balance, setBalance] = useState<number>(() => loadBalance());

  // Persist trades to localStorage when they change
  useEffect(() => {
    saveTrades(trades);
  }, [trades]);

  // Persist balance to localStorage when it changes
  useEffect(() => {
    saveBalance(balance);
  }, [balance]);

  // Calculate max trade amount based on escrow (10% of escrow)
  const getMaxTradeAmount = (escrowAmount: number): number => {
    const escrowLimit = escrowAmount * MAX_TRADE_ESCROW_PERCENTAGE;
    return Math.min(balance, escrowLimit);
  };

  // Execute a new trade
  const executeTrade = async (
    marketId: string,
    marketName: string,
    amount: number,
    type: TradeType
  ): Promise<Trade> => {
    // Verify sufficient balance
    if (amount > balance) {
      throw new Error('Insufficient balance');
    }

    // Deduct from balance immediately
    setBalance((prev) => prev - amount);

    // Create the trade with pending status
    const newTrade: Trade = {
      id: generateTradeId(),
      marketId,
      marketName,
      amount,
      type,
      timestamp: Date.now(),
      status: 'pending',
    };

    // Add to state immediately (optimistic update)
    setTrades((prev) => [newTrade, ...prev]);

    // Simulate blockchain confirmation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Update trade status to confirmed
    setTrades((prev) =>
      prev.map((t) =>
        t.id === newTrade.id ? { ...t, status: 'confirmed' as TradeStatus } : t
      )
    );

    return { ...newTrade, status: 'confirmed' };
  };

  // Get trades for a specific market
  const getTradesByMarket = (marketId: string): Trade[] => {
    return trades.filter((t) => t.marketId === marketId);
  };

  // Get position for a specific market
  const getPosition = (marketId: string): Position | null => {
    const marketTrades = trades.filter(
      (t) => t.marketId === marketId && t.status === 'confirmed'
    );

    if (marketTrades.length === 0) return null;

    const totalAmount = marketTrades.reduce((sum, t) => sum + t.amount, 0);

    return {
      marketId,
      marketName: marketTrades[0].marketName,
      totalAmount,
      tradeCount: marketTrades.length,
    };
  };

  // Get all positions
  const getAllPositions = (): Position[] => {
    const positionMap = new Map<string, Position>();

    trades
      .filter((t) => t.status === 'confirmed')
      .forEach((trade) => {
        const existing = positionMap.get(trade.marketId);
        if (existing) {
          existing.totalAmount += trade.amount;
          existing.tradeCount += 1;
        } else {
          positionMap.set(trade.marketId, {
            marketId: trade.marketId,
            marketName: trade.marketName,
            totalAmount: trade.amount,
            tradeCount: 1,
          });
        }
      });

    return Array.from(positionMap.values());
  };

  // Get total invested amount across all markets
  const getTotalInvested = (): number => {
    return trades
      .filter((t) => t.status === 'confirmed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Reset balance to initial amount
  const resetBalance = (): void => {
    setBalance(INITIAL_BALANCE);
  };

  return (
    <TradeContext.Provider
      value={{
        trades,
        balance,
        executeTrade,
        getTradesByMarket,
        getPosition,
        getAllPositions,
        getTotalInvested,
        getMaxTradeAmount,
        resetBalance,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

// Custom hook to use trade context
export const useTrades = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};

