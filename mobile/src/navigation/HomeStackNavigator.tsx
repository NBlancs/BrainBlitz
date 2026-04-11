import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CategoryScreen } from "../screens/CategoryScreen";
import { GameScreen } from "../screens/GameScreen";
import { LeaderboardScreen } from "../screens/LeaderboardScreen";
import { theme } from "../theme";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: theme.colors.border,
        headerTitleStyle: {
          fontFamily: theme.fonts.mono,
          fontSize: 14,
          fontWeight: "700",
        },
      }}
    >
      <Stack.Screen name="Categories" component={CategoryScreen} options={{ title: "SELECT MISSION" }} />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={({ route }) => ({ title: `${route.params.category.name.toUpperCase()} // ROUND` })}
      />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: "GLOBAL LEADERBOARD" }} />
    </Stack.Navigator>
  );
}