import { ApolloProvider } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { PressStart2P_400Regular, useFonts } from "@expo-google-fonts/press-start-2p";
import { StatusBar } from "expo-status-bar";
import { apolloClient } from "./src/lib/apollo";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </ApolloProvider>
  );
}
