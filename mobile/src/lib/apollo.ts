import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getGraphqlHttpUrl } from "./network";
import { useSessionStore } from "../store/useSessionStore";

const httpLink = createHttpLink({
  uri: () => getGraphqlHttpUrl(),
});

const authLink = setContext((_, { headers }) => {
  const token = useSessionStore.getState().token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
  },
});
