/**
 * ScoutX Backend Types
 * ====================
 * Type definitions for the off-chain session management system.
 * 
 * YELLOW NETWORK ALIGNMENT:
 * These types model the state channel architecture used in Nitrolite.
 * - Session = State Channel instance
 * - Trade = Off-chain state transition
 * - Settlement = Final on-chain commit
 */

/**
 * Represents a trading session for a specific market.
 * Maps to Yellow Network's state channel concept.
 */
export interface Session {
  /** Unique session identifier */
  id: string;
  
  /** Market ID this session operates on */
  marketId: string;
  
  /** Scout's wallet address (simulated) */
  scoutAddress: string;
  
  /** Initial deposit amount in USDC (as string for precision) */
  depositAmount: string;
  
  /** Current session status */
  status: SessionStatus;
  
  /** All trades made within this session */
  trades: Trade[];
  
  /** Total YES position accumulated */
  totalYesAmount: string;
  
  /** Session creation timestamp */
  createdAt: number;
  
  /** Session close timestamp (if closed) */
  closedAt?: number;
  
  /** 
   * Settlement hash for on-chain commit.
   * Generated when session is closed.
   * YELLOW NETWORK: This simulates the final state hash 
   * that would be submitted to the settlement contract.
   */
  settlementHash?: string;
}

export type SessionStatus = 'open' | 'closed' | 'settled';

/**
 * Represents a single off-chain trade within a session.
 * 
 * YELLOW NETWORK ALIGNMENT:
 * Each trade is an off-chain state transition that doesn't 
 * require on-chain confirmation until settlement.
 */
export interface Trade {
  /** Trade sequence number within session */
  nonce: number;
  
  /** YES amount for this trade */
  yesAmount: string;
  
  /** Timestamp of trade */
  timestamp: number;
  
  /**
   * Simulated wallet signature.
   * YELLOW NETWORK: In production, this would be an actual
   * cryptographic signature authorizing the state transition.
   */
  signature: string;
}

/**
 * Market interface matching frontend data structure.
 * Included for reference but NOT modified.
 */
export interface Market {
  id: string;
  name: string;
  description: string;
  sponsorType: 'VC' | 'DAO' | 'Label';
  escrowAmount: string;
  windowRemaining: string;
  sponsor: string;
}

/**
 * Result of closing a session, ready for on-chain settlement.
 * 
 * UNISWAP ALIGNMENT:
 * This structure contains all data needed for the 
 * OpportunityMarket.commitSession() call.
 */
export interface SettlementData {
  sessionId: string;
  marketId: string;
  scoutAddress: string;
  totalYesAmount: string;
  settlementHash: string;
  closedAt: number;
}
