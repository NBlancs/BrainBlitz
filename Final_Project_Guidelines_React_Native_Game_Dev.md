# Final Project Guidelines
## Mobile Game Development with React Native

**Course:** Mobile Application & Game Development | Capstone Module  
**Prepared by:** Senior Professor of Game Development

---

Welcome to your capstone project. Over the next several weeks you will design, build, test, and present a fully functional mobile game using React Native. This document is your single source of truth: it explains how to architect a mobile game app, the categories of games you may choose from, the technical challenges you should anticipate, the deliverables you must submit, and exactly how your work will be evaluated. Read it carefully — your grade depends on adhering to its requirements.

---

## Table of Contents

1. [Course Philosophy & Learning Outcomes](#1-course-philosophy--learning-outcomes)
2. [Guidelines for Building a Mobile Game with React Native](#2-guidelines-for-building-a-mobile-game-with-react-native)
3. [Approved Game Genres and Project Ideas](#3-approved-game-genres-and-project-ideas)
4. [Anticipated Technical Challenges](#4-anticipated-technical-challenges)
5. [Project Development Information & Deliverables](#5-project-development-information--deliverables)
6. [Grading Rubric (100 points)](#6-grading-rubric-100-points)
7. [Submission Rules and Academic Integrity](#7-submission-rules-and-academic-integrity)
8. [Recommended Resources](#8-recommended-resources)

---

## 1. Course Philosophy & Learning Outcomes

Game development teaches more than just coding. It teaches systems thinking, performance optimization, user empathy, iteration under constraints, and the discipline to ship. By the end of this project you should be able to:

- Architect a non-trivial React Native application with clear separation between game logic, rendering, and state management.
- Implement a real-time game loop on top of React Native's component model.
- Make informed trade-offs between performance, code clarity, and feature scope.
- Test your application across at least two physical or emulated devices.
- Present and defend your engineering decisions to a technical audience.

---

## 2. Guidelines for Building a Mobile Game with React Native

### 2.1 Choose the Right Toolchain

You may use either the **Expo managed workflow** or the **React Native CLI** (bare workflow). Expo is recommended for most teams because of its faster setup, OTA updates, and built-in APIs (audio, haptics, sensors). Choose React Native CLI only if your game requires a native module that Expo does not support.

- **Language:** TypeScript is required. Static types prevent an entire class of bugs that hurt at the worst time — during your demo.
- **Package manager:** npm or yarn — pick one and stick to it.
- **Version control:** Git with a public or private repository. Commit history will be reviewed.
- **Linting & formatting:** ESLint + Prettier configured before your first feature commit.

### 2.2 Project Structure

Organize your codebase so that any reviewer can find things in under 30 seconds. A clean structure is itself part of your grade.

| Folder | Purpose |
|--------|---------|
| `/src/screens` | Top-level navigable screens (Menu, Game, Settings, GameOver) |
| `/src/components` | Reusable UI components (Button, Score, HUD, Modal) |
| `/src/game` | Pure game logic — no React. Engine, entities, systems, physics. |
| `/src/hooks` | Custom hooks (useGameLoop, useSound, useHighScore) |
| `/src/state` | Global state (Zustand, Redux Toolkit, or Context) |
| `/src/assets` | Images, sounds, fonts, sprite sheets |
| `/src/utils` | Helpers (math, RNG with seed, collision detection) |
| `/src/services` | Persistence (AsyncStorage), analytics, network |
| `/__tests__` | Unit and integration tests |

### 2.3 Pick a Rendering Strategy

React Native's default rendering — Views and StyleSheet — is fine for slow, turn-based games (puzzles, card games, quizzes). For real-time games at 60 FPS, you must use a more appropriate renderer. Choose deliberately and document your choice in the README.

| Renderer | Best For | Notes |
|----------|----------|-------|
| React Native Views | Card games, puzzles, board games, trivia | Easiest. Limited to ~30 FPS for many moving sprites. |
| react-native-skia | 2D action games, particle effects, custom drawings | GPU-accelerated. Recommended sweet spot. |
| react-native-game-engine | Entity–component–system style games | Pairs well with Matter.js for physics. |
| expo-gl + three.js / PixiJS | 3D or sprite-heavy 2D games | Steeper learning curve. Higher reward. |
| WebView + HTML5 canvas | Quick prototypes only | Discouraged for the final submission. |

### 2.4 The Game Loop

Every real-time game needs a loop that updates state, applies physics, checks collisions, and triggers a re-render at a steady cadence. In React Native, prefer `requestAnimationFrame` over `setInterval`. Keep game logic out of components — components should subscribe to a logical store and re-render only when their slice changes.

> **Rule of thumb:** if a frame takes longer than 16ms to compute, players will feel it. Profile early, profile often.

### 2.5 State Management

- **Local UI state:** `useState` / `useReducer` for menus and modals.
- **Game state:** a dedicated store outside React (Zustand is excellent here) that the game loop mutates and components subscribe to.
- **Persistent state:** AsyncStorage or MMKV for high scores, settings, and saves.
- Avoid putting fast-changing values (player position, enemy position) into Context — it will re-render the entire tree.

### 2.6 Assets, Audio, and Haptics

- Compress all images. PNG-8 or WebP for sprites; do not ship 4K assets to a phone.
- Use sprite sheets where possible to reduce draw calls.
- Use `expo-av` or `react-native-sound` for music and SFX. Preload sounds.
- Add haptic feedback (`expo-haptics`) on important events — it makes games feel premium.
- Provide a mute toggle. Always.

### 2.7 Cross-Device Considerations

- Test on at least one Android device and one iOS device (or simulators).
- Use `SafeAreaView` and respect notches and the home indicator.
- Lock orientation explicitly — pick portrait or landscape based on your design.
- Handle screen sizes from 5" to 7" by using percentage-based or scaled units, not hard-coded pixel values.
- Handle backgrounding: pause the game when the user switches apps.

---

## 3. Approved Game Genres and Project Ideas

Choose one game from the categories below, or propose your own (subject to instructor approval). The complexity tier helps calibrate scope to a 6–10 week build with a team of 2–4. Higher tiers receive a small bonus on the technical execution criterion if successfully completed.

### Tier 1 — Foundational *(no real-time rendering required)*

- **Tic-Tac-Toe with AI:** implement a minimax-based opponent with selectable difficulty.
- **Memory / Match-the-Pairs:** animated card flips, multiple themes, and a high-score table.
- **Trivia / Quiz Game:** categories, timer per question, leaderboard, and offline question packs.
- **Word Puzzle (Wordle-style):** daily challenge, share results, custom dictionaries.
- **Sudoku:** generator, solver, hints system, and difficulty tiers.

### Tier 2 — Intermediate *(real-time, single player)*

- **Endless Runner:** procedural obstacles, coins, score multiplier, and unlockables.
- **Snake / Slither:** grid-based or smooth movement, food spawning, growth mechanics.
- **Flappy Bird Clone:** physics-based jump, pipe generation, and a "medal" reward system.
- **Brick Breaker / Pong:** paddle controls, levels, power-ups.
- **2048 / Threes:** swipe gestures, undo, and animated tile merging.
- **Whack-a-Mole:** increasing speed, combos, and special moles.

### Tier 3 — Advanced *(complex systems, optionally networked)*

- **Tower Defense:** waves, multiple tower types, pathfinding, and economy.
- **Top-Down Shooter / Bullet-Hell:** particle effects, multiple enemy AI patterns, boss fights.
- **Platformer:** tile-based level loading, gravity, animation states, collectibles.
- **Multiplayer Tic-Tac-Toe / Chess:** turn-based netcode using Firebase or Supabase Realtime.
- **Augmented Reality Mini-Game:** using Expo's camera and a marker or surface.
- **Rhythm Game:** beat-mapped audio, latency calibration screen.

> **Forbidden:** direct clones of copyrighted IP (no Mario, Pokémon, Among Us). Genre clones are fine; visual or trademark infringement is not.

---

## 4. Anticipated Technical Challenges

Every team hits roughly the same walls. Knowing them in advance gives you a schedule advantage. Plan for these explicitly in your milestones.

### 4.1 Performance & Frame Rate

React Native's bridge can become a bottleneck if you re-render too often. Watch for unnecessary re-renders, large component trees, and synchronous heavy work on the JS thread. Use the new architecture (Fabric/TurboModules) when possible, memoize expensive computations, and offload heavy math to native or to a separate engine layer.

### 4.2 Touch Input Latency & Gestures

The default touch handler is fine for buttons but unsuitable for action games. Use `react-native-gesture-handler` (with worklets where possible via Reanimated) for low-latency input.

### 4.3 Physics & Collision Detection

Implementing physics from scratch is a deep rabbit hole. Use Matter.js (with `react-native-game-engine`) or roll a simple AABB collision system for grid-based games. Don't use a full 2D physics engine for a memory game — it's overkill.

### 4.4 Asset Loading & Memory

Games on mobile devices live within tight memory budgets. Preload assets at the splash screen, dispose of them when scenes end, and never bundle desktop-resolution art. A 50 MB APK is suspect; a 200 MB APK is a fail.

### 4.5 Audio Latency

There will be a delay between calling `play()` and hearing a sound — sometimes hundreds of milliseconds on Android. Preload sounds, use shorter audio formats, and prefer `expo-av`'s Sound objects over `Asset.loadAsync` for SFX.

### 4.6 Save Games & Persistence

AsyncStorage is convenient but slow and asynchronous. For frequent writes (auto-save), use `react-native-mmkv`. Always handle the case where storage is corrupted or empty.

### 4.7 Lifecycle & Backgrounding

Pause your game loop, audio, and timers when `AppState` changes to `'background'`. Resume cleanly. Failing this gracefully is a frequent grade-loser at demo time.

### 4.8 Building & Distribution

EAS Build (for Expo) is the smoothest path to a signed APK / IPA. Reserve a full day at the end of your sprint for build configuration, app icons, splash screens, and store metadata. Builds always fail the first time.

---

## 5. Project Development Information & Deliverables

### 5.1 Team Composition

- Teams of 2 to 4 students. Solo work permitted only with prior approval.
- Designate one team member as **Tech Lead** (architecture decisions) and one as **Project Manager** (Kanban board, meetings, demos).
- Each member must have meaningful, traceable Git contributions.

### 5.2 Project Timeline (10 Weeks)

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 1 | Concept & Pitch | 1-page concept doc + mood board + chosen tier |
| 2 | Technical Design | Architecture diagram, tech stack, repo initialized |
| 3 | Vertical Slice | One playable screen with core mechanic working |
| 4–5 | Core Loop | Full game loop, win/lose conditions, scoring |
| 6 | Mid-Sprint Review | Live in-class demo + peer feedback session |
| 7 | Polish & Audio | Animations, SFX, haptics, settings screen |
| 8 | Testing & Bug Fix | Test report on at least 2 devices + bug log |
| 9 | Build & Package | Signed APK/IPA, app icon, splash screen, README |
| 10 | Final Defense | 20-min presentation + live play + Q&A |

### 5.3 Mandatory Features

Regardless of genre, your final submission must contain **all** of the following:

- A main menu with at least Play, Settings, and Credits.
- A settings screen with sound on/off and at least one other configurable option.
- A persistent high score or progress system using local storage.
- Pause and resume functionality with proper lifecycle handling.
- A clear game over / win screen with a Retry button.
- A splash screen and a custom app icon.
- Sound effects and music, both togglable.
- Onboarding — a tutorial, a how-to-play screen, or a guided first session.
- Stable build on both iOS and Android (or two Android devices if iOS is unavailable).

### 5.4 Required Submissions

1. GitHub repository link with full commit history and a comprehensive README.
2. Signed APK (Android) and, if possible, an IPA or TestFlight link (iOS).
3. Project Report (PDF, 10–15 pages) covering: concept, architecture, technologies used, challenges encountered, individual contributions, screenshots, and lessons learned.
4. Demo video (3–5 minutes) of actual gameplay recorded from a device.
5. Final presentation slides (max 15 slides).
6. Test report documenting testing methodology, bugs found, and resolutions.

### 5.5 Process Expectations

- Use a Kanban board (GitHub Projects, Trello, Jira). It will be reviewed.
- Conduct weekly stand-ups; minutes must be saved in the repo's `/docs` folder.
- Branch protection on `main`; pull requests require at least one teammate review.
- Write at least **10 meaningful unit tests** for game logic (not UI).
- Maintain a `CHANGELOG.md` throughout development.

---

## 6. Grading Rubric (100 points)

Final grades are computed from the breakdown below. Each criterion is graded on a 0–100% scale and weighted by its share of the total.

| Criterion | Weight | What I am looking for |
|-----------|--------|-----------------------|
| Technical Execution | 25 pts | Clean architecture, proper rendering choice, stable 30+ FPS, no crashes, correct lifecycle handling. |
| Gameplay & Design | 20 pts | Fun factor, clear core loop, balanced difficulty, satisfying feedback (juice), polish. |
| Code Quality | 15 pts | TypeScript strictness, naming, separation of concerns, lint-clean, meaningful tests. |
| Completeness of Features | 10 pts | All mandatory features implemented and working without workarounds. |
| Documentation | 10 pts | README quality, project report depth, architecture diagram, in-code comments. |
| Project Management | 5 pts | Kanban hygiene, commit cadence, equal contribution, weekly stand-up minutes. |
| Presentation & Demo | 10 pts | Clarity of slides, live demo without disasters, ability to answer technical questions. |
| Innovation & Polish | 5 pts | Anything that surprises me — clever mechanic, custom shader, accessibility, beyond-the-brief extras. |
| **TOTAL** | **100 pts** | |

### Letter Grade Mapping

| Score Range | Letter Grade | Interpretation |
|-------------|--------------|----------------|
| 95 – 100 | A+ | Production-ready. Submit it to a store. |
| 90 – 94 | A | Excellent. Minor polish away from shipping. |
| 85 – 89 | A− | Strong project with one or two weak areas. |
| 80 – 84 | B+ | Solid; requirements met with clear effort. |
| 75 – 79 | B | Functional but rough edges in code or UX. |
| 70 – 74 | B− | Meets minimum bar; missing polish or one feature. |
| 60 – 69 | C | Passable but with significant gaps. |
| 50 – 59 | D | Submitted but largely incomplete. |
| < 50 | F | Does not meet course requirements. |

### Penalties

- **Late submission:** −10% per calendar day, capped at 50%.
- **Build does not run on submission:** −20% flat. Test before you ship.
- **Missing required deliverable** (report, video, APK, repo): −10% each.
- **Unequal contribution** (verified by Git history and peer evaluations): individual score adjusted independently of team score.
- **Plagiarism or unattributed code/assets:** automatic zero and academic referral.

---

## 7. Submission Rules and Academic Integrity

- Submit a single ZIP archive named `TeamName_FinalProject.zip` on the LMS.
- The archive must contain: APK/IPA, project report PDF, slides PDF, demo video MP4, and a `repo_link.txt` with the Git URL.
- Tag your final commit as `v1.0-final` and do not push to it after the deadline.
- All third-party assets must be free-to-use or licensed; cite every source in `CREDITS.md`.
- AI tools (including LLMs) are permitted for boilerplate, debugging, and learning, but you must **disclose their use** in the report and you must **understand every line you ship**. The professor reserves the right to ask you to explain any function in your codebase during the defense.
- Re-using code from a previous course is plagiarism unless explicitly approved.

---

## 8. Recommended Resources

### Documentation

- [React Native official docs](https://reactnative.dev)
- [Expo documentation](https://docs.expo.dev)
- [react-native-skia](https://shopify.github.io/react-native-skia)
- [react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated)

### Books & Reading

- *Game Programming Patterns* — Robert Nystrom (free online)
- *The Art of Game Design: A Book of Lenses* — Jesse Schell
- *Designing Games* — Tynan Sylvester

### Tools

- [Aseprite](https://www.aseprite.org/) or [Piskel](https://www.piskelapp.com/) — pixel art and sprite sheets
- [Audacity](https://www.audacityteam.org/) or [BFXR](https://www.bfxr.net/) — sound effect creation
- [Tiled](https://www.mapeditor.org/) — level editor for tile-based games
- [EAS Build](https://docs.expo.dev/build/introduction/) — cloud builds for Expo
- Flipper / React DevTools — performance profiling

---

> **Final word.** Ship something you are proud to show. The students whose projects I remember years later are not the ones who built the most ambitious thing — they are the ones who built something small, complete, and polished, and who could explain every choice they made. Good luck. I am looking forward to playing your game.
>
> *— Senior Professor of Game Development*
