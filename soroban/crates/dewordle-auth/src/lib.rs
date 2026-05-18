#![no_std]

use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum AuthStorageKey {
    Admin,
}

pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&AuthStorageKey::Admin, admin);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&AuthStorageKey::Admin)
        .expect("admin not set")
}

pub fn require_admin(env: &Env) {
    let admin = get_admin(env);
    admin.require_auth();
}
