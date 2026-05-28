import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NetworkState = {
  serverUrl: string;
  setServerUrl: (url: string) => void;
};

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      serverUrl: "http://localhost:4000/graphql",
      setServerUrl: (url) => set({ serverUrl: url }),
    }),
    {
      name: "brainblitz-network",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
