#![no_std]

use soroban_sdk::{contracttype, Address, BytesN};

#[derive(Clone)]
#[contracttype]
pub enum SessionStatus {
    InProgress,
    Won,
    Lost,
    Finalized,
}

#[derive(Clone)]
#[contracttype]
pub struct Session {
    pub id: BytesN<32>,
    pub player: Address,
    pub day_id: u32,
    pub attempts_used: u32,
    pub max_attempts: u32,
    pub status: SessionStatus,
    pub finalized: bool,
    pub started_at: u64,
    pub updated_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct PlayerStreak {
    pub current: u32,
    pub max: u32,
    pub last_day_played: u32,
}

#[derive(Clone)]
#[contracttype]
pub struct DayConfig {
    pub day_id: u32,
    pub puzzle_commitment: BytesN<32>,
    pub max_attempts: u32,
    pub closes_at: u64,
    pub published: bool,
}

#[derive(Clone)]
#[contracttype]
pub struct GuessResult {
    pub attempt_no: u32,
    pub outcome_code: u32,
    pub is_correct: bool,
}
