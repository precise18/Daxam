// ============================================================
//  DAXUM — Solana Anchor Program
//  Solana Playground compatible (single-file)
//
//  Ports three Ethereum contracts:
//    • BlueBadge.sol   → blue_badge instructions
//    • OrangeBadge.sol → orange_badge instructions
//    • GameContract.sol → full challenge protocol
//
//  Deploy target: Solana Devnet (via Solana Playground)
// ============================================================

use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("11111111111111111111111111111111"); // Replace after first build in Playground

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const BLUE_BADGE_PRICE_LAMPORTS: u64 = 5_000_000;   // 0.005 SOL  ≈ BlueBadge MINT_PRICE
const ORANGE_BADGE_PRICE_LAMPORTS: u64 = 1_000_000; // 0.001 SOL  ≈ OrangeBadge MINT_PRICE
const REGISTER_TIME_LIMIT: i64 = 86_400;            // 1 day in seconds
const MAX_SEED_LEN: usize = 128;
const MAX_URI_LEN: usize = 200;
const MAX_FEE_PCT: u8 = 100;

// ─────────────────────────────────────────────
//  ERROR CODES
// ─────────────────────────────────────────────
#[error_code]
pub enum DaxumError {
    #[msg("Insufficient SOL sent for Blue Badge")]
    InsufficientBlueBadgePayment,
    #[msg("Incorrect SOL amount for Orange Badge (must be exact)")]
    IncorrectOrangeBadgePayment,
    #[msg("Token URI cannot be empty")]
    EmptyTokenUri,
    #[msg("Not the program authority")]
    NotAuthority,
    #[msg("Not a registered game publisher")]
    NotGamePublisher,
    #[msg("Game already registered")]
    GameAlreadyRegistered,
    #[msg("Invalid creator address")]
    InvalidCreator,
    #[msg("Challenge expiry is too soon (must be > now + 1 day)")]
    ExpiryTooSoon,
    #[msg("Must hold a Blue Badge to perform this action")]
    NoBlueBadge,
    #[msg("Number of players must be greater than zero")]
    ZeroPlayers,
    #[msg("Prize pool must be evenly divisible by number of players")]
    IndivisiblePrice,
    #[msg("Incorrect SOL sent for challenge creation")]
    IncorrectChallengeFund,
    #[msg("Challenge is not playable (finalized or cancelled)")]
    NotPlayable,
    #[msg("Challenge has expired")]
    ChallengeExpired,
    #[msg("Player has already accepted this challenge")]
    AlreadyAccepted,
    #[msg("Player limit has been reached")]
    PlayerLimitReached,
    #[msg("Incorrect SOL sent for challenge entry")]
    IncorrectEntryFee,
    #[msg("Player has not accepted this challenge")]
    NotAccepted,
    #[msg("Player has already played this challenge")]
    AlreadyPlayed,
    #[msg("Insufficient creator deposit remaining")]
    InsufficientCreatorDeposit,
    #[msg("Challenge is not yet expired")]
    NotYetExpired,
    #[msg("Challenge already finalized")]
    AlreadyFinalized,
    #[msg("No pending funds to withdraw")]
    NoPendingFunds,
    #[msg("No creator earnings to withdraw")]
    NoCreatorEarnings,
    #[msg("No game creator earnings to withdraw")]
    NoGameCreatorEarnings,
    #[msg("No platform revenue available")]
    NoPlatformRevenue,
    #[msg("No refundable record found")]
    NoRefundableRecord,
    #[msg("Fee percentage too high")]
    FeeTooHigh,
    #[msg("Cannot cancel: players already registered")]
    PlayersAlreadyRegistered,
    #[msg("Transfer failed")]
    TransferFailed,
    #[msg("Seed string too long (max 128 chars)")]
    SeedTooLong,
    #[msg("URI string too long (max 200 chars)")]
    UriTooLong,
    #[msg("Arithmetic overflow")]
    Overflow,
}

// ─────────────────────────────────────────────
//  ACCOUNT STRUCTURES
// ─────────────────────────────────────────────

/// Global program state — equivalent to contract-level storage vars in GameContract.sol
#[account]
pub struct ProgramState {
    pub authority: Pubkey,           // owner / Daxum multisig
    pub contract_fee_percent: u8,    // platform cut (default 5)
    pub game_creator_percent: u8,    // game royalty cut (default 10)
    pub challenge_counter: u64,      // auto-increment challenge ID
    pub total_revenue_historic: u64, // headline metric (lamports), never decreases
    pub bump: u8,
}

impl ProgramState {
    pub const LEN: usize = 8 + 32 + 1 + 1 + 8 + 8 + 1;
}

/// Tracks whether a wallet is a permitted game publisher
#[account]
pub struct GamePublisher {
    pub publisher: Pubkey,
    pub is_active: bool,
    pub bump: u8,
}

impl GamePublisher {
    pub const LEN: usize = 8 + 32 + 1 + 1;
}

/// Registers a gameId → creator mapping (mirrors gameCreator mapping)
#[account]
pub struct GameRecord {
    pub game_id: u64,
    pub creator: Pubkey,
    pub bump: u8,
}

impl GameRecord {
    pub const LEN: usize = 8 + 8 + 32 + 1;
}

/// One challenge — mirrors the Challenge struct in GameContract.sol
#[account]
pub struct Challenge {
    pub challenge_id: u64,
    pub creator: Pubkey,
    pub game_id: u64,
    pub target_score: u64,          // gameMintScore
    pub prize_pool: u64,            // gameMintPrice (lamports)
    pub max_players: u32,           // gameMintNumPlayers
    pub registered_players: u32,
    pub played_count: u32,
    pub winners: u32,
    pub seed: String,               // deterministic seed (max 128 chars)
    pub expiry_time: i64,
    pub creator_remaining: u64,     // creator deposit left
    pub is_solved: bool,
    pub not_playable: bool,
    pub finalized: bool,
    pub bump: u8,
}

impl Challenge {
    pub const LEN: usize = 8 + 8 + 32 + 8 + 8 + 8 + 4 + 4 + 4 + 4
        + (4 + MAX_SEED_LEN)        // String prefix + bytes
        + 8 + 8 + 1 + 1 + 1 + 1;
}

/// Records whether a specific player has accepted a specific challenge
/// PDA seeds: [b"accepted", challenge_id, player]
#[account]
pub struct AcceptRecord {
    pub challenge_id: u64,
    pub player: Pubkey,
    pub amount_paid: u64,           // lamports paid on accept
    pub bump: u8,
}

impl AcceptRecord {
    pub const LEN: usize = 8 + 8 + 32 + 8 + 1;
}

/// Records a player's play result for a challenge
/// PDA seeds: [b"played", challenge_id, player]
#[account]
pub struct PlayRecord {
    pub challenge_id: u64,
    pub player: Pubkey,
    pub game_id: u64,
    pub score: u64,
    pub amount_paid: u64,
    pub won: bool,
    pub refunded: bool,
    pub bump: u8,
}

impl PlayRecord {
    pub const LEN: usize = 8 + 8 + 32 + 8 + 8 + 8 + 1 + 1 + 1;
}

/// Pending withdrawal balance for any user (winners, creator refunds)
/// PDA seeds: [b"pending", user]
#[account]
pub struct PendingWithdrawal {
    pub owner: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

impl PendingWithdrawal {
    pub const LEN: usize = 8 + 32 + 8 + 1;
}

/// Creator earnings ledger (challenge creators earning from losers)
/// PDA seeds: [b"creator_earn", creator]
#[account]
pub struct CreatorEarnings {
    pub owner: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

impl CreatorEarnings {
    pub const LEN: usize = 8 + 32 + 8 + 1;
}

/// Game creator earnings ledger (royalties per game creator)
/// PDA seeds: [b"game_earn", game_creator]
#[account]
pub struct GameCreatorEarnings {
    pub owner: Pubkey,
    pub amount: u64,
    pub bump: u8,
}

impl GameCreatorEarnings {
    pub const LEN: usize = 8 + 32 + 8 + 1;
}

/// Blue Badge NFT ownership record (lightweight; full NFT via Metaplex in production)
/// For devnet simplicity: we mint a program-owned badge account instead of full Metaplex NFT.
/// PDA seeds: [b"blue_badge", owner]
#[account]
pub struct BlueBadge {
    pub owner: Pubkey,
    pub token_uri: String,          // IPFS/Arweave metadata URI
    pub mint_time: i64,
    pub bump: u8,
}

impl BlueBadge {
    pub const LEN: usize = 8 + 32 + (4 + MAX_URI_LEN) + 8 + 1;
}

/// Orange Badge NFT ownership record
/// PDA seeds: [b"orange_badge", owner]
#[account]
pub struct OrangeBadge {
    pub owner: Pubkey,
    pub token_uri: String,
    pub mint_time: i64,
    pub bump: u8,
}

impl OrangeBadge {
    pub const LEN: usize = 8 + 32 + (4 + MAX_URI_LEN) + 8 + 1;
}

/// Program-owned escrow vault for holding challenge funds
/// PDA seeds: [b"vault"]
/// This account holds all SOL deposited for active challenges.
#[account]
pub struct Vault {
    pub total_deposited: u64,
    pub bump: u8,
}

impl Vault {
    pub const LEN: usize = 8 + 8 + 1;
}

// ─────────────────────────────────────────────
//  EVENTS  (mirrors GameContract.sol events)
// ─────────────────────────────────────────────

#[event]
pub struct ChallengeMinted {
    pub challenge_id: u64,
    pub game_id: u64,
    pub creator: Pubkey,
    pub prize_pool: u64,
    pub expiry_time: i64,
    pub seed: String,
}

#[event]
pub struct ChallengeAccepted {
    pub challenge_id: u64,
    pub player: Pubkey,
}

#[event]
pub struct ChallengePlayed {
    pub challenge_id: u64,
    pub player: Pubkey,
    pub game_id: u64,
    pub won: bool,
    pub score: u64,
}

#[event]
pub struct ChallengeSolved {
    pub challenge_id: u64,
}

#[event]
pub struct ChallengeCancelled {
    pub challenge_id: u64,
}

#[event]
pub struct ChallengeExpiredEvent {
    pub challenge_id: u64,
}

#[event]
pub struct RefundIssued {
    pub challenge_id: u64,
    pub player: Pubkey,
    pub amount: u64,
}

#[event]
pub struct CreatorEarningsCredited {
    pub creator: Pubkey,
    pub amount: u64,
}

#[event]
pub struct GameCreatorEarningsCredited {
    pub game_id: u64,
    pub game_creator: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PendingWithdrawalCreated {
    pub user: Pubkey,
    pub amount: u64,
}

#[event]
pub struct PendingWithdrawalClaimed {
    pub user: Pubkey,
    pub amount: u64,
}

#[event]
pub struct GameRegistered {
    pub game_id: u64,
    pub creator: Pubkey,
}

#[event]
pub struct BlueBadgeMinted {
    pub minter: Pubkey,
}

#[event]
pub struct OrangeBadgeMinted {
    pub minter: Pubkey,
}

// ─────────────────────────────────────────────
//  HELPER: safe arithmetic
// ─────────────────────────────────────────────
fn safe_add(a: u64, b: u64) -> Result<u64> {
    a.checked_add(b).ok_or(error!(DaxumError::Overflow))
}
fn safe_sub(a: u64, b: u64) -> Result<u64> {
    a.checked_sub(b).ok_or(error!(DaxumError::Overflow))
}
fn safe_mul(a: u64, b: u64) -> Result<u64> {
    a.checked_mul(b).ok_or(error!(DaxumError::Overflow))
}

// ─────────────────────────────────────────────
//  HELPER: SOL transfer from PDA vault to user
//  Uses a direct lamport manipulation since vault is a PDA.
// ─────────────────────────────────────────────
fn vault_pay<'info>(
    vault: &mut Account<'info, Vault>,
    recipient: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    require!(
        **vault.to_account_info().lamports.borrow() >= amount,
        DaxumError::TransferFailed
    );
    **vault.to_account_info().try_borrow_mut_lamports()? -= amount;
    **recipient.try_borrow_mut_lamports()? += amount;
    Ok(())
}

// ─────────────────────────────────────────────
//  PROGRAM MODULE
// ─────────────────────────────────────────────
#[program]
pub mod daxum {
    use super::*;

    // ══════════════════════════════════════════
    //  ADMIN — INITIALIZE PROGRAM
    //  Equivalent to: constructor()
    // ══════════════════════════════════════════

    /// Must be called once after deploy to set up global state and vault.
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.program_state;
        state.authority = ctx.accounts.authority.key();
        state.contract_fee_percent = 5;
        state.game_creator_percent = 10;
        state.challenge_counter = 0;
        state.total_revenue_historic = 0;
        state.bump = ctx.bumps.program_state;

        let vault = &mut ctx.accounts.vault;
        vault.total_deposited = 0;
        vault.bump = ctx.bumps.vault;

        Ok(())
    }

    // ══════════════════════════════════════════
    //  BLUE BADGE — MINT
    //  Equivalent to: BlueBadge.mintBadge(tokenURI)
    // ══════════════════════════════════════════

    /// Mint a Blue Badge by paying BLUE_BADGE_PRICE_LAMPORTS.
    /// Blue Badge = creator + player credential. Required to create/join challenges.
    pub fn mint_blue_badge(ctx: Context<MintBlueBadge>, token_uri: String) -> Result<()> {
        require!(!token_uri.is_empty(), DaxumError::EmptyTokenUri);
        require!(token_uri.len() <= MAX_URI_LEN, DaxumError::UriTooLong);
        require!(
            ctx.accounts.payer.lamports() >= BLUE_BADGE_PRICE_LAMPORTS,
            DaxumError::InsufficientBlueBadgePayment
        );

        // Transfer payment to vault (authority collects via withdraw_contract_revenue)
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, BLUE_BADGE_PRICE_LAMPORTS)?;
        ctx.accounts.vault.total_deposited =
            safe_add(ctx.accounts.vault.total_deposited, BLUE_BADGE_PRICE_LAMPORTS)?;

        // Record badge ownership
        let badge = &mut ctx.accounts.blue_badge;
        badge.owner = ctx.accounts.payer.key();
        badge.token_uri = token_uri;
        badge.mint_time = Clock::get()?.unix_timestamp;
        badge.bump = ctx.bumps.blue_badge;

        // Track as platform revenue
        let state = &mut ctx.accounts.program_state;
        state.total_revenue_historic =
            safe_add(state.total_revenue_historic, BLUE_BADGE_PRICE_LAMPORTS)?;

        emit!(BlueBadgeMinted {
            minter: ctx.accounts.payer.key()
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  ORANGE BADGE — MINT
    //  Equivalent to: OrangeBadge.mintBadge(tokenURI)
    // ══════════════════════════════════════════

    /// Mint an Orange Badge by paying EXACT ORANGE_BADGE_PRICE_LAMPORTS.
    /// Orange Badge = entry-level identity credential.
    pub fn mint_orange_badge(ctx: Context<MintOrangeBadge>, token_uri: String) -> Result<()> {
        require!(!token_uri.is_empty(), DaxumError::EmptyTokenUri);
        require!(token_uri.len() <= MAX_URI_LEN, DaxumError::UriTooLong);

        // Exact payment enforced (mirrors OrangeBadge.sol's receive() revert)
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, ORANGE_BADGE_PRICE_LAMPORTS)?;
        ctx.accounts.vault.total_deposited =
            safe_add(ctx.accounts.vault.total_deposited, ORANGE_BADGE_PRICE_LAMPORTS)?;

        let badge = &mut ctx.accounts.orange_badge;
        badge.owner = ctx.accounts.payer.key();
        badge.token_uri = token_uri;
        badge.mint_time = Clock::get()?.unix_timestamp;
        badge.bump = ctx.bumps.orange_badge;

        let state = &mut ctx.accounts.program_state;
        state.total_revenue_historic =
            safe_add(state.total_revenue_historic, ORANGE_BADGE_PRICE_LAMPORTS)?;

        emit!(OrangeBadgeMinted {
            minter: ctx.accounts.payer.key()
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  ADMIN — ADD GAME PUBLISHER
    //  Equivalent to: addGamePublisher(address)
    // ══════════════════════════════════════════

    pub fn add_game_publisher(ctx: Context<AddGamePublisher>, publisher: Pubkey) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.program_state.authority,
            DaxumError::NotAuthority
        );
        let record = &mut ctx.accounts.publisher_record;
        record.publisher = publisher;
        record.is_active = true;
        record.bump = ctx.bumps.publisher_record;
        Ok(())
    }

    // ══════════════════════════════════════════
    //  ADMIN — REMOVE GAME PUBLISHER
    //  Equivalent to: removeGamePublisher(address)
    // ══════════════════════════════════════════

    pub fn remove_game_publisher(ctx: Context<RemoveGamePublisher>) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.program_state.authority,
            DaxumError::NotAuthority
        );
        ctx.accounts.publisher_record.is_active = false;
        Ok(())
    }

    // ══════════════════════════════════════════
    //  PUBLISHER — REGISTER GAME
    //  Equivalent to: registerGame(gameId, creator)
    // ══════════════════════════════════════════

    /// Register a game on-chain, linking gameId → creator wallet.
    /// Only active game publishers can call this.
    pub fn register_game(
        ctx: Context<RegisterGame>,
        game_id: u64,
        creator: Pubkey,
    ) -> Result<()> {
        require!(
            ctx.accounts.publisher_record.is_active,
            DaxumError::NotGamePublisher
        );
        require!(creator != Pubkey::default(), DaxumError::InvalidCreator);

        let record = &mut ctx.accounts.game_record;
        record.game_id = game_id;
        record.creator = creator;
        record.bump = ctx.bumps.game_record;

        emit!(GameRegistered {
            game_id,
            creator
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  CHALLENGE — MINT (CREATE)
    //  Equivalent to: mintChallenge(score, gameId, numPlayers, price, expiryTime, seed)
    // ══════════════════════════════════════════

    /// Create a challenge. Creator deposits the full prize pool.
    /// Requires Blue Badge. Seed must be ≤128 chars.
    pub fn mint_challenge(
        ctx: Context<MintChallenge>,
        target_score: u64,
        game_id: u64,
        max_players: u32,
        prize_pool: u64,    // total lamports deposited by creator
        expiry_time: i64,
        seed: String,
    ) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;

        require!(seed.len() <= MAX_SEED_LEN, DaxumError::SeedTooLong);
        require!(
            expiry_time > now + REGISTER_TIME_LIMIT,
            DaxumError::ExpiryTooSoon
        );
        // Blue Badge gate
        require!(
            ctx.accounts.blue_badge.owner == ctx.accounts.creator.key(),
            DaxumError::NoBlueBadge
        );
        require!(max_players > 0, DaxumError::ZeroPlayers);
        require!(
            prize_pool % (max_players as u64) == 0,
            DaxumError::IndivisiblePrice
        );

        // Transfer prize pool into vault escrow
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.creator.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, prize_pool)?;
        ctx.accounts.vault.total_deposited =
            safe_add(ctx.accounts.vault.total_deposited, prize_pool)?;

        // Increment counter and write challenge state
        let state = &mut ctx.accounts.program_state;
        state.challenge_counter = safe_add(state.challenge_counter, 1)?;
        let challenge_id = state.challenge_counter;

        let challenge = &mut ctx.accounts.challenge;
        challenge.challenge_id = challenge_id;
        challenge.creator = ctx.accounts.creator.key();
        challenge.game_id = game_id;
        challenge.target_score = target_score;
        challenge.prize_pool = prize_pool;
        challenge.max_players = max_players;
        challenge.registered_players = 0;
        challenge.played_count = 0;
        challenge.winners = 0;
        challenge.seed = seed.clone();
        challenge.expiry_time = expiry_time;
        challenge.creator_remaining = prize_pool;
        challenge.is_solved = false;
        challenge.not_playable = false;
        challenge.finalized = false;
        challenge.bump = ctx.bumps.challenge;

        emit!(ChallengeMinted {
            challenge_id,
            game_id,
            creator: ctx.accounts.creator.key(),
            prize_pool,
            expiry_time,
            seed,
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  CHALLENGE — ACCEPT
    //  Equivalent to: acceptChallenge(challengeId)
    // ══════════════════════════════════════════

    /// Join a challenge by paying the per-player entry fee.
    /// Requires Blue Badge. Cannot join if already accepted or capacity reached.
    pub fn accept_challenge(ctx: Context<AcceptChallenge>) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let challenge = &mut ctx.accounts.challenge;

        require!(!challenge.finalized && !challenge.not_playable, DaxumError::NotPlayable);
        require!(now < challenge.expiry_time, DaxumError::ChallengeExpired);
        // Blue Badge gate
        require!(
            ctx.accounts.blue_badge.owner == ctx.accounts.player.key(),
            DaxumError::NoBlueBadge
        );
        require!(
            challenge.registered_players < challenge.max_players,
            DaxumError::PlayerLimitReached
        );

        let per_player = challenge.prize_pool / (challenge.max_players as u64);

        // Transfer entry fee into vault
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.player.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, per_player)?;
        ctx.accounts.vault.total_deposited =
            safe_add(ctx.accounts.vault.total_deposited, per_player)?;

        // Record acceptance
        let accept_record = &mut ctx.accounts.accept_record;
        accept_record.challenge_id = challenge.challenge_id;
        accept_record.player = ctx.accounts.player.key();
        accept_record.amount_paid = per_player;
        accept_record.bump = ctx.bumps.accept_record;

        challenge.registered_players += 1;

        emit!(ChallengeAccepted {
            challenge_id: challenge.challenge_id,
            player: ctx.accounts.player.key(),
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  CHALLENGE — PLAY (SUBMIT SCORE)
    //  Equivalent to: playChallenge(challengeId, score)
    // ══════════════════════════════════════════

    /// Submit a score for a challenge you've accepted.
    /// Determines win/loss, credits earnings, queues payouts via pull pattern.
    pub fn play_challenge(ctx: Context<PlayChallenge>, score: u64) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let challenge = &mut ctx.accounts.challenge;
        let state = &mut ctx.accounts.program_state;

        require!(!challenge.finalized && !challenge.not_playable, DaxumError::NotPlayable);
        require!(now < challenge.expiry_time, DaxumError::ChallengeExpired);

        let per_player = challenge.prize_pool / (challenge.max_players as u64);
        let contract_fee_pct = state.contract_fee_percent as u64;
        let game_creator_pct = state.game_creator_percent as u64;

        let won = score >= challenge.target_score;

        // ── Game creator fee (if game is registered) ──────────
        let game_creator_key = ctx.accounts.game_record.creator;
        let has_game_creator = game_creator_key != Pubkey::default()
            && ctx.accounts.game_record.game_id == challenge.game_id;

        if won {
            // ── WINNER PATH ────────────────────────────────────
            // Player receives: their own stake (per_player) + one unit of creator deposit - fees
            require!(
                challenge.creator_remaining >= per_player,
                DaxumError::InsufficientCreatorDeposit
            );
            challenge.creator_remaining = safe_sub(challenge.creator_remaining, per_player)?;

            let platform_fee_base = safe_mul(per_player, contract_fee_pct)? / 100;
            let game_fee = if has_game_creator {
                safe_mul(per_player, game_creator_pct)? / 100
            } else {
                0u64
            };
            // If no game creator, extra game fee portion goes to platform
            let platform_fee = if has_game_creator {
                platform_fee_base
            } else {
                safe_add(platform_fee_base, safe_mul(per_player, game_creator_pct)? / 100)?
            };

            let total_fees = safe_add(platform_fee, game_fee)?;
            let net_from_creator = if per_player > total_fees {
                safe_sub(per_player, total_fees)?
            } else {
                0
            };
            let total_to_winner = safe_add(per_player, net_from_creator)?; // own stake + net from creator

            // Credit game creator earnings
            if has_game_creator && game_fee > 0 {
                let gc_earn = &mut ctx.accounts.game_creator_earnings;
                gc_earn.owner = game_creator_key;
                gc_earn.amount = safe_add(gc_earn.amount, game_fee)?;
                emit!(GameCreatorEarningsCredited {
                    game_id: challenge.game_id,
                    game_creator: game_creator_key,
                    amount: game_fee,
                });
            }

            // Queue winner payout (pull pattern)
            let pending = &mut ctx.accounts.pending_withdrawal;
            pending.owner = ctx.accounts.player.key();
            pending.amount = safe_add(pending.amount, total_to_winner)?;

            // Record platform revenue
            state.total_revenue_historic = safe_add(state.total_revenue_historic, platform_fee)?;

            emit!(PendingWithdrawalCreated {
                user: ctx.accounts.player.key(),
                amount: total_to_winner,
            });

            challenge.winners += 1;
        } else {
            // ── LOSER PATH ─────────────────────────────────────
            // Player's stake (minus fees) goes to challenge creator.
            let platform_fee_base = safe_mul(per_player, contract_fee_pct)? / 100;
            let game_fee = if has_game_creator {
                safe_mul(per_player, game_creator_pct)? / 100
            } else {
                0u64
            };
            let platform_fee = if has_game_creator {
                platform_fee_base
            } else {
                safe_add(platform_fee_base, safe_mul(per_player, game_creator_pct)? / 100)?
            };

            let total_fees = safe_add(platform_fee, game_fee)?;
            let net_to_creator = if per_player > total_fees {
                safe_sub(per_player, total_fees)?
            } else {
                0
            };

            // Credit game creator earnings
            if has_game_creator && game_fee > 0 {
                let gc_earn = &mut ctx.accounts.game_creator_earnings;
                gc_earn.owner = game_creator_key;
                gc_earn.amount = safe_add(gc_earn.amount, game_fee)?;
                emit!(GameCreatorEarningsCredited {
                    game_id: challenge.game_id,
                    game_creator: game_creator_key,
                    amount: game_fee,
                });
            }

            // Credit challenge creator earnings
            if net_to_creator > 0 {
                let cr_earn = &mut ctx.accounts.creator_earnings;
                cr_earn.owner = challenge.creator;
                cr_earn.amount = safe_add(cr_earn.amount, net_to_creator)?;
                emit!(CreatorEarningsCredited {
                    creator: challenge.creator,
                    amount: net_to_creator,
                });
            }

            state.total_revenue_historic = safe_add(state.total_revenue_historic, platform_fee)?;
        }

        // Record the play
        let play_record = &mut ctx.accounts.play_record;
        play_record.challenge_id = challenge.challenge_id;
        play_record.player = ctx.accounts.player.key();
        play_record.game_id = challenge.game_id;
        play_record.score = score;
        play_record.amount_paid = per_player;
        play_record.won = won;
        play_record.refunded = false;
        play_record.bump = ctx.bumps.play_record;

        challenge.played_count += 1;

        emit!(ChallengePlayed {
            challenge_id: challenge.challenge_id,
            player: ctx.accounts.player.key(),
            game_id: challenge.game_id,
            won,
            score,
        });

        // Auto-solve: winners threshold reached
        if challenge.winners >= challenge.max_players {
            challenge.is_solved = true;
            emit!(ChallengeSolved {
                challenge_id: challenge.challenge_id,
            });
        }

        // Auto-finalize: all registered players have played
        if challenge.played_count >= challenge.registered_players && !challenge.finalized {
            // Refund leftover creator deposit back to creator earnings
            let leftover = challenge.creator_remaining;
            if leftover > 0 {
                challenge.creator_remaining = 0;
                let cr_earn = &mut ctx.accounts.creator_earnings;
                cr_earn.owner = challenge.creator;
                cr_earn.amount = safe_add(cr_earn.amount, leftover)?;
                emit!(CreatorEarningsCredited {
                    creator: challenge.creator,
                    amount: leftover,
                });
            }
            challenge.finalized = true;
            challenge.not_playable = true;
        }

        Ok(())
    }

    // ══════════════════════════════════════════
    //  CHALLENGE — CANCEL
    //  Equivalent to: cancelChallenge(challengeId)
    // ══════════════════════════════════════════

    /// Cancel a challenge before any players have registered.
    /// Creator gets full deposit back via creator earnings ledger.
    pub fn cancel_challenge(ctx: Context<CancelChallenge>) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let challenge = &mut ctx.accounts.challenge;

        require!(
            ctx.accounts.signer.key() == challenge.creator
                || ctx.accounts.publisher_record.is_active,
            DaxumError::NotAuthority
        );
        require!(challenge.registered_players == 0, DaxumError::PlayersAlreadyRegistered);
        require!(!challenge.finalized, DaxumError::AlreadyFinalized);
        require!(now < challenge.expiry_time, DaxumError::ChallengeExpired);

        challenge.not_playable = true;

        // Refund creator's deposit via earnings ledger
        let deposited = challenge.creator_remaining;
        if deposited > 0 {
            challenge.creator_remaining = 0;
            let cr_earn = &mut ctx.accounts.creator_earnings;
            cr_earn.owner = challenge.creator;
            cr_earn.amount = safe_add(cr_earn.amount, deposited)?;
            emit!(CreatorEarningsCredited {
                creator: challenge.creator,
                amount: deposited,
            });
        }

        emit!(ChallengeCancelled {
            challenge_id: challenge.challenge_id,
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  CHALLENGE — EXPIRE
    //  Equivalent to: expireChallenge(challengeId)
    // ══════════════════════════════════════════

    /// Callable by anyone once expiry_time has passed.
    /// Finalises the challenge: unplayed registered players counted as losers.
    /// Creator deposit remainder refunded via creator earnings.
    pub fn expire_challenge(ctx: Context<ExpireChallenge>) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let challenge = &mut ctx.accounts.challenge;
        let state = &mut ctx.accounts.program_state;

        require!(!challenge.finalized, DaxumError::AlreadyFinalized);
        require!(now >= challenge.expiry_time, DaxumError::NotYetExpired);

        let per_player = challenge.prize_pool / (challenge.max_players as u64);
        let unplayed = challenge.registered_players.saturating_sub(challenge.played_count) as u64;

        if unplayed > 0 {
            let contract_fee_pct = state.contract_fee_percent as u64;
            let game_creator_pct = state.game_creator_percent as u64;
            let earnings = safe_mul(unplayed, per_player)?;

            let game_creator_key = ctx.accounts.game_record.creator;
            let has_game_creator = game_creator_key != Pubkey::default()
                && ctx.accounts.game_record.game_id == challenge.game_id;

            let platform_fee_base = safe_mul(earnings, contract_fee_pct)? / 100;
            let game_fee = if has_game_creator {
                safe_mul(earnings, game_creator_pct)? / 100
            } else {
                0u64
            };
            let platform_fee = if has_game_creator {
                platform_fee_base
            } else {
                safe_add(platform_fee_base, safe_mul(earnings, game_creator_pct)? / 100)?
            };

            let total_fees = safe_add(platform_fee, game_fee)?;
            let payout = if earnings > total_fees {
                safe_sub(earnings, total_fees)?
            } else {
                0
            };

            if has_game_creator && game_fee > 0 {
                let gc_earn = &mut ctx.accounts.game_creator_earnings;
                gc_earn.owner = game_creator_key;
                gc_earn.amount = safe_add(gc_earn.amount, game_fee)?;
                emit!(GameCreatorEarningsCredited {
                    game_id: challenge.game_id,
                    game_creator: game_creator_key,
                    amount: game_fee,
                });
            }

            if payout > 0 {
                let cr_earn = &mut ctx.accounts.creator_earnings;
                cr_earn.owner = challenge.creator;
                cr_earn.amount = safe_add(cr_earn.amount, payout)?;
                emit!(CreatorEarningsCredited {
                    creator: challenge.creator,
                    amount: payout,
                });
            }

            state.total_revenue_historic = safe_add(state.total_revenue_historic, platform_fee)?;
        }

        // Refund leftover creator deposit
        let leftover = challenge.creator_remaining;
        if leftover > 0 {
            challenge.creator_remaining = 0;
            let cr_earn = &mut ctx.accounts.creator_earnings;
            cr_earn.owner = challenge.creator;
            cr_earn.amount = safe_add(cr_earn.amount, leftover)?;
            emit!(CreatorEarningsCredited {
                creator: challenge.creator,
                amount: leftover,
            });
        }

        challenge.finalized = true;
        challenge.not_playable = true;

        emit!(ChallengeExpiredEvent {
            challenge_id: challenge.challenge_id,
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  WITHDRAWALS — PENDING (WINNERS)
    //  Equivalent to: withdrawPending()
    // ══════════════════════════════════════════

    /// Winners pull their earned SOL from the vault.
    pub fn withdraw_pending(ctx: Context<WithdrawPending>) -> Result<()> {
        let pending = &mut ctx.accounts.pending_withdrawal;
        let amount = pending.amount;
        require!(amount > 0, DaxumError::NoPendingFunds);

        pending.amount = 0;

        vault_pay(
            &mut ctx.accounts.vault,
            &ctx.accounts.user.to_account_info(),
            amount,
        )?;

        emit!(PendingWithdrawalClaimed {
            user: ctx.accounts.user.key(),
            amount,
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  WITHDRAWALS — CREATOR EARNINGS
    //  Equivalent to: withdrawCreatorEarnings()
    // ══════════════════════════════════════════

    /// Challenge creators pull their accumulated earnings.
    pub fn withdraw_creator_earnings(ctx: Context<WithdrawCreatorEarnings>) -> Result<()> {
        let earn = &mut ctx.accounts.creator_earnings;
        let amount = earn.amount;
        require!(amount > 0, DaxumError::NoCreatorEarnings);

        earn.amount = 0;

        vault_pay(
            &mut ctx.accounts.vault,
            &ctx.accounts.creator.to_account_info(),
            amount,
        )?;

        emit!(PendingWithdrawalClaimed {
            user: ctx.accounts.creator.key(),
            amount,
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  WITHDRAWALS — GAME CREATOR EARNINGS
    //  Equivalent to: withdrawGameCreatorEarnings()
    // ══════════════════════════════════════════

    /// Game creators pull their accumulated royalties.
    pub fn withdraw_game_creator_earnings(ctx: Context<WithdrawGameCreatorEarnings>) -> Result<()> {
        let earn = &mut ctx.accounts.game_creator_earnings;
        let amount = earn.amount;
        require!(amount > 0, DaxumError::NoGameCreatorEarnings);

        earn.amount = 0;

        vault_pay(
            &mut ctx.accounts.vault,
            &ctx.accounts.game_creator.to_account_info(),
            amount,
        )?;

        emit!(PendingWithdrawalClaimed {
            user: ctx.accounts.game_creator.key(),
            amount,
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  WITHDRAWALS — PLATFORM REVENUE
    //  Equivalent to: withdrawContractRevenue()
    // ══════════════════════════════════════════

    /// Daxum authority withdraws platform fees from vault.
    /// Only SOL not earmarked for users/creators can be withdrawn.
    pub fn withdraw_contract_revenue(ctx: Context<WithdrawContractRevenue>) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.program_state.authority,
            DaxumError::NotAuthority
        );

        let vault_lamports = ctx.accounts.vault.to_account_info().lamports();
        let reserved = safe_add(
            ctx.accounts.total_pending.amount,
            ctx.accounts.total_creator.amount,
        )?;
        let reserved = safe_add(reserved, ctx.accounts.total_game_creator.amount)?;

        require!(vault_lamports > reserved, DaxumError::NoPlatformRevenue);
        let owed = safe_sub(vault_lamports, reserved)?;

        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= owed;
        **ctx.accounts.authority.try_borrow_mut_lamports()? += owed;

        Ok(())
    }

    // ══════════════════════════════════════════
    //  ADMIN — REFUND PLAYER
    //  Equivalent to: refundPlayer(challengeId, player)
    // ══════════════════════════════════════════

    /// Emergency refund for a losing player's entry fee.
    /// Only callable by Daxum authority.
    pub fn refund_player(ctx: Context<RefundPlayer>) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.program_state.authority,
            DaxumError::NotAuthority
        );

        let record = &mut ctx.accounts.play_record;
        require!(!record.won && !record.refunded, DaxumError::NoRefundableRecord);

        record.refunded = true;
        let amount = record.amount_paid;

        let pending = &mut ctx.accounts.pending_withdrawal;
        pending.owner = record.player;
        pending.amount = safe_add(pending.amount, amount)?;

        emit!(RefundIssued {
            challenge_id: record.challenge_id,
            player: record.player,
            amount,
        });
        Ok(())
    }

    // ══════════════════════════════════════════
    //  ADMIN — SET CONTRACT FEE
    //  Equivalent to: setContractFeePercent(uint256)
    // ══════════════════════════════════════════

    pub fn set_contract_fee(ctx: Context<SetFee>, new_fee: u8) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.program_state.authority,
            DaxumError::NotAuthority
        );
        require!(new_fee <= MAX_FEE_PCT, DaxumError::FeeTooHigh);
        ctx.accounts.program_state.contract_fee_percent = new_fee;
        Ok(())
    }

    // ══════════════════════════════════════════
    //  ADMIN — SET GAME CREATOR FEE
    //  Equivalent to: setGameCreatorPercent(uint256)
    // ══════════════════════════════════════════

    pub fn set_game_creator_percent(ctx: Context<SetFee>, new_pct: u8) -> Result<()> {
        require!(
            ctx.accounts.authority.key() == ctx.accounts.program_state.authority,
            DaxumError::NotAuthority
        );
        require!(new_pct <= MAX_FEE_PCT, DaxumError::FeeTooHigh);
        ctx.accounts.program_state.game_creator_percent = new_pct;
        Ok(())
    }
}

// ─────────────────────────────────────────────
//  ACCOUNT CONTEXTS
// ─────────────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = ProgramState::LEN,
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = authority,
        space = Vault::LEN,
        seeds = [b"vault"],
        bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintBlueBadge<'info> {
    #[account(
        init,
        payer = payer,
        space = BlueBadge::LEN,
        seeds = [b"blue_badge", payer.key().as_ref()],
        bump
    )]
    pub blue_badge: Account<'info, BlueBadge>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintOrangeBadge<'info> {
    #[account(
        init,
        payer = payer,
        space = OrangeBadge::LEN,
        seeds = [b"orange_badge", payer.key().as_ref()],
        bump
    )]
    pub orange_badge: Account<'info, OrangeBadge>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(publisher: Pubkey)]
pub struct AddGamePublisher<'info> {
    #[account(
        init,
        payer = authority,
        space = GamePublisher::LEN,
        seeds = [b"publisher", publisher.as_ref()],
        bump
    )]
    pub publisher_record: Account<'info, GamePublisher>,

    #[account(seeds = [b"program_state"], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RemoveGamePublisher<'info> {
    #[account(
        mut,
        seeds = [b"publisher", publisher_record.publisher.as_ref()],
        bump = publisher_record.bump
    )]
    pub publisher_record: Account<'info, GamePublisher>,

    #[account(seeds = [b"program_state"], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(game_id: u64, creator: Pubkey)]
pub struct RegisterGame<'info> {
    #[account(
        init,
        payer = publisher,
        space = GameRecord::LEN,
        seeds = [b"game", game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub game_record: Account<'info, GameRecord>,

    #[account(
        seeds = [b"publisher", publisher.key().as_ref()],
        bump = publisher_record.bump
    )]
    pub publisher_record: Account<'info, GamePublisher>,

    #[account(mut)]
    pub publisher: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(target_score: u64, game_id: u64, max_players: u32, prize_pool: u64, expiry_time: i64, seed: String)]
pub struct MintChallenge<'info> {
    #[account(
        init,
        payer = creator,
        space = Challenge::LEN,
        seeds = [b"challenge", (program_state.challenge_counter + 1).to_le_bytes().as_ref()],
        bump
    )]
    pub challenge: Account<'info, Challenge>,

    // Blue Badge gate — must exist and be owned by creator
    #[account(
        seeds = [b"blue_badge", creator.key().as_ref()],
        bump = blue_badge.bump
    )]
    pub blue_badge: Account<'info, BlueBadge>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptChallenge<'info> {
    #[account(
        mut,
        seeds = [b"challenge", challenge.challenge_id.to_le_bytes().as_ref()],
        bump = challenge.bump
    )]
    pub challenge: Account<'info, Challenge>,

    #[account(
        init,
        payer = player,
        space = AcceptRecord::LEN,
        seeds = [b"accepted", challenge.challenge_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump
    )]
    pub accept_record: Account<'info, AcceptRecord>,

    // Blue Badge gate
    #[account(
        seeds = [b"blue_badge", player.key().as_ref()],
        bump = blue_badge.bump
    )]
    pub blue_badge: Account<'info, BlueBadge>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlayChallenge<'info> {
    #[account(
        mut,
        seeds = [b"challenge", challenge.challenge_id.to_le_bytes().as_ref()],
        bump = challenge.bump
    )]
    pub challenge: Account<'info, Challenge>,

    // Verify player accepted (account must exist)
    #[account(
        seeds = [b"accepted", challenge.challenge_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = accept_record.bump
    )]
    pub accept_record: Account<'info, AcceptRecord>,

    #[account(
        init,
        payer = player,
        space = PlayRecord::LEN,
        seeds = [b"played", challenge.challenge_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump
    )]
    pub play_record: Account<'info, PlayRecord>,

    // Game record — used to determine royalty destination
    /// CHECK: validated inside instruction by checking game_id match
    pub game_record: Account<'info, GameRecord>,

    // Pending withdrawal for winners (init_if_needed)
    #[account(
        init_if_needed,
        payer = player,
        space = PendingWithdrawal::LEN,
        seeds = [b"pending", player.key().as_ref()],
        bump
    )]
    pub pending_withdrawal: Account<'info, PendingWithdrawal>,

    // Creator earnings for losers
    #[account(
        init_if_needed,
        payer = player,
        space = CreatorEarnings::LEN,
        seeds = [b"creator_earn", challenge.creator.as_ref()],
        bump
    )]
    pub creator_earnings: Account<'info, CreatorEarnings>,

    // Game creator earnings (royalties)
    #[account(
        init_if_needed,
        payer = player,
        space = GameCreatorEarnings::LEN,
        seeds = [b"game_earn", game_record.creator.as_ref()],
        bump
    )]
    pub game_creator_earnings: Account<'info, GameCreatorEarnings>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelChallenge<'info> {
    #[account(
        mut,
        seeds = [b"challenge", challenge.challenge_id.to_le_bytes().as_ref()],
        bump = challenge.bump
    )]
    pub challenge: Account<'info, Challenge>,

    #[account(
        init_if_needed,
        payer = signer,
        space = CreatorEarnings::LEN,
        seeds = [b"creator_earn", challenge.creator.as_ref()],
        bump
    )]
    pub creator_earnings: Account<'info, CreatorEarnings>,

    // publisher_record used to check if signer is a publisher (alternative cancel authority)
    #[account(
        seeds = [b"publisher", signer.key().as_ref()],
        bump = publisher_record.bump
    )]
    pub publisher_record: Account<'info, GamePublisher>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExpireChallenge<'info> {
    #[account(
        mut,
        seeds = [b"challenge", challenge.challenge_id.to_le_bytes().as_ref()],
        bump = challenge.bump
    )]
    pub challenge: Account<'info, Challenge>,

    pub game_record: Account<'info, GameRecord>,

    #[account(
        init_if_needed,
        payer = caller,
        space = CreatorEarnings::LEN,
        seeds = [b"creator_earn", challenge.creator.as_ref()],
        bump
    )]
    pub creator_earnings: Account<'info, CreatorEarnings>,

    #[account(
        init_if_needed,
        payer = caller,
        space = GameCreatorEarnings::LEN,
        seeds = [b"game_earn", game_record.creator.as_ref()],
        bump
    )]
    pub game_creator_earnings: Account<'info, GameCreatorEarnings>,

    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub caller: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawPending<'info> {
    #[account(
        mut,
        seeds = [b"pending", user.key().as_ref()],
        bump = pending_withdrawal.bump
    )]
    pub pending_withdrawal: Account<'info, PendingWithdrawal>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawCreatorEarnings<'info> {
    #[account(
        mut,
        seeds = [b"creator_earn", creator.key().as_ref()],
        bump = creator_earnings.bump
    )]
    pub creator_earnings: Account<'info, CreatorEarnings>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawGameCreatorEarnings<'info> {
    #[account(
        mut,
        seeds = [b"game_earn", game_creator.key().as_ref()],
        bump = game_creator_earnings.bump
    )]
    pub game_creator_earnings: Account<'info, GameCreatorEarnings>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(mut)]
    pub game_creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct WithdrawContractRevenue<'info> {
    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault.bump
    )]
    pub vault: Account<'info, Vault>,

    #[account(seeds = [b"program_state"], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,

    // These accounts are passed to compute reserved amounts.
    // In production, aggregate these server-side; here we pass a representative set.
    pub total_pending: Account<'info, PendingWithdrawal>,
    pub total_creator: Account<'info, CreatorEarnings>,
    pub total_game_creator: Account<'info, GameCreatorEarnings>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct RefundPlayer<'info> {
    #[account(
        mut,
        seeds = [b"played", play_record.challenge_id.to_le_bytes().as_ref(), play_record.player.as_ref()],
        bump = play_record.bump
    )]
    pub play_record: Account<'info, PlayRecord>,

    #[account(
        init_if_needed,
        payer = authority,
        space = PendingWithdrawal::LEN,
        seeds = [b"pending", play_record.player.as_ref()],
        bump
    )]
    pub pending_withdrawal: Account<'info, PendingWithdrawal>,

    #[account(seeds = [b"program_state"], bump = program_state.bump)]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetFee<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump = program_state.bump
    )]
    pub program_state: Account<'info, ProgramState>,

    pub authority: Signer<'info>,
}