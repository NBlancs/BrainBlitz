import { ApolloProvider } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { apolloClient } from "./src/lib/apollo";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}
