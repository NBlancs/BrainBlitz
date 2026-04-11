import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types";

type SessionState = {
  user: User | null;
  avatarSeed: string | null;
  setUser: (user: User) => void;
  setAvatarSeed: (seed: string) => void;
  clearUser: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      avatarSeed: null,
      setUser: (user) => set({ user }),
      setAvatarSeed: (seed) => set({ avatarSeed: seed }),
      clearUser: () => set({ user: null, avatarSeed: null }),
    }),
    {
      name: "brainblitz-session",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
