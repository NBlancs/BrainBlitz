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
  query GetQuestions($categoryId: ID!, $difficulty: Difficulty!, $country: Country!) {
    getQuestions(categoryId: $categoryId, difficulty: $difficulty, country: $country) {
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

export const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $password: String!, $name: String!, $age: Int!) {
    register(username: $username, password: $password, name: $name, age: $age) {
      token
      user {
        id
        username
        name
        age
        ageGroup
        totalPoints
        badge
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        name
        age
        ageGroup
        totalPoints
        badge
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
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
