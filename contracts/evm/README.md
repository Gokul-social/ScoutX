# ScoutX Contracts — Uniswap Foundation Alignment

## 🦄 Prize Category: Uniswap Foundation

This contract implements the on-chain settlement layer for ScoutX, designed for **Uniswap v4 hook integration**.

---

## Architecture Mapping

| ScoutX Function | Uniswap v4 Hook Point |
|-----------------|----------------------|
| `createMarket()` | `beforeInitialize` / `afterInitialize` |
| `commitSession()` | `beforeSwap` / `afterSwap` |
| `resolveMarket()` | `beforeDonate` / `afterDonate` |

---

## Key Features

### 1. Custom Market Design
- Opportunity markets (not traditional trading pairs)
- YES-only positions (no complex AMM math)
- Sponsor-controlled resolution

### 2. Session Settlement
- Accepts final state from off-chain session manager
- Single transaction commits entire trading session
- Settlement hash prevents replay

### 3. Privacy-Preserving
- Only aggregated positions on-chain
- Individual trades remain off-chain
- Outcomes opaque until sponsor resolution

---

## Uniswap v4 Integration Points

Each hook point is clearly marked in the contract with `[UNISWAP V4 HOOK]` comments:

```solidity
// [UNISWAP V4 HOOK - beforeInitialize]
// Would register market with v4 pool...

// [UNISWAP V4 HOOK - beforeSwap]
// Would record position in custom module...
```

---

## Usage Flow

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Sponsor calls   │────▶│  Scouts trade    │────▶│  Sponsor calls   │
│  createMarket()  │     │  (off-chain)     │     │  resolveMarket() │
│  + escrow        │     │                  │     │  + payout        │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  commitSession() │
                         │  (on-chain)      │
                         └──────────────────┘
```

---

## Demo Readiness

✅ No AMM math (simple escrow model)  
✅ Yes-only positions  
✅ Hook points documented  
✅ Readable by judges  
