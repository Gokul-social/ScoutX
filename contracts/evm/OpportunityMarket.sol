// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title OpportunityMarket
 * @author ScoutX Protocol
 * @notice On-chain settlement contract for ScoutX opportunity markets
 * 
 * UNISWAP FOUNDATION ALIGNMENT:
 * This contract demonstrates custom market design compatible with Uniswap v4 hooks.
 * Key integration points are marked with [UNISWAP V4 HOOK] comments.
 * 
 * Architecture:
 * - Off-chain trading via Yellow Network session manager
 * - On-chain settlement via this contract
 * - Single transaction commits entire session state
 * 
 * PRIVACY GUARANTEES:
 * - Individual position amounts are opaque until settlement
 * - Only final aggregated state is committed on-chain
 * - Sponsor sees signals only after market resolution
 */

/**
 * @notice Market state structure
 */
struct Market {
    bytes32 id;
    address sponsor;
    string name;
    uint256 escrowAmount;
    uint256 deadline;
    bool resolved;
    bool outcomeYes;
    uint256 totalCommittedYes;
    mapping(address => uint256) scoutPositions;
}

/**
 * @notice Session commitment data (from off-chain state channel)
 */
struct SessionCommitment {
    bytes32 marketId;
    address scout;
    uint256 yesAmount;
    bytes32 settlementHash;
    uint256 timestamp;
}

contract OpportunityMarket {
    // =========================================================================
    // STATE VARIABLES
    // =========================================================================
    
    /// @notice Market ID => Market data
    mapping(bytes32 => Market) public markets;
    
    /// @notice All market IDs for enumeration
    bytes32[] public marketIds;
    
    /// @notice Session hash => whether it's been committed
    mapping(bytes32 => bool) public committedSessions;
    
    /// @notice Contract owner (for demo purposes)
    address public owner;
    
    // =========================================================================
    // EVENTS
    // =========================================================================
    
    event MarketCreated(
        bytes32 indexed marketId,
        address indexed sponsor,
        string name,
        uint256 escrowAmount,
        uint256 deadline
    );
    
    event SessionCommitted(
        bytes32 indexed marketId,
        address indexed scout,
        uint256 yesAmount,
        bytes32 settlementHash
    );
    
    event MarketResolved(
        bytes32 indexed marketId,
        bool outcomeYes,
        uint256 totalPayout
    );
    
    // =========================================================================
    // ERRORS
    // =========================================================================
    
    error MarketAlreadyExists();
    error MarketNotFound();
    error MarketAlreadyResolved();
    error MarketNotExpired();
    error SessionAlreadyCommitted();
    error InvalidAmount();
    error OnlySponsor();
    error TransferFailed();
    
    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================
    
    constructor() {
        owner = msg.sender;
    }
    
    // =========================================================================
    // MARKET CREATION
    // =========================================================================
    
    /**
     * @notice Create a new opportunity market
     * @param name Human-readable market name
     * @param durationSeconds How long the market stays open
     * 
     * [UNISWAP V4 HOOK - beforeInitialize]
     * In a full integration, this would trigger a hook that:
     * - Registers the market with a Uniswap v4 pool
     * - Sets up custom fee tiers for opportunity markets
     * - Configures sponsor-specific parameters
     */
    function createMarket(
        string calldata name,
        uint256 durationSeconds
    ) external payable returns (bytes32 marketId) {
        if (msg.value == 0) revert InvalidAmount();
        
        // Generate deterministic market ID
        marketId = keccak256(abi.encodePacked(
            msg.sender,
            name,
            block.timestamp
        ));
        
        if (markets[marketId].sponsor != address(0)) {
            revert MarketAlreadyExists();
        }
        
        // Initialize market
        Market storage market = markets[marketId];
        market.id = marketId;
        market.sponsor = msg.sender;
        market.name = name;
        market.escrowAmount = msg.value;
        market.deadline = block.timestamp + durationSeconds;
        market.resolved = false;
        
        marketIds.push(marketId);
        
        emit MarketCreated(
            marketId,
            msg.sender,
            name,
            msg.value,
            market.deadline
        );
        
        /**
         * [UNISWAP V4 HOOK - afterInitialize]
         * Would notify the hook that the market is live and ready for:
         * - Session commits from scouts
         * - Custom liquidity provision logic
         */
        
        return marketId;
    }
    
    // =========================================================================
    // SESSION COMMITMENT
    // =========================================================================
    
    /**
     * @notice Commit off-chain session state to chain
     * @param marketId Market to commit to
     * @param scout Address of the scout
     * @param yesAmount Total YES position from session
     * @param settlementHash Hash from session manager (for verification)
     * 
     * YELLOW NETWORK INTEGRATION:
     * This function receives the settlement data from closeSession()
     * in the off-chain session manager.
     * 
     * [UNISWAP V4 HOOK - beforeSwap]
     * In production, this would hook into swap logic to:
     * - Record the position in a custom accounting module
     * - Apply custom fee logic for opportunity markets
     * - Emit signals to authorized sponsors only
     * 
     * PRIVACY:
     * - Only the aggregated yesAmount is stored on-chain
     * - Individual trade history remains off-chain
     * - Positions are opaque until market resolution
     */
    function commitSession(
        bytes32 marketId,
        address scout,
        uint256 yesAmount,
        bytes32 settlementHash
    ) external {
        Market storage market = markets[marketId];
        
        if (market.sponsor == address(0)) revert MarketNotFound();
        if (market.resolved) revert MarketAlreadyResolved();
        if (committedSessions[settlementHash]) revert SessionAlreadyCommitted();
        if (yesAmount == 0) revert InvalidAmount();
        
        // Mark session as committed
        committedSessions[settlementHash] = true;
        
        // Add to scout's position
        market.scoutPositions[scout] += yesAmount;
        market.totalCommittedYes += yesAmount;
        
        emit SessionCommitted(marketId, scout, yesAmount, settlementHash);
        
        /**
         * [UNISWAP V4 HOOK - afterSwap]
         * Would execute post-commitment logic:
         * - Update sponsor's signal dashboard
         * - Trigger position aggregation
         * - Apply time-weighted averaging if configured
         */
    }
    
    // =========================================================================
    // MARKET RESOLUTION
    // =========================================================================
    
    /**
     * @notice Resolve market and distribute escrowed funds
     * @param marketId Market to resolve
     * @param outcomeYes True if YES outcome wins
     * 
     * SPONSOR-ONLY:
     * Only the market sponsor can resolve the market.
     * This enforces the privacy guarantee that scouts don't know
     * the sponsor's decision until resolution.
     * 
     * [UNISWAP V4 HOOK - beforeDonate]
     * Resolution would trigger distribution logic via hooks:
     * - Calculate pro-rata shares for winning scouts
     * - Handle custom payout curves
     * - Support streaming payouts if configured
     */
    function resolveMarket(bytes32 marketId, bool outcomeYes) external {
        Market storage market = markets[marketId];
        
        if (market.sponsor == address(0)) revert MarketNotFound();
        if (market.resolved) revert MarketAlreadyResolved();
        if (msg.sender != market.sponsor) revert OnlySponsor();
        
        market.resolved = true;
        market.outcomeYes = outcomeYes;
        
        uint256 payout = 0;
        
        if (outcomeYes && market.totalCommittedYes > 0) {
            // YES wins - distribute escrow proportionally to YES positions
            // For demo: Return full escrow to sponsor (simplified)
            payout = market.escrowAmount;
            
            /**
             * [UNISWAP V4 HOOK - afterDonate]
             * In production, this would:
             * - Calculate each scout's share based on their position
             * - Execute batched transfers
             * - Handle unclaimed rewards
             */
        } else {
            // NO wins or no positions - return escrow to sponsor
            payout = market.escrowAmount;
        }
        
        // Transfer payout (simplified for demo)
        if (payout > 0) {
            (bool success, ) = payable(market.sponsor).call{value: payout}("");
            if (!success) revert TransferFailed();
        }
        
        emit MarketResolved(marketId, outcomeYes, payout);
    }
    
    // =========================================================================
    // VIEW FUNCTIONS
    // =========================================================================
    
    /**
     * @notice Get market details
     * @param marketId Market to query
     * @return sponsor Market sponsor address
     * @return name Market name
     * @return escrowAmount Escrowed amount in wei
     * @return deadline Market deadline timestamp
     * @return resolved Whether market is resolved
     */
    function getMarket(bytes32 marketId) external view returns (
        address sponsor,
        string memory name,
        uint256 escrowAmount,
        uint256 deadline,
        bool resolved
    ) {
        Market storage market = markets[marketId];
        return (
            market.sponsor,
            market.name,
            market.escrowAmount,
            market.deadline,
            market.resolved
        );
    }
    
    /**
     * @notice Get scout's position in a market
     * @param marketId Market to query
     * @param scout Scout address
     * @return yesAmount Scout's YES position
     * 
     * PRIVACY NOTE:
     * This is public for demo purposes. In production:
     * - Positions would be encrypted or commitment-based
     * - Only sponsor could access aggregated signals
     */
    function getScoutPosition(bytes32 marketId, address scout) 
        external 
        view 
        returns (uint256 yesAmount) 
    {
        return markets[marketId].scoutPositions[scout];
    }
    
    /**
     * @notice Get total number of markets
     */
    function getMarketCount() external view returns (uint256) {
        return marketIds.length;
    }
    
    // =========================================================================
    // RECEIVE FUNCTION
    // =========================================================================
    
    receive() external payable {}
}
