export const schema = /* GraphQL */ `
  enum AgeGroup {
    KIDS
    TEEN
    ADULT
  }

  enum Badge {
    BRONZE
    SILVER
    GOLD
    SCHOLAR
  }

  enum Difficulty {
    EASY
    MEDIUM
    HARD
  }

  enum Country {
    PHILIPPINES
    UNITED_STATES
    GREAT_BRITAIN
    CHINA
    JAPAN
    SOUTH_KOREA
  }

  type User {
    id: ID!
    username: String!
    name: String!
    age: Int!
    ageGroup: AgeGroup!
    totalPoints: Int!
    badge: Badge!
    createdAt: String!
    scores: [Score!]!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type Category {
    id: ID!
    name: String!
    icon: String!
    questionCount: Int!
  }

  type Question {
    id: ID!
    text: String!
    categoryId: ID!
    answers: [Answer!]!
  }

  type Answer {
    id: ID!
    text: String!
    isCorrect: Boolean!
  }

  type Score {
    id: ID!
    points: Int!
    correctAnswers: Int!
    totalQuestions: Int!
    speedBonus: Int!
    user: User!
    category: Category!
    createdAt: String!
  }

  type LeaderboardEntry {
    rank: Int!
    user: User!
    points: Int!
    createdAt: String!
  }

  input SubmittedAnswerInput {
    questionId: ID!
    answerId: ID
    responseTimeMs: Int!
  }

  type Query {
    """Fetch the currently authenticated user session."""
    me: User

    """Fetch all available trivia categories."""
    getCategories: [Category!]!

    """Fetch 10 random questions for a category at a specific difficulty."""
    getQuestions(categoryId: ID!, difficulty: Difficulty!, country: Country!): [Question!]!

    """Fetch top player high scores for a specific category."""
    getLeaderboard(categoryId: ID!): [LeaderboardEntry!]!

    """Fetch a user by username to restore local sessions."""
    userByUsername(username: String!): User
  }

  type Mutation {
    """Register a new player account with password."""
    register(username: String!, password: String!, name: String!, age: Int!): AuthResponse!

    """Log in an existing player with username and password."""
    login(username: String!, password: String!): AuthResponse!

    """Create or return an existing user by username with name and age profile (Legacy/Unauthenticated)."""
    createUser(username: String!, name: String!, age: Int!): User!

    """Submit answers and compute final score server-side (Authenticated)."""
    submitScore(userId: ID!, categoryId: ID!, answers: [SubmittedAnswerInput!]!): Score!
  }
`;
