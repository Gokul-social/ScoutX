/**
 * Session Manager Tests
 * =====================
 * Unit tests for the Yellow Network session manager.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
    openSession,
    placeTrade,
    closeSession,
    getSession,
    getSessionsByMarket,
    clearAllSessions,
} from '../../backend/sessionManager';

describe('SessionManager', () => {
    beforeEach(() => {
        // Clear all sessions before each test
        clearAllSessions();
    });

    describe('openSession', () => {
        it('should create a new session with correct properties', () => {
            const session = openSession('market-1', '1000');

            expect(session.id).toMatch(/^session_/);
            expect(session.marketId).toBe('market-1');
            expect(session.depositAmount).toBe('1000');
            expect(session.status).toBe('open');
            expect(session.trades).toHaveLength(0);
            expect(session.totalYesAmount).toBe('0');
        });

        it('should throw error for invalid market ID', () => {
            expect(() => openSession('', '1000')).toThrow('Market ID is required');
        });

        it('should throw error for invalid deposit amount', () => {
            expect(() => openSession('market-1', '0')).toThrow('Deposit amount must be a positive number');
            expect(() => openSession('market-1', '-100')).toThrow('Deposit amount must be a positive number');
            expect(() => openSession('market-1', 'invalid')).toThrow('Deposit amount must be a positive number');
        });
    });

    describe('placeTrade', () => {
        it('should add trade to session', () => {
            const session = openSession('market-1', '1000');
            const updated = placeTrade(session.id, '250');

            expect(updated.trades).toHaveLength(1);
            expect(updated.trades[0].yesAmount).toBe('250');
            expect(updated.trades[0].nonce).toBe(1);
            expect(updated.totalYesAmount).toBe('250');
        });

        it('should accumulate multiple trades', () => {
            const session = openSession('market-1', '1000');
            placeTrade(session.id, '250');
            placeTrade(session.id, '150');
            const updated = placeTrade(session.id, '100');

            expect(updated.trades).toHaveLength(3);
            expect(updated.totalYesAmount).toBe('500');
        });

        it('should throw error if trade exceeds deposit', () => {
            const session = openSession('market-1', '100');
            expect(() => placeTrade(session.id, '150')).toThrow('Trade would exceed deposit');
        });

        it('should throw error for closed session', () => {
            const session = openSession('market-1', '1000');
            closeSession(session.id);
            expect(() => placeTrade(session.id, '100')).toThrow('is closed');
        });
    });

    describe('closeSession', () => {
        it('should close session and return settlement data', () => {
            const session = openSession('market-1', '1000');
            placeTrade(session.id, '500');

            const settlement = closeSession(session.id);

            expect(settlement.sessionId).toBe(session.id);
            expect(settlement.marketId).toBe('market-1');
            expect(settlement.totalYesAmount).toBe('500');
            expect(settlement.settlementHash).toMatch(/^0x/);
            expect(settlement.closedAt).toBeGreaterThan(0);
        });

        it('should update session status to closed', () => {
            const session = openSession('market-1', '1000');
            closeSession(session.id);

            const updated = getSession(session.id);
            expect(updated?.status).toBe('closed');
        });

        it('should throw error for already closed session', () => {
            const session = openSession('market-1', '1000');
            closeSession(session.id);
            expect(() => closeSession(session.id)).toThrow('already closed');
        });
    });

    describe('getSessionsByMarket', () => {
        it('should return sessions for specific market', () => {
            openSession('market-1', '1000');
            openSession('market-1', '500');
            openSession('market-2', '200');

            const market1Sessions = getSessionsByMarket('market-1');
            expect(market1Sessions).toHaveLength(2);

            const market2Sessions = getSessionsByMarket('market-2');
            expect(market2Sessions).toHaveLength(1);
        });
    });
});
