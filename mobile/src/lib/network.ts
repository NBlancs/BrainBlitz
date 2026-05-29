import { useNetworkStore } from "../store/useNetworkStore";
import { normalizeServerUrl } from "./serverDiscovery";

const DEFAULT_FALLBACK = "https://brainblitz-production.up.railway.app/graphql";

export function getGraphqlHttpUrl(): string {
  const storeUrl = useNetworkStore.getState().serverUrl;
  // Only use the stored URL if it's been explicitly set to something other than the default
  if (storeUrl && storeUrl !== DEFAULT_FALLBACK) {
    return storeUrl;
  }

  // In production APKs, the env var will be "localhost" which is useless.
  // Only use it if it points to a real IP (not localhost).
  const envUrl = process.env.EXPO_PUBLIC_GRAPHQL_HTTP_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl;
  }

  return DEFAULT_FALLBACK;
}

/**
 * Save a server URL after normalizing it.
 * The URL is normalized to ensure it has the correct port and path.
 */
export function updateGraphqlHttpUrl(url: string) {
  const normalized = normalizeServerUrl(url);
  useNetworkStore.getState().setServerUrl(normalized);
}

export const GRAPHQL_HTTP_URL = getGraphqlHttpUrl();
