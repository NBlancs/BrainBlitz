import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Country, Question, SubmittedAnswer } from "../types";

type GameStatus = "idle" | "active" | "complete";

type GameState = {
  status: GameStatus;
  questions: Question[];
  currentIndex: number;
  currentRemainingMs: number;
  submissions: SubmittedAnswer[];
  difficulty: "EASY" | "MEDIUM" | "HARD" | null;
  country: Country | null;
  hearts: number;
  heartsDepletedAt: number | null;
  consecutiveCorrect: number;
  activeCategoryId: string | null;
  categoryHearts: Record<string, number>;
  categoryHeartsDepletedAt: Record<string, number | null>;
  startRound: (questions: Question[]) => void;
  setRemainingMs: (value: number) => void;
  submitAnswer: (answer: SubmittedAnswer) => void;
  advanceQuestion: () => void;
  completeRound: () => void;
  resetRound: () => void;
  setDifficulty: (diff: "EASY" | "MEDIUM" | "HARD" | null) => void;
  setCountry: (country: Country | null) => void;
  decrementHeart: () => void;
  checkRefill: () => boolean;
  setActiveCategory: (categoryId: string) => void;
  checkAllRefills: () => void;
  getCategoryHearts: (categoryId: string) => number;
  getCategoryHeartsDepletedAt: (categoryId: string) => number | null;
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
      country: null,
      hearts: 3,
      heartsDepletedAt: null,
      consecutiveCorrect: 0,
      activeCategoryId: null,
      categoryHearts: {},
      categoryHeartsDepletedAt: {},

      startRound: (questions) =>
        set({
          status: "active",
          questions,
          currentIndex: 0,
          currentRemainingMs: QUESTION_TIME_MS,
          submissions: [],
          consecutiveCorrect: 0,
        }),

      setRemainingMs: (value) => set({ currentRemainingMs: Math.max(value, 0) }),

      submitAnswer: (answer) =>
        set((state) => {
          let nextHearts = state.hearts;
          let nextHeartsDepletedAt = state.heartsDepletedAt;
          let nextConsecutiveCorrect = state.consecutiveCorrect;

          if (answer.isCorrect) {
            nextConsecutiveCorrect += 1;
            if (nextConsecutiveCorrect === 3) {
              nextHearts = Math.min(3, state.hearts + 1);
              if (nextHearts > 0) {
                nextHeartsDepletedAt = null;
              }
              nextConsecutiveCorrect = 0; // Reset streak after awarding a heart
            }
          } else {
            nextConsecutiveCorrect = 0; // Reset streak on incorrect answer
            nextHearts = Math.max(0, state.hearts - 1);
            if (nextHearts === 0 && !nextHeartsDepletedAt) {
              nextHeartsDepletedAt = Date.now();
            }
          }

          const activeCategoryId = state.activeCategoryId;
          const nextCategoryHearts = { ...state.categoryHearts };
          const nextCategoryHeartsDepletedAt = { ...state.categoryHeartsDepletedAt };
          if (activeCategoryId) {
            nextCategoryHearts[activeCategoryId] = nextHearts;
            nextCategoryHeartsDepletedAt[activeCategoryId] = nextHeartsDepletedAt;
          }

          return {
            submissions: [...state.submissions, answer],
            hearts: nextHearts,
            heartsDepletedAt: nextHeartsDepletedAt,
            consecutiveCorrect: nextConsecutiveCorrect,
            categoryHearts: nextCategoryHearts,
            categoryHeartsDepletedAt: nextCategoryHeartsDepletedAt,
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
          country: null,
        }),

      setDifficulty: (difficulty) => set({ difficulty }),
      setCountry: (country) => set({ country }),

      decrementHeart: () =>
        set((state) => {
          const nextHearts = Math.max(0, state.hearts - 1);
          const nextHeartsDepletedAt = nextHearts === 0 && !state.heartsDepletedAt ? Date.now() : state.heartsDepletedAt;
          
          const activeCategoryId = state.activeCategoryId;
          const nextCategoryHearts = { ...state.categoryHearts };
          const nextCategoryHeartsDepletedAt = { ...state.categoryHeartsDepletedAt };
          if (activeCategoryId) {
            nextCategoryHearts[activeCategoryId] = nextHearts;
            nextCategoryHeartsDepletedAt[activeCategoryId] = nextHeartsDepletedAt;
          }

          return {
            hearts: nextHearts,
            heartsDepletedAt: nextHeartsDepletedAt,
            categoryHearts: nextCategoryHearts,
            categoryHeartsDepletedAt: nextCategoryHeartsDepletedAt,
          };
        }),

      checkRefill: () => {
        const { activeCategoryId, categoryHeartsDepletedAt } = get();
        if (activeCategoryId) {
          const depletedAt = categoryHeartsDepletedAt[activeCategoryId];
          if (depletedAt && Date.now() - depletedAt >= 300000) {
            set((state) => {
              const nextCategoryHearts = { ...state.categoryHearts, [activeCategoryId]: 3 };
              const nextCategoryHeartsDepletedAt = { ...state.categoryHeartsDepletedAt, [activeCategoryId]: null };
              return {
                hearts: 3,
                heartsDepletedAt: null,
                categoryHearts: nextCategoryHearts,
                categoryHeartsDepletedAt: nextCategoryHeartsDepletedAt,
              };
            });
            return true;
          }
        }
        return false;
      },

      setActiveCategory: (categoryId) => {
        set((state) => {
          const depletedAt = state.categoryHeartsDepletedAt[categoryId] || null;
          let currentHearts = state.categoryHearts[categoryId] !== undefined ? state.categoryHearts[categoryId] : 3;
          let currentDepletedAt = depletedAt;

          if (depletedAt && Date.now() - depletedAt >= 300000) {
            currentHearts = 3;
            currentDepletedAt = null;
            const nextCategoryHearts = { ...state.categoryHearts, [categoryId]: 3 };
            const nextCategoryHeartsDepletedAt = { ...state.categoryHeartsDepletedAt, [categoryId]: null };
            return {
              activeCategoryId: categoryId,
              hearts: 3,
              heartsDepletedAt: null,
              categoryHearts: nextCategoryHearts,
              categoryHeartsDepletedAt: nextCategoryHeartsDepletedAt,
            };
          }

          return {
            activeCategoryId: categoryId,
            hearts: currentHearts,
            heartsDepletedAt: currentDepletedAt,
          };
        });
      },

      checkAllRefills: () => {
        set((state) => {
          let modified = false;
          const nextCategoryHearts = { ...state.categoryHearts };
          const nextCategoryHeartsDepletedAt = { ...state.categoryHeartsDepletedAt };
          let nextHearts = state.hearts;
          let nextHeartsDepletedAt = state.heartsDepletedAt;

          for (const [catId, depletedAt] of Object.entries(nextCategoryHeartsDepletedAt)) {
            if (depletedAt && Date.now() - depletedAt >= 300000) {
              nextCategoryHearts[catId] = 3;
              nextCategoryHeartsDepletedAt[catId] = null;
              modified = true;

              if (catId === state.activeCategoryId) {
                nextHearts = 3;
                nextHeartsDepletedAt = null;
              }
            }
          }

          if (modified) {
            return {
              categoryHearts: nextCategoryHearts,
              categoryHeartsDepletedAt: nextCategoryHeartsDepletedAt,
              hearts: nextHearts,
              heartsDepletedAt: nextHeartsDepletedAt,
            };
          }
          return {};
        });
      },

      getCategoryHearts: (categoryId) => {
        const hearts = get().categoryHearts[categoryId];
        return hearts !== undefined ? hearts : 3;
      },

      getCategoryHeartsDepletedAt: (categoryId) => {
        return get().categoryHeartsDepletedAt[categoryId] || null;
      },
    }),
    {
      name: "brainblitz-game-persist",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hearts: state.hearts,
        heartsDepletedAt: state.heartsDepletedAt,
        categoryHearts: state.categoryHearts,
        categoryHeartsDepletedAt: state.categoryHeartsDepletedAt,
      }),
    }
  )
);
