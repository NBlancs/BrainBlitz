import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
      icon
      questionCount
    }
  }
`;

export const GET_QUESTIONS = gql`
  query GetQuestions($categoryId: ID!, $limit: Int) {
    getQuestions(categoryId: $categoryId, limit: $limit) {
      id
      text
      categoryId
      answers {
        id
        text
        isCorrect
      }
    }
  }
`;

export const GET_LEADERBOARD = gql`
  query GetLeaderboard($categoryId: ID!, $limit: Int) {
    getLeaderboard(categoryId: $categoryId, limit: $limit) {
      rank
      points
      createdAt
      user {
        id
        username
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!) {
    createUser(username: $username) {
      id
      username
      createdAt
    }
  }
`;

export const SUBMIT_SCORE = gql`
  mutation SubmitScore($userId: ID!, $categoryId: ID!, $answers: [SubmittedAnswerInput!]!) {
    submitScore(userId: $userId, categoryId: $categoryId, answers: $answers) {
      id
      points
      correctAnswers
      totalQuestions
      speedBonus
      createdAt
      user {
        id
        username
      }
      category {
        id
        name
      }
    }
  }
`;
