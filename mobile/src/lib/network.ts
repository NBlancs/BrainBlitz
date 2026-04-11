import Constants from "expo-constants";

function getHostFromExpo(): string | null {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as unknown as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } }).manifest2
      ?.extra?.expoClient?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(":")[0] ?? null;
}

export function getGraphqlHttpUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_GRAPHQL_HTTP_URL;
  if (envUrl) {
    return envUrl;
  }

  const host = getHostFromExpo();
  if (host) {
    return `http://${host}:4000/graphql`;
  }

  return "http://localhost:4000/graphql";
}

export const GRAPHQL_HTTP_URL = getGraphqlHttpUrl();
