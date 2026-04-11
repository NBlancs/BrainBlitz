PRD 1: BrainBlitz Trivia

1. Executive Summary
BrainBlitz Trivia is a round-based quiz application designed to test general knowledge across various categories. The game focuses on data fetching efficiency and relational data management. It leverages the relational power of PostgreSQL to manage Category-Question-Answer hierarchies and uses TanStack Query to ensure seamless data synchronization.1
2. Product Features & User Stories
2.1 User Features
Category Selection: Users can view a list of trivia categories (e.g., Science, History) fetched from the server.
Story: "As a player, I want to see a list of categories with icons so I can choose a topic I like."
Game Loop: A standard game consists of 10 questions. Users must answer within a 15-second timer.
Story: "As a player, I want to see a countdown timer for each question; if time runs out, it counts as incorrect." 2
Scoring: Points are awarded for correct answers, with bonus points for speed.
Story: "As a player, I want to see my score update immediately after answering."
Global Leaderboard: A ranking of top players per category.
Story: "As a player, I want to compare my high score against others in the Science category." 3
3. Technical Architecture
3.1 Mobile Frontend (React Native + Expo)
Engine: React Native with Expo.
State Management:
Zustand: Manages the active game session (current question index, selected answer, timer value, UI animations). This state is ephemeral and resets when the game ends.
TanStack Query: Manages server state (fetching categories, caching questions, submitting final scores). It handles the "stale-while-revalidate" logic for the leaderboard.4
3.2 Backend (Node.js + Fastify + Mercurius)
Server: Fastify instance with mercurius plugin for GraphQL.
API Design: The API exposes a getQuestions query that retrieves nested objects (Questions -> Answers) in a single request to prevent over-fetching.
3.3 Database Schema (PostgreSQL + Prisma)
The schema requires strict relationships between static content (Questions) and dynamic content (Scores).

Code snippet


// schema.prisma (Trivia)

model User {
  id        String   @id @default(uuid())
  username  String   @unique
  scores    Score[]
}

model Category {
  id        String     @id @default(uuid())
  name      String
  icon      String
  questions Question[]
  scores    Score[]
}

model Question {
  id         String   @id @default(uuid())
  text       String
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  answers    Answer[]
}

model Answer {
  id         String   @id @default(uuid())
  text       String
  isCorrect  Boolean
  questionId String
  question   Question @relation(fields: [questionId], references: [id])
}

model Score {
  id         String   @id @default(uuid())
  points     Int
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  createdAt  DateTime @default(now())

  @@index([categoryId, points]) // Optimized for category leaderboard
}


3.4 API Requirements (GraphQL SDL)

GraphQL


type Query {
  getCategories: [Category!]!
  getQuestions(categoryId: ID!): [Question!]!
  getLeaderboard(categoryId: ID!): [LeaderboardEntry!]!
}

type Mutation {
  submitScore(userId: ID!, categoryId: ID!, points: Int!): Score!
}