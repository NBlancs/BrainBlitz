import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { GRAPHQL_HTTP_URL } from "./network";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_HTTP_URL,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
  },
});
