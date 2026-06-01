import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BadgeIcon } from "../components/BadgeIcon";
import { buildPixelAvatarUri, createAvatarChoices, createRandomAvatarSeed } from "../lib/avatar";
import { withClickSound } from "../lib/soundManager";
import { useSessionStore } from "../store/useSessionStore";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case "BRONZE":
      return "#CD7F32";
    case "SILVER":
      return "#C0C0C0";
    case "GOLD":
      return "#FFD700";
    case "SCHOLAR":
      return "#9B5DE5";
    default:
      return theme.colors.primary;
  }
};

export function ProfileScreen() {
  const user = useSessionStore((state) => state.user);
  const avatarSeed = useSessionStore((state) => state.avatarSeed);
  const setAvatarSeed = useSessionStore((state) => state.setAvatarSeed);
  const clearUser = useSessionStore((state) => state.clearUser);
  const [avatarChoices, setAvatarChoices] = useState<string[]>([]);

  const baseSeed = useMemo(() => user?.id ?? user?.username ?? "guest", [user?.id, user?.username]);

  const generateChoices = useCallback(() => {
    setAvatarChoices(createAvatarChoices(baseSeed));
  }, [baseSeed]);

  useEffect(() => {
    generateChoices();
  }, [generateChoices]);

  useEffect(() => {
    if (!avatarSeed) {
      setAvatarSeed(createRandomAvatarSeed(baseSeed));
    }
  }, [avatarSeed, baseSeed, setAvatarSeed]);

  const selectedSeed = avatarSeed ?? `${baseSeed}-default`;
  const selectedAvatarUri = buildPixelAvatarUri(selectedSeed, 160);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.card}>
        <Text style={styles.kicker}>PLAYER PROFILE</Text>
        {user?.badge ? (
          <View style={styles.rankSection}>
            <Text style={styles.rankLabel}>CURRENT RANK</Text>
            <View style={styles.rankContent}>
              <BadgeIcon badge={user.badge} size={72} />
              <Text style={[styles.rankValue, { color: getBadgeColor(user.badge) }]}>
                {user.badge}
              </Text>
            </View>
          </View>
        ) : null}
        <View style={styles.profileRow}>
          <Image source={{ uri: selectedAvatarUri }} style={styles.avatarPreview} />
          <View style={styles.profileMeta}>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{user?.username ?? "GUEST"}</Text>
            </View>
            <Text style={styles.detail}>STATUS: READY FOR NEXT ROUND</Text>
            {user ? (
              <View style={styles.profileStats}>
                <Text style={styles.statLabel}>NAME: {user.name.toUpperCase()}</Text>
                <Text style={styles.statLabel}>AGE: {user.age} ({user.ageGroup})</Text>
                <Text style={styles.statLabel}>SCORE: {user.totalPoints} PTS</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.kicker}>PICK PIXEL CHARACTER</Text>
        <View style={styles.choicesGrid}>
          {avatarChoices.map((seed) => {
            const isSelected = seed === selectedSeed;

            return (
              <Pressable
                key={seed}
                style={({ pressed }) => [
                  styles.choiceButton,
                  isSelected && styles.choiceButtonSelected,
                  pressed && styles.choiceButtonPressed,
                ]}
                onPress={withClickSound(() => setAvatarSeed(seed))}
              >
                <Image source={{ uri: buildPixelAvatarUri(seed, 96) }} style={styles.choiceAvatar} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.choiceActions}>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]} onPress={withClickSound(generateChoices)}>
            <Text style={styles.secondaryButtonText}>SHUFFLE CHARACTERS</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={withClickSound(() => setAvatarSeed(createRandomAvatarSeed(baseSeed)))}
          >
            <Text style={styles.secondaryButtonText}>USE RANDOM CHARACTER</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutButtonPressed]} onPress={withClickSound(clearUser)}>
        <Text style={styles.signOutText}>SIGN OUT</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    padding: 16,
    gap: 8,
  },
  rankSection: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  rankLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    letterSpacing: 1.5,
  },
  rankContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
  },
  rankValue: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarPreview: {
    width: 96,
    height: 96,
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
  },
  profileMeta: {
    flex: 1,
    gap: 6,
  },
  kicker: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  profileStats: {
    marginTop: 4,
    gap: 4,
  },
  statLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    color: theme.colors.border,
  },
  detail: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
  },
  choicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 2,
  },
  choiceButton: {
    ...pixelBorder(2),
    backgroundColor: theme.colors.background,
    padding: 4,
  },
  choiceButtonSelected: {
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
  },
  choiceButtonPressed: {
    transform: [{ translateY: 2 }],
  },
  choiceAvatar: {
    width: 64,
    height: 64,
  },
  choiceActions: {
    marginTop: 8,
    gap: 8,
  },
  secondaryButton: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    ...arcadeShadow(3),
  },
  secondaryButtonPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  secondaryButtonText: {
    color: theme.colors.border,
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textAlign: "center",
  },
  signOutButton: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    ...arcadeShadow(4),
  },
  signOutButtonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  signOutText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});