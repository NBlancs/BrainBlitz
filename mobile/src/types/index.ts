export type User = {
  id: string;
  username: string;
  name: string;
  age: number;
  ageGroup: "KIDS" | "TEEN" | "ADULT";
  totalPoints: number;
  badge: "BRONZE" | "SILVER" | "GOLD" | "SCHOLAR";
  createdAt?: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  questionCount: number;
};

export type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  text: string;
  categoryId: string;
  answers: Answer[];
};

export type SubmittedAnswer = {
  questionId: string;
  answerId: string | null;
  responseTimeMs: number;
  isCorrect: boolean;
};

export type RootStackParamList = {
  Username: undefined;
  Categories: undefined;
  Game: { category: Category };
  Leaderboard: { category: Category; latestScore?: number };
};

export type MainTabParamList = {
  HomeTab: undefined;
  LeaderboardTab: undefined;
  RulesTab: undefined;
  ProfileTab: undefined;
};

export type Country = "PHILIPPINES" | "UNITED_STATES" | "GREAT_BRITAIN" | "CHINA" | "JAPAN" | "SOUTH_KOREA";
