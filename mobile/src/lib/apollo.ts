import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { getGraphqlHttpUrl } from "./network";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: () => getGraphqlHttpUrl(),
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    },
  },
});
