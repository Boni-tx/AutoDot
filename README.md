<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg" width="60" alt="Next.js" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="60" alt="React" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="60" alt="Tailwind CSS" />
  <br/>

  # 🟢 AutoDot Protocol
  
  **The First Fully Autonomous Bounty Protocol built natively on Portaldot.**
  
  *Official Submission for the Portaldot Mini Hackathon Online Season 1*

  [![Network: Portaldot](https://img.shields.io/badge/Network-Portaldot-22c55e?style=for-the-badge&logo=polkadot&logoColor=white)](https://portaldot.io)
  [![Token: POT](https://img.shields.io/badge/Gas_Token-POT-eab308?style=for-the-badge)](https://portaldot.io)
  [![Status: MVP](https://img.shields.io/badge/Status-Runnable_MVP-3b82f6?style=for-the-badge)](https://github.com/)
  [![AI: Integrated](https://img.shields.io/badge/Oracle-AI_Agent-8b5cf6?style=for-the-badge&logo=openai&logoColor=white)](https://github.com/)

  [▶️ Watch the Demo Video](#) • [🚀 Try the App](#how-to-run-locally) • [📄 Read the Pitch](#)

</div>

---

> **The Problem:** Developers wait weeks for pull request reviews and payments. Sponsors struggle to find trusted developers and audit code securely.
> 
> **The Solution (AutoDot):** Zero humans involved. Sponsors lock POT tokens in a smart contract. Developers write code. An AI Agent audits the PR instantly and triggers the blockchain to release the funds. Trustless, secure, and lightning-fast.

---

## ✨ Hackathon Checklist Validated

| Requirement | How AutoDot Fulfills It |
| :--- | :--- |
| **Built on Portaldot** | The entire protocol logic, UI, fee estimations, and escrow mechanics are natively designed for the Portaldot ecosystem. |
| **Uses POT as Gas** | 100% of the bounties, network fees, and escrow balances are denominated and simulated using the POT token. |
| **Runnable MVP** | A fully interactive, end-to-end Next.js frontend with real-time state synchronization (Dashboard ↔ Workspace). |
| **Application Value** | Disrupts the Web3 gig economy by solving the massive bottleneck of manual code reviews and delayed payouts. |

---

## ⚡ How It Works (The Protocol Flow)

<details>
<summary><b>🛠️ Phase 01: Lock the Bounty (Sponsor)</b></summary>
<br/>
Sponsors deploy a new bounty from their Dashboard. They set the requirements and lock the equivalent <b>POT tokens</b> directly into the Portaldot Escrow Contract. The funds are cryptographically secured. No human intermediaries.
</details>

<details>
<summary><b>🧠 Phase 02: Autonomous Verification (AI Oracle)</b></summary>
<br/>
A developer claims the bounty and submits a Pull Request. Instead of waiting for a human, our integrated AI Agent steps in. It clones the repo, runs static vulnerability scans, checks for gas optimization, and mathematically verifies the code.
</details>

<details>
<summary><b>💸 Phase 03: Trustless Payouts (Smart Contract)</b></summary>
<br/>
The exact moment the AI Agent approves the PR, it signs a transaction and fires a webhook to the blockchain. The Portaldot Escrow contract instantly releases the locked POT funds directly to the developer's wallet.
</details>

---

## 💻 Tech Stack & Architecture

- **Frontend Application:** Next.js 14, React, TypeScript
- **Styling & UI:** Tailwind CSS, Framer Motion (Simulated physics & UI interactions)
- **State Management:** React Context API & LocalStorage (Simulating on-chain state for the MVP)
- **Target Blockchain:** Portaldot Network (Ink! / Substrate environment)
- **Oracle Mechanism:** AI Webhook Integration

---

## 🚀 How to Run Locally

Want to test the magic yourself? Follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Boni-tx/autodot-protocol-mvp.git](https://github.com/Boni-tx/autodot-protocol-mvp.git)
