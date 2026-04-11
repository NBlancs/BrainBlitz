import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CategoryScreen } from "../screens/CategoryScreen";
import { GameScreen } from "../screens/GameScreen";
import { LeaderboardScreen } from "../screens/LeaderboardScreen";
import { UsernameScreen } from "../screens/UsernameScreen";
import { useSessionStore } from "../store/useSessionStore";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const user = useSessionStore((state) => state.user);

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Username"
          component={UsernameScreen}
          options={{ title: "Welcome to BrainBlitz", headerBackVisible: false }}
        />
      ) : (
        <>
          <Stack.Screen name="Categories" component={CategoryScreen} options={{ title: "Categories" }} />
          <Stack.Screen
            name="Game"
            component={GameScreen}
            options={({ route }) => ({ title: route.params.category.name })}
          />
          <Stack.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={({ route }) => ({ title: `${route.params.category.name} Leaderboard` })}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
