#![no_std]

use dewordle_auth::{require_admin, set_admin};
use dewordle_types::{DayConfig, GuessResult, PlayerStreak, Session, SessionStatus};
use dewordle_utils::current_day_id;
use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env, Symbol};

#[derive(Clone)]
#[contracttype]
enum DataKey {
    DayConfig(u32),
    Session(BytesN<32>),
    SessionNonce(Address, u32),
    Streak(Address),
}

#[contract]
pub struct CoreGameContract;

#[contractimpl]
impl CoreGameContract {
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&Symbol::new(&env, "initialized")) {
            panic!("already initialized");
        }

        set_admin(&env, &admin);
        env.storage()
            .instance()
            .set(&Symbol::new(&env, "initialized"), &true);
    }

    pub fn set_day_config(
        env: Env,
        day_id: u32,
        puzzle_commitment: BytesN<32>,
        max_attempts: u32,
        closes_at: u64,
    ) {
        require_admin(&env);

        if max_attempts == 0 {
            panic!("max_attempts must be > 0");
        }

        let config = DayConfig {
            day_id,
            puzzle_commitment,
            max_attempts,
            closes_at,
            published: true,
        };

        env.storage().persistent().set(&DataKey::DayConfig(day_id), &config);

        env.events()
            .publish((Symbol::new(&env, "day_published"), day_id), config);
    }

    pub fn create_session(env: Env, player: Address, day_id: u32, nonce: u32) -> BytesN<32> {
        player.require_auth();

        let config: DayConfig = env
            .storage()
            .persistent()
            .get(&DataKey::DayConfig(day_id))
            .expect("day config not found");

        if !config.published {
            panic!("day not active");
        }

        if env.ledger().timestamp() > config.closes_at {
            panic!("day closed");
        }

        let nonce_key = DataKey::SessionNonce(player.clone(), nonce);
        if env.storage().persistent().has(&nonce_key) {
            panic!("nonce already used");
        }

        let session_id = env.crypto().sha256(&soroban_sdk::Bytes::from_array(
            &env,
            &[
                (day_id & 0xff) as u8,
                ((day_id >> 8) & 0xff) as u8,
                ((day_id >> 16) & 0xff) as u8,
                ((day_id >> 24) & 0xff) as u8,
                (nonce & 0xff) as u8,
                ((nonce >> 8) & 0xff) as u8,
                ((nonce >> 16) & 0xff) as u8,
                ((nonce >> 24) & 0xff) as u8,
            ],
        ));

        let session = Session {
            id: session_id.clone(),
            player: player.clone(),
            day_id,
            attempts_used: 0,
            max_attempts: config.max_attempts,
            status: SessionStatus::InProgress,
            finalized: false,
            started_at: env.ledger().timestamp(),
            updated_at: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Session(session_id.clone()), &session);
        env.storage().persistent().set(&nonce_key, &true);

        env.events().publish(
            (Symbol::new(&env, "session_started"), player, day_id),
            session_id.clone(),
        );

        session_id
    }

    pub fn submit_guess(
        env: Env,
        player: Address,
        session_id: BytesN<32>,
        guess_commitment: BytesN<32>,
        outcome_code: u32,
        is_correct: bool,
    ) -> GuessResult {
        player.require_auth();
        let mut session: Session = env
            .storage()
            .persistent()
            .get(&DataKey::Session(session_id.clone()))
            .expect("session not found");

        if session.player != player {
            panic!("unauthorized session owner");
        }

        if session.finalized {
            panic!("session already finalized");
        }

        if session.attempts_used >= session.max_attempts {
            panic!("attempt limit reached");
        }

        session.attempts_used += 1;
        session.updated_at = env.ledger().timestamp();

        if is_correct {
            session.status = SessionStatus::Won;
        } else if session.attempts_used >= session.max_attempts {
            session.status = SessionStatus::Lost;
        }

        let result = GuessResult {
            attempt_no: session.attempts_used,
            outcome_code,
            is_correct,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Session(session_id.clone()), &session);

        env.events().publish(
            (Symbol::new(&env, "guess_submitted"), session_id),
            (guess_commitment, result.clone()),
        );

        result
    }

    pub fn finalize_session(env: Env, player: Address, session_id: BytesN<32>) -> Session {
        player.require_auth();

        let mut session: Session = env
            .storage()
            .persistent()
            .get(&DataKey::Session(session_id.clone()))
            .expect("session not found");

        if session.player != player {
            panic!("unauthorized session owner");
        }

        if session.finalized {
            panic!("already finalized");
        }

        if matches!(session.status, SessionStatus::InProgress) {
            panic!("session still in progress");
        }

        session.finalized = true;
        session.status = SessionStatus::Finalized;
        session.updated_at = env.ledger().timestamp();
        env.storage()
            .persistent()
            .set(&DataKey::Session(session_id.clone()), &session);

        Self::update_streak(&env, &player);

        env.events()
            .publish((Symbol::new(&env, "session_finalized"), session_id), player);

        session
    }

    pub fn get_session(env: Env, session_id: BytesN<32>) -> Session {
        env.storage()
            .persistent()
            .get(&DataKey::Session(session_id))
            .expect("session not found")
    }

    pub fn get_day_config(env: Env, day_id: u32) -> DayConfig {
        env.storage()
            .persistent()
            .get(&DataKey::DayConfig(day_id))
            .expect("day config not found")
    }

    pub fn get_streak(env: Env, player: Address) -> PlayerStreak {
        env.storage()
            .persistent()
            .get(&DataKey::Streak(player))
            .unwrap_or(PlayerStreak {
                current: 0,
                max: 0,
                last_day_played: 0,
            })
    }

    fn update_streak(env: &Env, player: &Address) {
        let mut streak = env
            .storage()
            .persistent()
            .get(&DataKey::Streak(player.clone()))
            .unwrap_or(PlayerStreak {
                current: 0,
                max: 0,
                last_day_played: 0,
            });

        let day = current_day_id(env);

        if streak.last_day_played + 1 == day {
            streak.current += 1;
        } else if streak.last_day_played != day {
            streak.current = 1;
        }

        if streak.current > streak.max {
            streak.max = streak.current;
        }

        streak.last_day_played = day;
        env.storage()
            .persistent()
            .set(&DataKey::Streak(player.clone()), &streak);

        env.events()
            .publish((Symbol::new(env, "streak_updated"), player), streak);
    }
}
