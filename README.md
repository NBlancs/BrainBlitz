# 🧠 BrainBlitz Trivia

BrainBlitz is a round-based retro arcade-themed quiz application designed to test general knowledge across various categories. The project leverages the relational power of **PostgreSQL** to manage question-answer hierarchies, uses a **Node.js Fastify + GraphQL** backend, and delivers a premium **React Native + Expo** mobile frontend experience with arcade-style visuals and audio feedback.

---

## 🛠️ Tech Stack & Architecture

### 1. Mobile Frontend (`/mobile`)
- **Framework**: React Native + Expo (v54, TypeScript)
- **State Management**:
  - **Zustand**: Manages ephemeral game state (active questions, timer blocks, selection feedback, user sessions).
  - **Apollo Client (GraphQL)**: Synchronizes server state (fetching shuffled categories, leaderboard rankings, and submitting round scores).
- **Audio & Visuals**: Retro 8-bit aesthetic utilizing `@expo-google-fonts/press-start-2p`, Custom Pixel Borders, custom sound indicators, and transitional animation overlays.
- **Dynamic IP Auto-Discovery**: Integrated local Wi-Fi subnet ping scanner that searches for the Fastify server dynamically.

### 2. Backend Server (`/sample_backend`)
- **Runtime**: Node.js + TypeScript (ESM)
- **API Engine**: Fastify server registered with Mercurius GraphQL (Apollo compatible).
- **Database Connector**: Prisma Client (ORM).

### 3. Database (`PostgreSQL`)
- PostgreSQL relational schemas managing `User`, `Category`, `Question`, `Answer`, and `Score` entities.
- Optimizations: Compound composite index `[categoryId, points(sort: Desc)]` on the `Score` model for sub-millisecond leaderboard queries.

---

## 🌟 Key Features Added & Refactored

1. **Production-Ready DB Provisioning Script** (`npm run db:setup`):
   - Auto-checks system environments (CLI checks).
   - Provisions database & users/roles with robust safety prompts.
   - Deploys database schemas and registers `uuid-ossp` and `pgcrypto` extensions.
   - Populates exactly **10 retro-styled fallback questions** for each of the 13 categories (totaling 130 seed questions).
   - Generates verified, formatted row-count terminal summaries.
2. **Audio-Visual Wrong Answer Feedback**:
   - Triggers `wrong.mp3` and pops out a 600ms retro Red "X" cross-mark overlay ([wrong.png](file:///c:/Users/bnoel/OneDrive/Desktop/programming/brainblitz/mobile/src/assets/wrong.png)) when an incorrect option is clicked.
3. **Expanded Category Selection & Random Ordering**:
   - Expanded to **13 active categories** (Science, History, Geography, Books, Film, Music, Television, Video Games, Mythology, Sports, Art, Animals, Vehicles).
   - Shuffles categories on the server side so they load in a fresh, randomized order on the frontend on every request.
4. **Dynamic Network Settings & LAN Auto-Discovery**:
   - Tapping the **⚙️ CONFIGURE SERVER** cog on the Username screen or Category error view opens a configuration modal.
   - Users can manually edit the server URL or tap **AUTO-DISCOVER** to scan the local Wi-Fi ranges for the backend, enabling the shared APK to run seamlessly on any network.

---

## 🚀 Quick Start Guide

For full details, please refer to the main [setup.md](file:///c:/Users/bnoel/OneDrive/Desktop/programming/brainblitz/setup.md) runner guide.

### 🔌 1. Backend & Database
1. Update `sample_backend/.env` with your PostgreSQL password:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/brainblitz
   ```
2. Navigate, install, and bootstrap:
   ```bash
   cd sample_backend
   npm install
   npm run db:setup -- --force --seed
   npm run dev
   ```

### 📱 2. Mobile Client
1. Navigate and install:
   ```bash
   cd mobile
   npm install
   ```
2. Start the Expo builder:
   ```bash
   npm run start
   ```
   Scan the Metro QR code on your phone using **Expo Go** (ensure both devices are connected to the same Wi-Fi).

---

## 📲 APK Sharing & LAN Configuration

If you compile the application as a standalone APK (`npx expo run:android --variant release`) and share it with other players on your Wi-Fi:
1. Ensure the host computer is running the Fastify server on the local network.
2. Open the app on the phone, tap **⚙️ CONFIGURE SERVER** at the bottom, and click **AUTO-DISCOVER**.
3. Once the server is found, click **SAVE** to persist the configuration.
