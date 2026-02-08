# ScoutX Backend — Yellow Network Alignment

## 🟡 Prize Category: Yellow Network

This module implements the off-chain session management layer for ScoutX, directly aligned with **Yellow Network's Nitrolite state channel architecture**.

---

## Architecture Mapping

| ScoutX Concept | Yellow Network Equivalent |
|----------------|---------------------------|
| `openSession()` | Open state channel + fund |
| `placeTrade()` | Off-chain state transition |
| `closeSession()` | Close channel + generate final hash |
| `settlementHash` | State commitment for on-chain settlement |
| Trade signatures | Cryptographic authorization of state changes |

---

## Key Features

### 1. One Deposit Per Session
- Session opens with a single deposit (channel funding)
- No additional on-chain transactions needed during trading
- Matches Nitrolite's funding model

### 2. Multiple Off-Chain Trades
- Trades are instant and gasless
- Each trade is signed (simulated) and sequenced with nonces
- Mirrors state channel's off-chain state transitions

### 3. Final Settlement Commit
- `closeSession()` generates a deterministic settlement hash
- This hash can be committed on-chain via `OpportunityMarket.commitSession()`
- Single on-chain transaction for entire session

---

## Privacy Guarantees

- **No public price reads**: Trade amounts stored in browser localStorage only
- **Sponsor-only signal access**: Enforced at UI layer
- **Opaque positions until settlement**: Individual trades not exposed until on-chain commit

---

## Usage

```typescript
import { openSession, placeTrade, closeSession } from './sessionManager';

// 1. Open session with deposit
const session = openSession('market-1', '1000');

// 2. Place multiple off-chain trades (instant)
placeTrade(session.id, '250');
placeTrade(session.id, '150');
placeTrade(session.id, '100');

// 3. Close session and get settlement data
const settlement = closeSession(session.id);
// → Ready for OpportunityMarket.commitSession()
```

---

## Files

- `types.ts` — TypeScript interfaces for sessions and trades
- `sessionManager.ts` — Core session management implementation

---

## Demo Readiness

✅ Local-first (browser storage)  
✅ Session-based (no server)  
✅ Deterministic state  
✅ Readable by judges  
