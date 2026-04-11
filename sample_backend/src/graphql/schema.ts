export const schema = /* GraphQL */ `
  type User {
    id: ID!
    username: String!
    createdAt: String!
    scores: [Score!]!
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
    """Fetch all available trivia categories."""
    getCategories: [Category!]!

    """Fetch 10 random questions (or fewer if unavailable) for a category."""
    getQuestions(categoryId: ID!, limit: Int = 10): [Question!]!

    """Fetch top player high scores for a specific category."""
    getLeaderboard(categoryId: ID!, limit: Int = 10): [LeaderboardEntry!]!

    """Fetch a user by username to restore local sessions."""
    userByUsername(username: String!): User
  }

  type Mutation {
    """Create or return an existing user by username."""
    createUser(username: String!): User!

    """Submit answers and compute final score server-side."""
    submitScore(userId: ID!, categoryId: ID!, answers: [SubmittedAnswerInput!]!): Score!
  }
`;
