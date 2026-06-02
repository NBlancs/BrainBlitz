import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LeaderboardHubScreen } from "../screens/LeaderboardHubScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RulesScreen } from "../screens/RulesScreen";
import { playClickSound } from "../lib/soundManager";
import { theme } from "../theme";
import { MainTabParamList } from "../types";
import { HomeStackNavigator } from "./HomeStackNavigator";

const Tab = createBottomTabNavigator<MainTabParamList>();

type PixelIconName = "home" | "leaderboard" | "rules" | "profile";

const ICONS: Record<PixelIconName, number[][]> = {
  home: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  leaderboard: [
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  rules: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  profile: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
  ],
};

function PixelTabIcon({ name, focused }: { name: PixelIconName; focused: boolean }) {
  const matrix = ICONS[name];
  const color = focused ? theme.colors.primary : theme.colors.border;

  return (
    <View style={styles.iconWrap}>
      {matrix.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.iconRow}>
          {row.map((cell, cellIndex) => (
            <View
              key={`cell-${rowIndex}-${cellIndex}`}
              style={[
                styles.pixel,
                {
                  backgroundColor: cell ? color : "transparent",
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const tabBarBottomInset = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: theme.fonts.mono,
          fontSize: 12,
          fontWeight: "700",
        },
        headerTintColor: theme.colors.border,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopWidth: 3,
          borderTopColor: theme.colors.border,
          height: 58 + tabBarBottomInset,
          paddingBottom: tabBarBottomInset,
          paddingTop: 8,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.border,
        tabBarLabelStyle: {
          fontFamily: theme.fonts.mono,
          fontSize: 9,
          fontWeight: "700",
        },
        tabBarIcon: ({ focused }) => {
          if (route.name === "HomeTab") {
            return <PixelTabIcon name="home" focused={focused} />;
          }

          if (route.name === "LeaderboardTab") {
            return <PixelTabIcon name="leaderboard" focused={focused} />;
          }

          if (route.name === "RulesTab") {
            return <PixelTabIcon name="rules" focused={focused} />;
          }

          return <PixelTabIcon name="profile" focused={focused} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        listeners={{
          tabPress: () => {
            void playClickSound();
          },
        }}
        options={{
          title: "HOME",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="LeaderboardTab"
        component={LeaderboardHubScreen}
        listeners={{
          tabPress: () => {
            void playClickSound();
          },
        }}
        options={{
          title: "LEADERBOARD",
        }}
      />
      <Tab.Screen
        name="RulesTab"
        component={RulesScreen}
        listeners={{
          tabPress: () => {
            void playClickSound();
          },
        }}
        options={{
          title: "RULES",
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        listeners={{
          tabPress: () => {
            void playClickSound();
          },
        }}
        options={{
          title: "PROFILE",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconRow: {
    flexDirection: "row",
    height: 3,
  },
  pixel: {
    width: 3,
    height: 3,
    margin: 0,
  },
});