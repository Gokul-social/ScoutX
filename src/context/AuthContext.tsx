/**
 * Authentication Context
 * ======================
 * Global authentication state management for demo user and wallet connection
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';

// Demo user data
const DEMO_USER = {
  address: '0xDemo...User',
  displayName: 'Demo User',
  balance: '1,000 USDC',
};

// Auth method types
type AuthMethod = 'demo' | 'wallet' | null;

// Context state interface
interface AuthContextType {
  isAuthenticated: boolean;
  authMethod: AuthMethod;
  user: {
    address: string;
    displayName: string;
    balance: string;
  } | null;
  loginAsDemo: () => void;
  loginWithWallet: () => void;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>(() => {
    // Check localStorage for persisted auth state
    const stored = localStorage.getItem('scoutx_auth_method');
    return (stored as AuthMethod) || null;
  });
  const [demoLoggedIn, setDemoLoggedIn] = useState(() => {
    return localStorage.getItem('scoutx_auth_method') === 'demo';
  });

  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  // Determine if user is authenticated
  const isAuthenticated = demoLoggedIn || isConnected;

  // Get user data based on auth method
  const user = isAuthenticated
    ? demoLoggedIn
      ? DEMO_USER
      : {
          address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '',
          displayName: 'Wallet User',
          balance: '-- USDC',
        }
    : null;

  // Login as demo user
  const loginAsDemo = () => {
    setAuthMethod('demo');
    setDemoLoggedIn(true);
    localStorage.setItem('scoutx_auth_method', 'demo');
  };

  // Login with wallet
  const loginWithWallet = () => {
    setAuthMethod('wallet');
    localStorage.setItem('scoutx_auth_method', 'wallet');
    open();
  };

  // Logout
  const logout = () => {
    setAuthMethod(null);
    setDemoLoggedIn(false);
    localStorage.removeItem('scoutx_auth_method');
  };

  // Sync wallet connection state
  useEffect(() => {
    if (isConnected && authMethod === 'wallet') {
      // Wallet connected successfully
    } else if (!isConnected && authMethod === 'wallet' && !demoLoggedIn) {
      // Wallet disconnected, clear auth
      setAuthMethod(null);
      localStorage.removeItem('scoutx_auth_method');
    }
  }, [isConnected, authMethod, demoLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authMethod: demoLoggedIn ? 'demo' : isConnected ? 'wallet' : null,
        user,
        loginAsDemo,
        loginWithWallet,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
