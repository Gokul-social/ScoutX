/**
 * ScoutX Session Manager
 * ======================
 * Off-chain trading session management for opportunity markets.
 * 
 * YELLOW NETWORK ALIGNMENT:
 * This module implements a local simulation of Yellow Network's Nitrolite
 * state channel architecture. Key mappings:
 * 
 * - openSession()  → Opening a state channel with initial deposit
 * - placeTrade()   → Off-chain state transition (no on-chain tx needed)
 * - closeSession() → Closing channel and preparing settlement hash
 * 
 * The session manager enables:
 * 1. One deposit per session (channel funding)
 * 2. Multiple off-chain trades (instant, gasless)
 * 3. Final settlement commit (single on-chain tx)
 * 
 * PRIVACY GUARANTEES:
 * - Trade amounts are stored locally only
 * - No public price exposure until settlement
 * - Sponsor-only signal access enforced at UI layer
 */

import type { Session, Trade, SettlementData, SessionStatus } from './types';

// ============================================================================
// STORAGE LAYER
// Uses localStorage for persistence across page reloads.
// In production, this would be backed by encrypted local storage or 
// a secure enclave for key material.
// ============================================================================

const STORAGE_KEY = 'scoutx_sessions';

/**
 * Load all sessions from browser storage.
 * @returns Map of session ID to Session object
 */
function loadSessions(): Map<string, Session> {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return new Map();

        const parsed = JSON.parse(stored) as [string, Session][];
        return new Map(parsed);
    } catch {
        // If storage is corrupted, start fresh
        console.warn('[SessionManager] Failed to load sessions, starting fresh');
        return new Map();
    }
}

/**
 * Persist all sessions to browser storage.
 */
function saveSessions(sessions: Map<string, Session>): void {
    try {
        const serialized = JSON.stringify(Array.from(sessions.entries()));
        localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
        console.error('[SessionManager] Failed to save sessions:', error);
    }
}

// In-memory cache, synced with localStorage
let sessionsCache: Map<string, Session> = loadSessions();

// ============================================================================
// CRYPTOGRAPHIC UTILITIES
// Simulated cryptographic operations for demo purposes.
// YELLOW NETWORK: In production, these would use actual wallet signatures.
// ============================================================================

/**
 * Generate a deterministic "signature" for a trade.
 * MOCK: Uses simple hashing instead of actual cryptographic signing.
 * 
 * @param sessionId - Session identifier
 * @param nonce - Trade sequence number
 * @param amount - Trade amount
 * @returns Simulated signature hash
 */
function simulateSignature(sessionId: string, nonce: number, amount: string): string {
    // Simple deterministic hash for demo
    const data = `${sessionId}:${nonce}:${amount}:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
}

/**
 * Generate a unique session ID.
 * Uses timestamp + random for uniqueness.
 */
function generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `session_${timestamp}_${random}`;
}

/**
 * Generate settlement hash for on-chain commit.
 * YELLOW NETWORK: This represents the final state hash that would be 
 * submitted to the settlement contract.
 * 
 * @param session - Complete session data
 * @returns Deterministic settlement hash
 */
function generateSettlementHash(session: Session): string {
    const data = JSON.stringify({
        id: session.id,
        marketId: session.marketId,
        scout: session.scoutAddress,
        total: session.totalYesAmount,
        trades: session.trades.length,
        closed: session.closedAt,
    });

    // Simple hash for demo
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        hash = ((hash << 5) - hash) + data.charCodeAt(i);
        hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
}

// ============================================================================
// PUBLIC API
// Core session management functions exposed to the frontend.
// ============================================================================

/**
 * Open a new trading session for a market.
 * 
 * YELLOW NETWORK ALIGNMENT:
 * This is equivalent to opening a state channel and funding it with
 * an initial deposit. The deposit is locked off-chain until settlement.
 * 
 * @param marketId - Market to trade on
 * @param depositAmount - Initial USDC deposit (as string for precision)
 * @param scoutAddress - Scout's wallet address (optional, uses mock if not provided)
 * @returns The created session object
 * @throws Error if marketId or depositAmount is invalid
 */
export function openSession(
    marketId: string,
    depositAmount: string,
    scoutAddress: string = '0x1a2B...9f4E'
): Session {
    // Validate inputs
    if (!marketId || marketId.trim() === '') {
        throw new Error('Market ID is required');
    }

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Deposit amount must be a positive number');
    }

    const session: Session = {
        id: generateSessionId(),
        marketId: marketId.trim(),
        scoutAddress,
        depositAmount: depositAmount,
        status: 'open',
        trades: [],
        totalYesAmount: '0',
        createdAt: Date.now(),
    };

    // Persist session
    sessionsCache.set(session.id, session);
    saveSessions(sessionsCache);

    console.log(`[SessionManager] Opened session ${session.id} for market ${marketId}`);
    return session;
}

/**
 * Place an off-chain trade within a session.
 * 
 * YELLOW NETWORK ALIGNMENT:
 * This represents an off-chain state transition. No on-chain transaction
 * is required - the trade is recorded locally and signed (simulated).
 * This enables instant, gasless trading during the session.
 * 
 * PRIVACY: Trade amounts are only visible locally. The sponsor cannot
 * see individual trade amounts until settlement.
 * 
 * @param sessionId - Session to trade in
 * @param yesAmount - Amount to add to YES position
 * @returns Updated session object
 * @throws Error if session doesn't exist, is closed, or amount is invalid
 */
export function placeTrade(sessionId: string, yesAmount: string): Session {
    const session = sessionsCache.get(sessionId);

    if (!session) {
        throw new Error(`Session ${sessionId} not found`);
    }

    if (session.status !== 'open') {
        throw new Error(`Session ${sessionId} is ${session.status}, cannot trade`);
    }

    const amount = parseFloat(yesAmount);
    if (isNaN(amount) || amount <= 0) {
        throw new Error('Trade amount must be a positive number');
    }

    // Check if trade exceeds deposit
    const currentTotal = parseFloat(session.totalYesAmount);
    const newTotal = currentTotal + amount;
    const deposit = parseFloat(session.depositAmount);

    if (newTotal > deposit) {
        throw new Error(`Trade would exceed deposit. Available: ${deposit - currentTotal}`);
    }

    // Create trade record
    const trade: Trade = {
        nonce: session.trades.length + 1,
        yesAmount: yesAmount,
        timestamp: Date.now(),
        signature: simulateSignature(sessionId, session.trades.length + 1, yesAmount),
    };

    // Update session
    session.trades.push(trade);
    session.totalYesAmount = newTotal.toString();

    // Persist
    saveSessions(sessionsCache);

    console.log(`[SessionManager] Trade #${trade.nonce} in session ${sessionId}: ${yesAmount} YES`);
    return { ...session };
}

/**
 * Close a session and prepare settlement data.
 * 
 * YELLOW NETWORK ALIGNMENT:
 * This closes the state channel and generates the final state hash
 * for on-chain settlement. After closing:
 * - No more trades can be placed
 * - Settlement data is ready for OpportunityMarket.commitSession()
 * 
 * @param sessionId - Session to close
 * @returns Settlement data ready for on-chain commit
 * @throws Error if session doesn't exist or is already closed
 */
export function closeSession(sessionId: string): SettlementData {
    const session = sessionsCache.get(sessionId);

    if (!session) {
        throw new Error(`Session ${sessionId} not found`);
    }

    if (session.status !== 'open') {
        throw new Error(`Session ${sessionId} is already ${session.status}`);
    }

    // Close session
    session.status = 'closed';
    session.closedAt = Date.now();
    session.settlementHash = generateSettlementHash(session);

    // Persist
    saveSessions(sessionsCache);

    console.log(`[SessionManager] Closed session ${sessionId}, hash: ${session.settlementHash}`);

    // Return settlement data for on-chain commit
    return {
        sessionId: session.id,
        marketId: session.marketId,
        scoutAddress: session.scoutAddress,
        totalYesAmount: session.totalYesAmount,
        settlementHash: session.settlementHash,
        closedAt: session.closedAt,
    };
}

/**
 * Get a session by ID.
 * 
 * @param sessionId - Session to retrieve
 * @returns Session object or undefined if not found
 */
export function getSession(sessionId: string): Session | undefined {
    const session = sessionsCache.get(sessionId);
    return session ? { ...session } : undefined;
}

/**
 * Get all sessions for a specific market.
 * 
 * @param marketId - Market to filter by
 * @returns Array of sessions for the market
 */
export function getSessionsByMarket(marketId: string): Session[] {
    return Array.from(sessionsCache.values())
        .filter(s => s.marketId === marketId)
        .map(s => ({ ...s }));
}

/**
 * Get all open sessions.
 * 
 * @returns Array of sessions with status 'open'
 */
export function getOpenSessions(): Session[] {
    return Array.from(sessionsCache.values())
        .filter(s => s.status === 'open')
        .map(s => ({ ...s }));
}

/**
 * Clear all sessions (for testing/demo reset).
 * WARNING: This is destructive and cannot be undone.
 */
export function clearAllSessions(): void {
    sessionsCache.clear();
    localStorage.removeItem(STORAGE_KEY);
    console.log('[SessionManager] All sessions cleared');
}

/**
 * Mark a session as settled on-chain.
 * 
 * UNISWAP ALIGNMENT:
 * Called after OpportunityMarket.commitSession() succeeds on-chain.
 * Updates local state to reflect on-chain settlement.
 * 
 * @param sessionId - Session that was settled
 * @returns Updated session object
 * @throws Error if session doesn't exist or is not closed
 */
export function markAsSettled(sessionId: string): Session {
    const session = sessionsCache.get(sessionId);

    if (!session) {
        throw new Error(`Session ${sessionId} not found`);
    }

    if (session.status !== 'closed') {
        throw new Error(`Session ${sessionId} must be closed before settling`);
    }

    session.status = 'settled';
    saveSessions(sessionsCache);

    console.log(`[SessionManager] Session ${sessionId} marked as settled`);
    return { ...session };
}
