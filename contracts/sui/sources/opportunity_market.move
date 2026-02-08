/// ScoutX Opportunity Market — Sui Move Module
/// ==========================================
/// 
/// SUI ALIGNMENT:
/// This module implements opportunity markets using Sui's object-centric model.
/// Key advantages over traditional EVM:
/// - Parallel transaction execution
/// - Object ownership for natural access control  
/// - Shared objects for market state
/// 
/// DEEPBOOK COMPATIBILITY:
/// Comments indicate where DeepBook integration would enhance functionality.
/// While this is a standalone market module, the patterns are compatible
/// with DeepBook's order book infrastructure.

module scoutx::opportunity_market {
    // =========================================================================
    // IMPORTS
    // =========================================================================
    
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};
    
    // =========================================================================
    // ERROR CODES
    // =========================================================================
    
    /// Market has already been resolved
    const EMarketResolved: u64 = 0;
    /// Only sponsor can perform this action
    const ENotSponsor: u64 = 1;
    /// Invalid amount provided
    const EInvalidAmount: u64 = 2;
    /// Session already committed
    const ESessionCommitted: u64 = 3;
    /// Market deadline not reached
    const EDeadlineNotReached: u64 = 4;
    
    // =========================================================================
    // OBJECTS
    // =========================================================================
    
    /// Main market object — shared for scout access
    /// 
    /// SUI OBJECT MODEL:
    /// Markets are shared objects that multiple scouts can interact with.
    /// This enables parallel position commits while maintaining consistency.
    /// 
    /// [DEEPBOOK INTEGRATION POINT]
    /// In production, this could wrap a DeepBook Pool for:
    /// - Order book style position management
    /// - Price discovery through limit orders
    /// - Automatic matching of opposing views
    struct Market has key {
        id: UID,
        /// Market name
        name: vector<u8>,
        /// Sponsor address
        sponsor: address,
        /// Escrowed funds in SUI
        escrow: Balance<SUI>,
        /// Deadline timestamp (ms)
        deadline: u64,
        /// Whether market is resolved
        resolved: bool,
        /// Resolution outcome (if resolved)
        outcome_yes: bool,
        /// Scout positions: scout address => YES amount
        positions: Table<address, u64>,
        /// Committed session hashes (to prevent replay)
        committed_sessions: Table<vector<u8>, bool>,
        /// Total committed YES amount
        total_yes: u64,
    }
    
    /// Scout position receipt — owned object
    /// 
    /// SUI OWNERSHIP:
    /// Each scout receives an owned object representing their position.
    /// This enables parallel claiming during resolution.
    struct PositionReceipt has key, store {
        id: UID,
        market_id: ID,
        scout: address,
        yes_amount: u64,
        committed_at: u64,
    }
    
    // =========================================================================
    // EVENTS
    // =========================================================================
    
    struct MarketCreated has copy, drop {
        market_id: ID,
        sponsor: address,
        name: vector<u8>,
        escrow_amount: u64,
        deadline: u64,
    }
    
    struct PositionCommitted has copy, drop {
        market_id: ID,
        scout: address,
        yes_amount: u64,
        session_hash: vector<u8>,
    }
    
    struct MarketResolved has copy, drop {
        market_id: ID,
        outcome_yes: bool,
        total_payout: u64,
    }
    
    // =========================================================================
    // PUBLIC ENTRY FUNCTIONS
    // =========================================================================
    
    /// Create a new opportunity market
    /// 
    /// SUI PARALLEL EXECUTION:
    /// Market creation is an independent transaction that doesn't
    /// conflict with other market operations, enabling parallel processing.
    /// 
    /// @param name - Market name as bytes
    /// @param duration_ms - How long market stays open (milliseconds)
    /// @param escrow - SUI coin to lock as escrow
    /// @param clock - Sui Clock for timestamping
    public entry fun create_market(
        name: vector<u8>,
        duration_ms: u64,
        escrow: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let escrow_amount = coin::value(&escrow);
        assert!(escrow_amount > 0, EInvalidAmount);
        
        let current_time = clock::timestamp_ms(clock);
        let deadline = current_time + duration_ms;
        
        let market = Market {
            id: object::new(ctx),
            name,
            sponsor: tx_context::sender(ctx),
            escrow: coin::into_balance(escrow),
            deadline,
            resolved: false,
            outcome_yes: false,
            positions: table::new(ctx),
            committed_sessions: table::new(ctx),
            total_yes: 0,
        };
        
        let market_id = object::uid_to_inner(&market.id);
        
        event::emit(MarketCreated {
            market_id,
            sponsor: tx_context::sender(ctx),
            name: market.name,
            escrow_amount,
            deadline,
        });
        
        // Share market for scout access
        // [DEEPBOOK INTEGRATION]
        // Would also initialize a DeepBook pool for price discovery
        transfer::share_object(market);
    }
    
    /// Commit off-chain session position to market
    /// 
    /// YELLOW NETWORK BRIDGE:
    /// This receives settlement data from the off-chain session manager.
    /// The session_hash prevents replay of the same session.
    /// 
    /// PRIVACY:
    /// - Only aggregated position is stored on-chain
    /// - Individual trades remain in off-chain session
    /// 
    /// [DEEPBOOK INTEGRATION]
    /// Could submit as a limit order to the DeepBook pool instead,
    /// enabling price discovery among scouts.
    public entry fun commit_position(
        market: &mut Market,
        yes_amount: u64,
        session_hash: vector<u8>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate market state
        assert!(!market.resolved, EMarketResolved);
        assert!(yes_amount > 0, EInvalidAmount);
        assert!(!table::contains(&market.committed_sessions, session_hash), ESessionCommitted);
        
        let scout = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);
        
        // Record session as committed
        table::add(&mut market.committed_sessions, session_hash, true);
        
        // Update or create position
        if (table::contains(&market.positions, scout)) {
            let existing = table::borrow_mut(&mut market.positions, scout);
            *existing = *existing + yes_amount;
        } else {
            table::add(&mut market.positions, scout, yes_amount);
        };
        
        market.total_yes = market.total_yes + yes_amount;
        
        // Create position receipt for scout
        let receipt = PositionReceipt {
            id: object::new(ctx),
            market_id: object::uid_to_inner(&market.id),
            scout,
            yes_amount,
            committed_at: current_time,
        };
        
        event::emit(PositionCommitted {
            market_id: object::uid_to_inner(&market.id),
            scout,
            yes_amount,
            session_hash,
        });
        
        transfer::transfer(receipt, scout);
    }
    
    /// Resolve market and distribute funds
    /// 
    /// SPONSOR-ONLY:
    /// Only the market sponsor can resolve.
    /// This maintains privacy until the sponsor reveals their decision.
    /// 
    /// SUI PARALLEL EXECUTION:
    /// Resolution is a single transaction that finalizes state.
    /// Subsequent claims can happen in parallel.
    public entry fun resolve_market(
        market: &mut Market,
        outcome_yes: bool,
        ctx: &mut TxContext
    ) {
        // Validate
        assert!(!market.resolved, EMarketResolved);
        assert!(tx_context::sender(ctx) == market.sponsor, ENotSponsor);
        
        market.resolved = true;
        market.outcome_yes = outcome_yes;
        
        let total_payout = balance::value(&market.escrow);
        
        // For demo: transfer all escrow back to sponsor
        // In production: distribute proportionally to winning scouts
        if (total_payout > 0) {
            let payout_coin = coin::from_balance(
                balance::withdraw_all(&mut market.escrow),
                ctx
            );
            transfer::public_transfer(payout_coin, market.sponsor);
        };
        
        event::emit(MarketResolved {
            market_id: object::uid_to_inner(&market.id),
            outcome_yes,
            total_payout,
        });
    }
    
    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================
    
    /// Get market escrow amount
    public fun get_escrow_amount(market: &Market): u64 {
        balance::value(&market.escrow)
    }
    
    /// Check if market is resolved
    public fun is_resolved(market: &Market): bool {
        market.resolved
    }
    
    /// Get total YES positions
    public fun get_total_yes(market: &Market): u64 {
        market.total_yes
    }
    
    /// Get market deadline
    public fun get_deadline(market: &Market): u64 {
        market.deadline
    }
    
    /// Get market sponsor
    public fun get_sponsor(market: &Market): address {
        market.sponsor
    }
}
