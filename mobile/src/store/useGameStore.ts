import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Question, SubmittedAnswer } from "../types";

type GameStatus = "idle" | "active" | "complete";

type GameState = {
  status: GameStatus;
  questions: Question[];
  currentIndex: number;
  currentRemainingMs: number;
  submissions: SubmittedAnswer[];
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
  hearts: number;
  heartsDepletedAt: number | null;
  startRound: (questions: Question[]) => void;
  setRemainingMs: (value: number) => void;
  submitAnswer: (answer: SubmittedAnswer) => void;
  advanceQuestion: () => void;
  completeRound: () => void;
  resetRound: () => void;
  setDifficulty: (diff: "EASY" | "MEDIUM" | "HARD" | null) => void;
  decrementHeart: () => void;
  checkRefill: () => boolean;
};

const QUESTION_TIME_MS = 15000;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      status: "idle",
      questions: [],
      currentIndex: 0,
      currentRemainingMs: QUESTION_TIME_MS,
      submissions: [],
      difficulty: null,
      hearts: 3,
      heartsDepletedAt: null,

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
        set((state) => {
          let nextHearts = state.hearts;
          let nextHeartsDepletedAt = state.heartsDepletedAt;
          if (!answer.isCorrect) {
            nextHearts = Math.max(0, state.hearts - 1);
            if (nextHearts === 0 && !nextHeartsDepletedAt) {
              nextHeartsDepletedAt = Date.now();
            }
          }
          return {
            submissions: [...state.submissions, answer],
            hearts: nextHearts,
            heartsDepletedAt: nextHeartsDepletedAt,
          };
        }),

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
          difficulty: null,
        }),

      setDifficulty: (difficulty) => set({ difficulty }),

      decrementHeart: () =>
        set((state) => {
          const nextHearts = Math.max(0, state.hearts - 1);
          const nextHeartsDepletedAt = nextHearts === 0 && !state.heartsDepletedAt ? Date.now() : state.heartsDepletedAt;
          return {
            hearts: nextHearts,
            heartsDepletedAt: nextHeartsDepletedAt,
          };
        }),

      checkRefill: () => {
        const { heartsDepletedAt } = get();
        if (heartsDepletedAt && Date.now() - heartsDepletedAt >= 3600000) {
          set({ hearts: 3, heartsDepletedAt: null });
          return true;
        }
        return false;
      },
    }),
    {
      name: "brainblitz-game-persist",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hearts: state.hearts,
        heartsDepletedAt: state.heartsDepletedAt,
      }),
    }
  )
);
