#![no_std]

use soroban_sdk::Env;

pub const SECONDS_PER_DAY: u64 = 86_400;

pub fn current_day_id(env: &Env) -> u32 {
    (env.ledger().timestamp() / SECONDS_PER_DAY) as u32
}
