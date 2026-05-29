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
      serverUrl: "https://brainblitz-production.up.railway.app/graphql",
      setServerUrl: (url) => set({ serverUrl: url }),
    }),
    {
      name: "brainblitz-network-v2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
