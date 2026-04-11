import { create } from "zustand";
import { Question, SubmittedAnswer } from "../types";

type GameStatus = "idle" | "active" | "complete";

type GameState = {
  status: GameStatus;
  questions: Question[];
  currentIndex: number;
  currentRemainingMs: number;
  submissions: SubmittedAnswer[];
  startRound: (questions: Question[]) => void;
  setRemainingMs: (value: number) => void;
  submitAnswer: (answer: SubmittedAnswer) => void;
  advanceQuestion: () => void;
  completeRound: () => void;
  resetRound: () => void;
};

const QUESTION_TIME_MS = 15000;

export const useGameStore = create<GameState>((set) => ({
  status: "idle",
  questions: [],
  currentIndex: 0,
  currentRemainingMs: QUESTION_TIME_MS,
  submissions: [],

  startRound: (questions) =>
    set({
      status: "active",
      questions,
      currentIndex: 0,
      currentRemainingMs: QUESTION_TIME_MS,
      submissions: [],
    }),

  setRemainingMs: (value) => set({ currentRemainingMs: Math.max(value, 0) }),

  submitAnswer: (answer) =>
    set((state) => ({
      submissions: [...state.submissions, answer],
    })),

  advanceQuestion: () =>
    set((state) => ({
      currentIndex: state.currentIndex + 1,
      currentRemainingMs: QUESTION_TIME_MS,
    })),

  completeRound: () =>
    set({
      status: "complete",
      currentRemainingMs: 0,
    }),

  resetRound: () =>
    set({
      status: "idle",
      questions: [],
      currentIndex: 0,
      currentRemainingMs: QUESTION_TIME_MS,
      submissions: [],
    }),
}));
