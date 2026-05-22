import { useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { buildPixelAvatarUri, createUserAvatarSeed } from "../lib/avatar";
import { GET_CATEGORIES, GET_LEADERBOARD } from "../lib/queries";
import { withClickSound } from "../lib/soundManager";
import { useSessionStore } from "../store/useSessionStore";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";
import { Category } from "../types";

type CategoriesResponse = {
  getCategories: Category[];
};

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

export function LeaderboardHubScreen() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const sessionUserId = useSessionStore((state) => state.user?.id);
  const selectedAvatarSeed = useSessionStore((state) => state.avatarSeed);

  const { data: categoryData, loading: categoriesLoading } = useQuery<CategoriesResponse>(GET_CATEGORIES);

  const categories = categoryData?.getCategories ?? [];

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategoryName = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId)?.name ?? "",
    [categories, selectedCategoryId]
  );

  const {
    data: leaderboardData,
    loading: leaderboardLoading,
    error,
    refetch,
  } = useQuery<LeaderboardResponse>(GET_LEADERBOARD, {
    variables: {
      categoryId: selectedCategoryId,
      limit: 20,
    },
    skip: !selectedCategoryId,
    fetchPolicy: "network-only",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LEADERBOARD</Text>

      <View style={styles.pickerCard}>
        <Text style={styles.pickerLabel}>CATEGORY</Text>
        {categoriesLoading ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <View style={styles.pickerRow}>
            {categories.map((category) => {
              const active = category.id === selectedCategoryId;
              return (
                <Pressable
                  key={category.id}
                  style={({ pressed }) => [
                    styles.categoryButton,
                    active && styles.categoryButtonActive,
                    pressed && styles.categoryButtonPressed,
                  ]}
                  onPress={withClickSound(() => setSelectedCategoryId(category.id))}
                >
                  <Text style={[styles.categoryButtonText, active && styles.categoryButtonTextActive]}>{category.name.toUpperCase()}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <Text style={styles.subtitle}>{selectedCategoryName ? `${selectedCategoryName.toUpperCase()} // TOP PLAYERS` : "SELECT A CATEGORY"}</Text>

      {leaderboardLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>SYNCING SCORES...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Could not load leaderboard</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <Pressable style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]} onPress={withClickSound(() => refetch())}>
            <Text style={styles.retryText}>RETRY</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={leaderboardData?.getLeaderboard ?? []}
          keyExtractor={(item) => `${item.user.id}-${item.rank}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>#{item.rank}</Text>
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
          )}
          ListEmptyComponent={
            <View style={styles.centerInline}>
              <Text style={styles.empty}>NO SCORES YET.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.border,
    marginBottom: 8,
    letterSpacing: 1,
  },
  pickerCard: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    padding: 10,
    marginBottom: 10,
  },
  pickerLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    color: theme.colors.border,
    marginBottom: 8,
    letterSpacing: 1,
  },
  pickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    ...pixelBorder(2),
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: theme.colors.background,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryButtonPressed: {
    transform: [{ translateY: 2 }],
  },
  categoryButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
  },
  categoryButtonTextActive: {
    color: theme.colors.white,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  centerInline: {
    paddingTop: 20,
    alignItems: "center",
  },
  loadingText: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 10,
  },
  row: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...arcadeShadow(3),
  },
  rank: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    fontWeight: "700",
    width: 40,
  },
  rankAvatar: {
    width: 28,
    height: 28,
    ...pixelBorder(2),
    backgroundColor: theme.colors.background,
  },
  rowBody: {
    flex: 1,
  },
  username: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    fontWeight: "700",
  },
  date: {
    marginTop: 2,
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
  },
  points: {
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  retryButton: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.primary,
    paddingVertical: 11,
    paddingHorizontal: 16,
    ...arcadeShadow(3),
  },
  retryButtonPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  retryText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "700",
  },
  errorTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    color: theme.colors.border,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.danger,
    textAlign: "center",
  },
  empty: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.border,
    letterSpacing: 1,
  },
});