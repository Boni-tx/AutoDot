#![cfg_attr(not(feature = "std"), no_std)]

/// AutoDot Escrow Smart Contract
/// Built with Polkadot ink! for the Hackathon
/// 
/// This contract holds the POT funds securely until the AI Verifier
/// (or the Sponsor) approves the Pull Request on GitHub.

#[ink::contract]
mod autodot_escrow {
    /// Defines the state of the escrow
    #[ink(storage)]
    pub struct Escrow {
        sponsor: AccountId,
        developer: Option<AccountId>,
        pot_amount: Balance,
        is_completed: bool,
    }

    impl Escrow {
        /// Initializes the escrow with the sponsor's address
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                sponsor: Self::env().caller(),
                developer: None,
                pot_amount: 0,
                is_completed: false,
            }
        }

        /// Sponsor deposits funds into the smart contract
        #[ink(message, payable)]
        pub fn lock_funds(&mut self, task_id: u32) {
            let value = Self::env().transferred_value();
            assert!(value > 0, "Deposit must be greater than zero");
            assert!(!self.is_completed, "Task is already completed");
            
            self.pot_amount += value;
            
            ink::env::debug_println!(
                "Locked {} POT for task {}", 
                value, task_id
            );
        }

        /// Dev accepts the task (simulated register)
        #[ink(message)]
        pub fn register_developer(&mut self) {
            assert!(self.developer.is_none(), "Developer already assigned");
            self.developer = Some(Self::env().caller());
        }

        /// AI Verifier Agent calls this when PR is merged
        /// Releases funds to the developer
        #[ink(message)]
        pub fn ai_approve_work(&mut self) {
            // In a real scenario, only the registered AI oracle can call this
            assert!(!self.is_completed, "Already completed");
            assert!(self.developer.is_some(), "No developer assigned");
            
            let dev = self.developer.unwrap();
            let payout = self.pot_amount;
            
            // Transfer funds to dev
            if Self::env().transfer(dev, payout).is_ok() {
                self.is_completed = true;
                self.pot_amount = 0;
            }
        }

        /// Get current bounty status
        #[ink(message)]
        pub fn get_status(&self) -> (Balance, bool) {
            (self.pot_amount, self.is_completed)
        }
    }
}