import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainTabNavigator } from "./MainTabNavigator";
import { UsernameScreen } from "../screens/UsernameScreen";
import { useSessionStore } from "../store/useSessionStore";
import { theme } from "../theme";
import { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const token = useSessionStore((state) => state.token);
  const user = useSessionStore((state) => state.user);

  const isAuthenticated = !!token && !!user;

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
      {!isAuthenticated ? (
        <Stack.Screen
          name="Username"
          component={UsernameScreen}
          options={{ title: "BRAINBLITZ // LOGIN", headerBackVisible: false }}
        />
      ) : (
        <Stack.Screen
          name="Categories"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
