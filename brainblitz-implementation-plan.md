# BrainBlitz — Feature Implementation Plan

> Stack: React Native + Expo · Zustand · TanStack Query · Fastify · GraphQL (Mercurius) · Prisma · PostgreSQL

---

## Asset Reference

All images live in `mobile/assets/`. Import them with `@/assets/<filename>` (or relative paths depending on your tsconfig alias).

| File | Used for |
|---|---|
| `bronze_rank.png` | Bronze badge — `BadgeIcon.tsx` |
| `silver_rank.png` | Silver badge — `BadgeIcon.tsx` |
| `gold_rank.png` | Gold badge — `BadgeIcon.tsx` |
| `scholar_rank.png` | Scholar badge — `BadgeIcon.tsx` |
| `heart_active.png` | Heart with lives remaining — `HeartsDisplay.tsx` |
| `heart_lose.png` | Heart slot after losing a life — `HeartsDisplay.tsx` |
| `check.png` | Correct answer feedback — answer result UI |
| `wrong.png` | Wrong answer feedback — answer result UI |
| `brainblitz_splash.png` | Splash / loading screen |
| `brainblitz.png` | App logo / header |

---

## Suggested Build Order

> **05 → 06 → 01 → 02 → 03 → 04**
>
> Build the data foundation (difficulty + randomization) before the gameplay mechanics that depend on it.

---

## Feature 01 — User Onboarding (name & age modal)

**Scope:** Full-stack · **Estimated effort:** ~1 day · Low complexity

### Database

- Add `name` (String) and `age` (Int) fields to the `User` model in `schema.prisma`
- Add `ageGroup` enum — `KIDS` (≤12), `TEEN` (13–17), `ADULT` (18+) — derived from `age`, stored for query convenience
- Run `npx prisma migrate dev --name add_user_profile`

### Backend

- Extend the `createUser` mutation to accept `name: String!` and `age: Int!` args
- Compute and persist `ageGroup` in the resolver before writing to DB
- Return `{ id, name, age, ageGroup }` from the mutation for the client to cache via TanStack Query

### Frontend

- Create `OnboardingModal.tsx` — shown once on first launch; state persisted via AsyncStorage through Zustand `userStore`
- Form fields: text input for name + numeric input for age. Validate: name non-empty, age 1–120
- On submit, call the `createUser` mutation via `useMutation`; redirect to home on success
- On app start, check for a persisted user (`useEffect`); skip the modal if already onboarded

---

## Feature 02 — Rankings Badge System (Bronze, Silver, Gold, Scholar)

**Scope:** Full-stack · **Estimated effort:** ~1–2 days · Low-medium complexity

### Database

- Add `badge` enum — `BRONZE | SILVER | GOLD | SCHOLAR` — to the `User` model
- Add `totalPoints` (Int) to `User` for fast badge computation without aggregating all scores on every request
- Run migration `add_badge_system`

### Backend

- Write a `computeBadge(totalPoints)` helper:
  - Bronze ≥ 100 pts
  - Silver ≥ 500 pts
  - Gold ≥ 1,000 pts
  - Scholar ≥ 2,500 pts *(tune thresholds as needed)*
- Update the `submitScore` mutation: increment `totalPoints` on `User`, then recompute and persist `badge`
- Expose `badge` and `totalPoints` on the `User` GraphQL type

### Frontend

- Create `BadgeIcon.tsx`: maps each badge tier to its corresponding image asset using a lookup object —

  ```ts
  import bronzeImg  from '@/assets/bronze_rank.png';
  import silverImg  from '@/assets/silver_rank.png';
  import goldImg    from '@/assets/gold_rank.png';
  import scholarImg from '@/assets/scholar_rank.png';

  const BADGE_ASSETS = {
    BRONZE:  bronzeImg,
    SILVER:  silverImg,
    GOLD:    goldImg,
    SCHOLAR: scholarImg,
  } as const;

  // Usage: <Image source={BADGE_ASSETS[badge]} style={{ width: 32, height: 32 }} />
  ```

- Display the badge `<Image>` next to the username on the profile screen and leaderboard entries
- Show a badge-earned modal/toast animation when the `badge` field changes after a score submission

---

## Feature 03 — Hearts System (3 lives per session)

**Scope:** Frontend only · **Estimated effort:** ~1 day

### Frontend (Zustand game store)

- Add `hearts: number` (default `3`) and `heartsDepletedAt: number | null` (Unix timestamp) to Zustand `gameStore`
- On every wrong answer, call `decrementHeart()` — subtracts 1 heart. If `hearts` reaches `0`, set `heartsDepletedAt = Date.now()` and block navigation to any category
- Persist `hearts` and `heartsDepletedAt` to AsyncStorage so state survives app restarts
- Create `HeartsDisplay.tsx` — renders 3 heart images in the game header using the actual assets:

  ```ts
  import heartActive from '@/assets/heart_active.png';
  import heartLose   from '@/assets/heart_lose.png';

  // Render one Image per slot; swap source based on remaining hearts
  // e.g. slot index is active if index < hearts, lost otherwise
  <Image source={index < hearts ? heartActive : heartLose} style={{ width: 28, height: 28 }} />
  ```

  Animate the transitioning heart with a shake + scale-down effect on loss (use `Animated.sequence`)
- Show a `HeartsGoneModal.tsx` when all hearts are lost, displaying the countdown to next refill (see Feature 04)

---

## Feature 04 — 1-Hour Lockout When All Hearts Are Gone

**Scope:** Frontend only · **Estimated effort:** ~0.5 days

### Frontend

- On app/screen focus, check `heartsDepletedAt`: if `Date.now() - heartsDepletedAt >= 3_600_000` (1 hr), reset `hearts = 3` and `heartsDepletedAt = null`
- Gate the category list screen: render each category card as disabled when `hearts === 0` and lockout is still active
- Display a live countdown `HH:MM:SS` timer on the locked state — use a `setInterval` that reads `heartsDepletedAt` every second and computes remaining time
- Show a friendly, game-toned message explaining the lockout so younger users understand without frustration

---

## Feature 05 — Difficulty Level Modal When Choosing a Category

**Scope:** Full-stack · **Estimated effort:** ~1 day · Low-medium complexity

> ⚠️ This feature requires backfilling `difficulty` values on all existing seed questions before deploying to avoid null constraint violations.

### Database

- Add `difficulty` enum — `EASY | MEDIUM | HARD` — to the `Question` model in `schema.prisma`
- Update existing seed data to tag every question with a difficulty level; aim for a balanced distribution per category
- Run migration `add_question_difficulty`

### Backend

- Update `getQuestions` query signature: `getQuestions(categoryId: ID!, difficulty: Difficulty!): [Question!]!`
- Add `Difficulty` enum type to the GraphQL SDL
- Filter questions by both `categoryId` and `difficulty` in the resolver

### Frontend

- Create `DifficultyModal.tsx` — presented after tapping a category card, before the game starts. Three option cards: Easy, Medium, Hard with descriptive subtitles appropriate per age group
- Store the chosen difficulty in Zustand `gameStore` as `difficulty: 'EASY' | 'MEDIUM' | 'HARD'`
- Pass `difficulty` as a variable to the `getQuestions` TanStack Query call so only matching questions are fetched

---

## Feature 06 — Randomized Questions Filtered by Difficulty

**Scope:** Full-stack · **Estimated effort:** ~0.5–1 day · Low complexity

### Backend

- In the `getQuestions` resolver, after filtering by `categoryId` + `difficulty`, apply Postgres `ORDER BY RANDOM()` via `$queryRaw` — randomizes at the DB level, avoiding the cost of fetching all rows to shuffle in Node
- Add `LIMIT 10` (configurable constant) so only the required question count is returned per session

### Frontend

- Remove any existing client-side shuffle — rely on the randomized server response instead
- Set TanStack Query `staleTime: 0` on `getQuestions` so a fresh random set is fetched on every new game start, never served from cache
- Ensure the game loop in `gameStore` resets question index and all session state when a new question set loads

---

## Schema Changes Summary

```prisma
// User model additions
model User {
  id          String   @id @default(uuid())
  username    String   @unique
  name        String                          // Feature 01
  age         Int                             // Feature 01
  ageGroup    AgeGroup                        // Feature 01
  totalPoints Int      @default(0)            // Feature 02
  badge       Badge    @default(BRONZE)       // Feature 02
  scores      Score[]
}

enum AgeGroup { KIDS TEEN ADULT }             // Feature 01
enum Badge    { BRONZE SILVER GOLD SCHOLAR }  // Feature 02

// Question model addition
model Question {
  id         String     @id @default(uuid())
  text       String
  difficulty Difficulty                        // Feature 05
  categoryId String
  category   Category   @relation(fields: [categoryId], references: [id])
  answers    Answer[]
}

enum Difficulty { EASY MEDIUM HARD }          // Feature 05
```

---

## GraphQL SDL Changes Summary

```graphql
enum AgeGroup  { KIDS TEEN ADULT }
enum Badge     { BRONZE SILVER GOLD SCHOLAR }
enum Difficulty { EASY MEDIUM HARD }

type User {
  id          ID!
  username    String!
  name        String!
  age         Int!
  ageGroup    AgeGroup!
  totalPoints Int!
  badge       Badge!
  scores      [Score!]!
}

type Query {
  getCategories: [Category!]!
  getQuestions(categoryId: ID!, difficulty: Difficulty!): [Question!]!
  getLeaderboard(categoryId: ID!): [LeaderboardEntry!]!
}

type Mutation {
  createUser(username: String!, name: String!, age: Int!): User!
  submitScore(userId: ID!, categoryId: ID!, points: Int!): Score!
}
```
