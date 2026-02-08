

# ScoutX — Opportunity Market Frontend

## Overview
A minimalist, dark-mode-first DeFi web application for "Opportunity Markets" — where sponsors post opportunities and scouts place private bets on outcomes. The design language is institutional, calm, and trust-forward, inspired by Paradigm research and Stripe's dashboard clarity.

---

## Design System

- **Theme**: Dark-mode by default with light-mode toggle
- **Palette**: Charcoal backgrounds, slate surfaces, off-white text, violet/electric blue accent for CTAs and interactive elements
- **Typography**: Inter font family — weight-based hierarchy (no color tricks), high contrast
- **Aesthetic**: No gradients, no heavy shadows, grid-based layouts, generous whitespace
- **Interactions**: Subtle hover states, no flashy animations, instant feedback patterns

---

## Pages & Sections

### 1. Landing Page (Home)

**Top Navigation Bar**
- "ScoutX" logo text (left)
- Nav links: Markets · Create Market · Docs
- Right side: "Connect Wallet" button (styled, non-functional placeholder) + Network indicator badge (e.g., "Ethereum Mainnet")

**Hero Section**
- Large headline: *"Private markets for discovering real-world opportunities."*
- Subtext: *"Bet on outcomes. Signal conviction. Get rewarded for being early."*
- Two CTAs: "Explore Markets" (primary violet button) and "Create Market" (ghost/outlined button)

**Live Opportunity Markets**
- Section title: "Live Opportunity Markets"
- Card-based grid layout (institutional feel), each card showing:
  - Market name
  - Sponsor type badge (VC, DAO, Label)
  - Opportunity window countdown timer
  - "Enter" action button
  - No prices shown (privacy by design)
- Static sample data (3–5 markets)

**How ScoutX Works**
- 3-step horizontal layout with icons/numbers:
  1. Sponsor posts opportunity + escrow
  2. Scouts place private bets instantly (off-chain)
  3. On-chain settlement when window closes
- Clean, minimal illustrations using Lucide icons

**Footer**
- Links: About · GitHub · Terms
- Small disclaimer text
- Minimal, single-line layout

---

### 2. Markets Page
- Full listing of all opportunity markets in a clean table/card view
- Filter/sort controls (by sponsor type, time remaining)
- Same card structure as the homepage section but expanded

### 3. Market Detail Page
- Market title + description
- Sponsor escrow amount displayed
- Opportunity window countdown (prominent timer)
- Trade panel card:
  - Amount input field (clean, minimal)
  - "Buy YES" button (violet accent)
  - Privacy note: *"Prices are visible only to the sponsor during the opportunity window."*
- Back navigation to markets list

### 4. Create Market Page
- Clean form layout:
  - Market title input
  - Description textarea
  - Escrow amount input
  - Opportunity window duration selector
  - "Create Market" submit button
- Form validation with inline feedback

---

## Navigation & Routing
- `/` — Landing page with hero, live markets, how it works
- `/markets` — Full markets listing
- `/markets/:id` — Market detail + trade panel
- `/create` — Create market form
- `/docs` — Placeholder docs page

---

## Key UX Details
- Dark mode toggle in the nav bar
- All interactions feel instant — no loading spinners
- Wallet connect button shows "Connect Wallet" → simulated connected state with truncated address
- Countdown timers display as static values (no live ticking needed)
- Responsive layout that works well on desktop and tablet
- All data is static/hardcoded — no backend, no randomness

