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
  query GetQuestions($categoryId: ID!, $difficulty: Difficulty!) {
    getQuestions(categoryId: $categoryId, difficulty: $difficulty) {
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
  query GetLeaderboard($categoryId: ID!) {
    getLeaderboard(categoryId: $categoryId) {
      rank
      points
      createdAt
      user {
        id
        username
        badge
      }
    }
  }
`;

export const USER_BY_USERNAME = gql`
  query UserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      username
      name
      age
      ageGroup
      totalPoints
      badge
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $name: String!, $age: Int!) {
    createUser(username: $username, name: $name, age: $age) {
      id
      username
      name
      age
      ageGroup
      totalPoints
      badge
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
        name
        age
        ageGroup
        badge
        totalPoints
      }
      category {
        id
        name
      }
    }
  }
`;
