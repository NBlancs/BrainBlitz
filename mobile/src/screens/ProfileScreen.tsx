import { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { buildPixelAvatarUri, createAvatarChoices, createRandomAvatarSeed } from "../lib/avatar";
import { useSessionStore } from "../store/useSessionStore";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";

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
        <View style={styles.profileRow}>
          <Image source={{ uri: selectedAvatarUri }} style={styles.avatarPreview} />
          <View style={styles.profileMeta}>
            <Text style={styles.username}>{user?.username ?? "GUEST"}</Text>
            <Text style={styles.detail}>STATUS: READY FOR NEXT ROUND</Text>
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
                onPress={() => setAvatarSeed(seed)}
              >
                <Image source={{ uri: buildPixelAvatarUri(seed, 96) }} style={styles.choiceAvatar} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.choiceActions}>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]} onPress={generateChoices}>
            <Text style={styles.secondaryButtonText}>SHUFFLE CHARACTERS</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={() => setAvatarSeed(createRandomAvatarSeed(baseSeed))}
          >
            <Text style={styles.secondaryButtonText}>USE RANDOM CHARACTER</Text>
          </Pressable>
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutButtonPressed]} onPress={clearUser}>
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
  username: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
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