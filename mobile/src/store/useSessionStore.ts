import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types";

type SessionState = {
  user: User | null;
  token: string | null;
  avatarSeed: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAvatarSeed: (seed: string | null) => void;
  clearUser: () => void;
  logout: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      avatarSeed: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAvatarSeed: (seed) => set({ avatarSeed: seed }),
      clearUser: () => set({ user: null, token: null, avatarSeed: null }),
      logout: () => set({ user: null, token: null, avatarSeed: null }),
    }),
    {
      name: "brainblitz-session",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
