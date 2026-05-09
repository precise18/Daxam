<!-- LOGO -->
<p align="center">
  <!-- Replace with your logo: <img src="./assets/logo.png" alt="Daxam Logo" width="180" /> -->
  <h1 align="center">Daxam</h1>
  <p align="center"><strong>The Social Layer of Competitive Web3 Gaming</strong></p>
  <p align="center">
    TikTok-style discovery &nbsp;·&nbsp; Roblox-inspired creation &nbsp;·&nbsp; Solana-powered rewards
  </p>
</p>

---

<!-- BANNER -->
<!-- Replace with your own banner image -->
<p align="center">
  <img src="./assets/banner.png" alt="Daxam Banner" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=flat-square" alt="Node version" />
  <img src="https://img.shields.io/badge/built%20on-Solana-9945FF?style=flat-square&logo=solana" alt="Solana" />
  <img src="https://img.shields.io/badge/framework-React-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/status-In%20Development-orange?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" />
</p>

---

## Table of Contents

- [About Daxam](#about-daxam)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [How It Works](#how-it-works)
- [dApp Infrastructure](#dapp-infrastructure)
- [Features](#features)
- [NFT Badge System](#nft-badge-system)
- [Why Solana](#why-solana)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Revenue Model](#revenue-model)
- [Future Plans](#future-plans)
- [Team](#team)
- [Contributing](#contributing)
- [License](#license)

---

## About Daxam

**Daxam** is a decentralised Social-Fi gaming platform — built like TikTok, designed like Roblox, and powered by Solana.

It is the social layer of competitive Web3 gaming: a place where users scroll through games, join live challenges, compete for real stakes, and earn transparent on-chain rewards. Creators launch challenge economies. Players earn from skill. Communities grow around the games they love.

> *"Gaming should be an interactive economy — not passive consumption."*

---

## The Problem

Traditional gaming platforms extract value while the people who power them — creators and players — own nothing.

### Players have no ownership

Gamers invest time, money, effort, and reputation into platforms that give them no meaningful stake in return. Skins, scores, and reputations are locked in walled gardens.

### Creators struggle to monetise

Most game ecosystems centralise profits, suppress smaller creators, and offer no direct monetisation tools. The builders of communities see little reward.

### Competitive gaming is fragmented

<!-- Replace with a screenshot of fragmented gaming landscape if available -->
<!-- ![Fragmented Gaming](./assets/problem-fragmentation.png) -->

Challenges and competitions happen off-platform, lack transparency, rely on centralised trust, and are difficult to scale globally.

### Social discovery is weak

Gaming UX has not evolved alongside social media. There are no creator-focused feeds, no algorithmic discovery loops, and no modern engagement systems built for games.

---

## The Solution

Daxam combines **social discovery**, **Web3 ownership**, **challenge economies**, and **creator monetisation** into a single decentralised platform.

<!-- Replace with a product screenshot -->
<!-- ![Daxam Feed](./assets/screenshot-feed.png) -->

| Web2 Inspiration | Web3 Innovation |
|---|---|
| TikTok-style feed | On-chain game discovery |
| Competitive gaming | Transparent challenge systems |
| Creator platforms | Direct monetisation tools |
| Social profiles | Wallet-based identity |

The result: every game can become an economy. Every player can become a creator. Every challenge can become an opportunity.

[Live Demo](https://daxam.vercel.app)

---

## How It Works

### Step 1 — Discover games

Users scroll a dynamic, algorithm-driven game feed. Each card surfaces active challenges, reward pools, participation stats, and creator identity.

<!-- Replace with screenshot -->
<!-- ![Discovery Feed](./assets/screenshot-discover.png) -->

### Step 2 — Join a challenge

Players enter challenges by staking a participation fee. The entry is recorded on-chain; no intermediaries, no trust required.

<!-- Replace with screenshot -->
<!-- ![Join Challenge](./assets/screenshot-join.png) -->

### Step 3 — Compete

Players submit scores or gameplay outcomes within the challenge window.

### Step 4 — Earn rewards

Winners receive payouts automatically and transparently on-chain. Creators earn a revenue share from every entry fee — the more engagement, the more they earn.

<!-- Replace with screenshot -->
<!-- ![Rewards](./assets/screenshot-rewards.png) -->

---

## dApp Infrastructure

<!-- Replace the placeholder below with your infrastructure diagram -->
![dApp Infrastructure Diagram](./assets/infra-diagram-one.jpeg)
![dApp Infrastructure Diagram](./assets/infra-diagram-two.jpeg)
![dApp Infrastructure Diagram](./assets/infra-diagram-three.jpeg)

> **[Infrastructure diagrams]** — This section will contain the full dApp workflow diagram showing the interaction between the React frontend, Node.js/PostgreSQL backend, Solana/Anchor smart contracts, and IPFS/Arweave storage layer.

The platform follows an event-driven architecture with off-chain indexing and PostgreSQL caching for performance, while all financial transactions and identity verification remain on-chain.

---

## Features

- **TikTok-style game feed** — Infinite scroll discovery with algorithmic surfacing of active challenges and trending games.
- **Challenge economy** — Players stake entry fees; creators set up competitive pools; winners are paid out automatically on-chain.
- **NFT badge system** — Reputation and access control baked into wallet-based identity (see [NFT Badge System](#nft-badge-system)).
- **Creator monetisation** — Creators earn a share of every challenge entry, with tools to launch, manage, and grow their game economies.
- **Real-time leaderboards** — Live competitive standings visible to all participants during an active challenge.
- **Wallet-based identity** — No usernames and passwords; your Solana wallet is your identity, reputation, and access key.
- **Transparent on-chain rewards** — All payouts are distributed programmatically via Solana smart contracts — auditable by anyone.
- **AI-friendly creator tools** — Designed for the age of AI; creators can vibe-code games and experiences and deploy them directly into the Daxam ecosystem.

---

## NFT Badge System

Daxam uses a two-tier NFT badge system for access control and reputation.

### 🔵 Blue Badge — Verified Participant

The Blue Badge is the gateway to the Daxam ecosystem. It is required to:

- Create challenges
- Join and participate in challenges
- Establish a verified identity on the platform

The Blue Badge reduces spam, improves trust, and ensures every participant is a genuine member of the community.

### 🟠 Orange Badge — Premium / Elite Access

The Orange Badge is the elite tier, unlocking expanded platform capabilities:

- Access to high-stakes tournaments
- Governance participation
- Creator boosts and featured feed placement
- Advanced monetisation tools
- Premium visibility across the platform
- Fee discounts

---

## Why Solana

Daxam is built on Solana for reasons that go beyond preference — it is the only chain that meets the technical demands of a high-frequency gaming economy.

- **Extremely low transaction fees** — Sub-cent fees make microtransaction-heavy gaming mechanics economically viable for everyday users.
- **High throughput and speed** — Rapid confirmation times with no congestion bottlenecks.
- **Mobile-first ecosystem** — Solana Mobile Stack (SMS) and React Native integration support native iOS and Android experiences.
- **Mature developer tooling** — Frameworks like Anchor accelerate development and allow faster iteration.
- **Dynamic state sharding** — Solana scales with demand, keeping the platform fast as the user base grows.
- **Growing ecosystem** — Significant funding, collaboration, and adoption opportunities across DeFi, gaming, and consumer apps.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Node.js, PostgreSQL |
| Blockchain | Solana, Anchor |
| Storage | IPFS, Arweave |
| Architecture | Event-driven, off-chain indexing |

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20.0.0`
- **npm** `>= 9.0.0`
- A Solana wallet (e.g. Phantom, Backpack)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/daxam.git
cd daxam

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:3000` by default.

### Environment variables

Create a `.env` file in the root directory:

```env
# Solana
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com

# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/daxam
PORT=4000

# Storage
IPFS_API_URL=
ARWEAVE_KEY=
```

> Reach out to the team for testnet credentials and private environment values.

---

### Solana Programs (Smart Contracts) 
Deployed Program ID: ```E4Jugxr4jmV2DTuNMpmSButZiV27mAy44nYSv8Eks1xj```

---

## Revenue Model

Daxam generates revenue through multiple compounding streams:

| Stream | Description |
|---|---|
| Challenge platform fees | A percentage of every challenge entry fee |
| Premium badge sales | Orange Badge NFT minting and secondary royalties |
| Creator subscriptions | Recurring subscriptions for advanced creator tools |
| Tournament sponsorships | Brand partnerships for featured tournaments |
| Featured placement | Promoted game slots in the discovery feed |

---

## Future Plans

The current platform is the foundation. The roadmap ahead includes:

- **AI anti-cheat system** — Automated detection of score manipulation and gameplay fraud, keeping competitions fair at scale.
- **Live tournaments** — Structured bracket-format tournaments with large prize pools and sponsored events.
- **DAO governance** — Orange Badge holders gain voting rights over platform parameters, fee structures, and ecosystem direction.
- **Expanded creator economies** — Deeper tools for creators to build, monetise, and govern their own game sub-ecosystems.
- **Esports integrations** — Partnerships and pipeline integrations with professional esports organisations and leagues.
- **Cross-game reputation** — A portable, on-chain reputation score that travels with your wallet across all games on the platform.

---

## Team

Daxam is built by a focused team at the intersection of product, gaming, and Web3 development.

| Name | Role |
|---|---|
| **Paballo Precision Malepa** | Presenter / Pitcher |
| **Ian Wright** | Team Leader / Product Manager |
| **Njuguna Captain** | Developer / Domain Expert |

---

## Contributing

We welcome contributions from the community. To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please open an issue first if you are proposing a significant change.

---

## License

This project is licensed under the  AGPL-3.0 License. See the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Built with ⚡ on Solana &nbsp;·&nbsp; <strong>Daxam</strong> — Every player a creator. Every challenge an economy. Every game a world.
</p>