use anchor_lang::prelude::*;

declare_id!("E4Jugxr4jmV2DTuNMpmSButZiV27mAy44nYSv8Eks1xj");

#[program]
pub mod daxum_solana {
    use super::*;

    // -------------------------------------------------
    // CREATE GAME
    // -------------------------------------------------
    pub fn create_game(ctx: Context<CreateGame>, game_id: u64, title: String) -> Result<()> {
        let game = &mut ctx.accounts.game;

        game.game_id = game_id;
        game.creator = ctx.accounts.creator.key();
        game.title = title;
        game.challenge_count = 0;
        game.created_at = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // -------------------------------------------------
    // CREATE CHALLENGE
    // -------------------------------------------------
    pub fn create_challenge(
        ctx: Context<CreateChallenge>,
        challenge_id: u64,
        target_score: u64,
        entry_fee: u64,
        max_players: u16,
        expiry_time: i64,
        seed: String,
    ) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let game = &mut ctx.accounts.game;

        challenge.challenge_id = challenge_id;
        challenge.game = game.key();
        challenge.creator = ctx.accounts.creator.key();

        challenge.target_score = target_score;
        challenge.entry_fee = entry_fee;
        challenge.max_players = max_players;

        challenge.registered_players = 0;
        challenge.winners = 0;

        challenge.expiry_time = expiry_time;
        challenge.seed = seed;

        challenge.finalized = false;

        game.challenge_count += 1;

        Ok(())
    }

    // -------------------------------------------------
    // JOIN CHALLENGE
    // -------------------------------------------------
    pub fn join_challenge(ctx: Context<JoinChallenge>) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;

        require!(
            challenge.registered_players < challenge.max_players,
            ErrorCode::ChallengeFull
        );

        challenge.registered_players += 1;

        Ok(())
    }

    // -------------------------------------------------
    // SUBMIT SCORE
    // -------------------------------------------------
    pub fn submit_score(ctx: Context<SubmitScore>, score: u64) -> Result<()> {
        let challenge = &mut ctx.accounts.challenge;
        let player_record = &mut ctx.accounts.player_record;

        player_record.player = ctx.accounts.player.key();
        player_record.challenge = challenge.key();
        player_record.score = score;

        if score >= challenge.target_score {
            challenge.winners += 1;
            player_record.won = true;
        } else {
            player_record.won = false;
        }

        Ok(())
    }
}

// =====================================================
// ACCOUNTS
// =====================================================

#[account]
pub struct Game {
    pub game_id: u64,
    pub creator: Pubkey,
    pub title: String,
    pub challenge_count: u64,
    pub created_at: i64,
}

#[account]
pub struct Challenge {
    pub challenge_id: u64,
    pub game: Pubkey,
    pub creator: Pubkey,

    pub target_score: u64,
    pub entry_fee: u64,

    pub max_players: u16,
    pub registered_players: u16,
    pub winners: u16,

    pub expiry_time: i64,

    pub seed: String,

    pub finalized: bool,
}

#[account]
pub struct PlayerRecord {
    pub player: Pubkey,
    pub challenge: Pubkey,
    pub score: u64,
    pub won: bool,
}

// =====================================================
// CONTEXTS
// =====================================================

#[derive(Accounts)]
pub struct CreateGame<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 256
    )]
    pub game: Account<'info, Game>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateChallenge<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 512
    )]
    pub challenge: Account<'info, Challenge>,

    #[account(mut)]
    pub game: Account<'info, Game>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinChallenge<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,

    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct SubmitScore<'info> {
    #[account(mut)]
    pub challenge: Account<'info, Challenge>,

    #[account(
        init,
        payer = player,
        space = 8 + 128
    )]
    pub player_record: Account<'info, PlayerRecord>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// =====================================================
// ERRORS
// =====================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Challenge is already full.")]
    ChallengeFull,
}
