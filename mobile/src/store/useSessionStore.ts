import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types";

type SessionState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "brainblitz-session",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
