import { useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AnimatedReveal } from "../components/AnimatedReveal";
import { buildPixelAvatarUri, createUserAvatarSeed } from "../lib/avatar";
import { GET_LEADERBOARD } from "../lib/queries";
import { useSessionStore } from "../store/useSessionStore";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Leaderboard">;

type LeaderboardEntry = {
  rank: number;
  points: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
  };
};

type LeaderboardResponse = {
  getLeaderboard: LeaderboardEntry[];
};

export function LeaderboardScreen({ route, navigation }: Props) {
  const { category, latestScore } = route.params;
  const sessionUserId = useSessionStore((state) => state.user?.id);
  const selectedAvatarSeed = useSessionStore((state) => state.avatarSeed);

  const { data, loading, error, refetch } = useQuery<LeaderboardResponse>(GET_LEADERBOARD, {
    variables: {
      categoryId: category.id,
      limit: 20,
    },
    fetchPolicy: "network-only",
  });

  return (
    <View style={styles.container}>
      <AnimatedReveal style={styles.contentWrap}>
        <Text style={styles.title}>GLOBAL LEADERBOARD</Text>

        {typeof latestScore === "number" ? (
          <View style={styles.latestCard}>
            <Text style={styles.latestLabel}>YOUR LATEST SCORE</Text>
            <Text style={styles.latestValue}>{latestScore} pts</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.loadingText}>SYNCING LEADERBOARD...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorTitle}>Could not load leaderboard</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]} onPress={() => refetch()}>
              <Text style={styles.primaryButtonText}>RETRY</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={data?.getLeaderboard ?? []}
            keyExtractor={(item) => `${item.user.id}-${item.rank}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <AnimatedReveal delay={90 + index * 55} duration={220} fromY={10}>
                <View style={styles.row}>
                  <View
                    style={[
                      styles.rankBadge,
                      item.rank === 1
                        ? styles.rankFirst
                        : item.rank === 2
                          ? styles.rankSecond
                          : item.rank === 3
                            ? styles.rankThird
                            : styles.rankDefault,
                    ]}
                  >
                    <Text style={styles.rank}>#{item.rank}</Text>
                  </View>
                  {(() => {
                    const seed =
                      item.user.id === sessionUserId && selectedAvatarSeed
                        ? selectedAvatarSeed
                        : createUserAvatarSeed(item.user.id, item.user.username);

                    return <Image source={{ uri: buildPixelAvatarUri(seed, 64) }} style={styles.rankAvatar} />;
                  })()}
                  <View style={styles.rowBody}>
                    <Text style={styles.username}>{item.user.username}</Text>
                    <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
                  </View>
                  <Text style={styles.points}>{item.points}</Text>
                </View>
              </AnimatedReveal>
            )}
            ListEmptyComponent={
              <View style={styles.centerInline}>
                <Text style={styles.empty}>NO SCORES YET. BE THE FIRST TO POST ONE.</Text>
              </View>
            }
          />
        )}

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={() => navigation.replace("Game", { category })}
          >
            <Text style={styles.primaryButtonText}>PLAY AGAIN</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]} onPress={() => navigation.popToTop()}>
            <Text style={styles.ghostButtonText}>MISSIONS</Text>
          </Pressable>
        </View>
      </AnimatedReveal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  contentWrap: {
    flex: 1,
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  centerInline: {
    paddingTop: 20,
    alignItems: "center",
  },
  latestCard: {
    backgroundColor: theme.colors.primary,
    ...pixelBorder(4),
    padding: 14,
    marginBottom: 12,
  },
  latestLabel: {
    color: "#EAF0FF",
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
  latestValue: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontWeight: "700",
    fontSize: 28,
    marginTop: 4,
  },
  listContent: {
    gap: 12,
    paddingBottom: 16,
  },
  row: {
    backgroundColor: theme.colors.background,
    ...pixelBorder(4),
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    ...arcadeShadow(4),
  },
  rankAvatar: {
    width: 30,
    height: 30,
    ...pixelBorder(2),
    backgroundColor: theme.colors.background,
  },
  rankBadge: {
    ...pixelBorder(3),
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
  },
  rankFirst: {
    backgroundColor: theme.colors.warning,
  },
  rankSecond: {
    backgroundColor: theme.colors.neutral,
  },
  rankThird: {
    backgroundColor: theme.colors.danger,
  },
  rankDefault: {
    backgroundColor: theme.colors.background,
  },
  rank: {
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.border,
  },
  rowBody: {
    flex: 1,
  },
  username: {
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.border,
  },
  date: {
    marginTop: 3,
    color: theme.colors.border,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
  },
  points: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  buttonRow: {
    gap: 8,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    ...pixelBorder(3),
    paddingVertical: 13,
    alignItems: "center",
    ...arcadeShadow(4),
  },
  primaryButtonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "700",
  },
  ghostButton: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
    paddingVertical: 13,
    alignItems: "center",
    ...arcadeShadow(4),
  },
  ghostButtonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  ghostButtonText: {
    color: theme.colors.border,
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "600",
  },
  errorTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.border,
    textAlign: "center",
  },
  errorMessage: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    textAlign: "center",
  },
  empty: {
    color: theme.colors.border,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
    textAlign: "center",
  },
});
