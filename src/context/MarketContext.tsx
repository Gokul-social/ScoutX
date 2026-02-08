/**
 * Market Context
 * ==============
 * Global market state management with localStorage persistence
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { markets as initialMarkets, type Market } from '@/data/markets';

// Storage key
const STORAGE_KEY = 'scoutx_user_markets';

// Context interface
interface MarketContextType {
  markets: Market[];
  addMarket: (market: Omit<Market, 'id'>) => void;
  getMarketById: (id: string) => Market | undefined;
}

// Create context
const MarketContext = createContext<MarketContextType | undefined>(undefined);

// Helper to generate unique ID
const generateId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Load user markets from localStorage
const loadUserMarkets = (): Market[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save user markets to localStorage
const saveUserMarkets = (markets: Market[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(markets));
  } catch (error) {
    console.error('Failed to save markets to localStorage:', error);
  }
};

// Market Provider component
export const MarketProvider = ({ children }: { children: ReactNode }) => {
  const [userMarkets, setUserMarkets] = useState<Market[]>(() => loadUserMarkets());

  // Combine initial markets with user-created markets
  const allMarkets = [...initialMarkets, ...userMarkets];

  // Persist user markets to localStorage when they change
  useEffect(() => {
    saveUserMarkets(userMarkets);
  }, [userMarkets]);

  // Add a new market
  const addMarket = (marketData: Omit<Market, 'id'>) => {
    const newMarket: Market = {
      ...marketData,
      id: generateId(),
    };
    setUserMarkets((prev) => [...prev, newMarket]);
  };

  // Get market by ID
  const getMarketById = (id: string): Market | undefined => {
    return allMarkets.find((m) => m.id === id);
  };

  return (
    <MarketContext.Provider
      value={{
        markets: allMarkets,
        addMarket,
        getMarketById,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

// Custom hook to use market context
export const useMarkets = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarkets must be used within a MarketProvider');
  }
  return context;
};
