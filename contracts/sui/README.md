# ScoutX Contracts — Sui Alignment

## 🔵 Prize Category: Sui

This module implements opportunity markets using **Sui's object-centric model** with patterns compatible with **DeepBook**.

---

## Architecture Mapping

| ScoutX Concept | Sui Feature |
|----------------|-------------|
| Market | Shared Object |
| Scout Position | Owned Object (PositionReceipt) |
| Position Commit | Parallel Transaction |
| Resolution | Sponsor Access Control |

---

## Key Features

### 1. Object-Centric Design
- `Market` as shared object for multi-scout access
- `PositionReceipt` as owned object for scout claims
- Natural access control via object ownership

### 2. Parallel Execution
- Market creation doesn't block other markets
- Position commits can execute in parallel
- Claims after resolution are independent

### 3. DeepBook Compatibility
- Market structure compatible with pool wrapping
- Position commits could be limit orders
- Price discovery through order matching

---

## DeepBook Integration Points

Comments in the code mark integration opportunities:

```move
// [DEEPBOOK INTEGRATION]
// Would also initialize a DeepBook pool for price discovery

// [DEEPBOOK INTEGRATION]
// Could submit as a limit order to the DeepBook pool
```

---

## File Structure

```
contracts/sui/
├── Move.toml                           # Package manifest
├── sources/
│   └── opportunity_market.move         # Main module
└── README.md                           # This file
```

---

## Demo Readiness

✅ Simple readable logic  
✅ Market as Sui object  
✅ Escrow locked at creation  
✅ Settlement via entry function  
✅ DeepBook compatibility noted  
