import { useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { GET_LEADERBOARD } from "../lib/queries";
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

  const { data, loading, error, refetch } = useQuery<LeaderboardResponse>(GET_LEADERBOARD, {
    variables: {
      categoryId: category.id,
      limit: 20,
    },
    fetchPolicy: "network-only",
  });

  return (
    <View style={styles.container}>
      {typeof latestScore === "number" ? (
        <View style={styles.latestCard}>
          <Text style={styles.latestLabel}>Your latest score</Text>
          <Text style={styles.latestValue}>{latestScore} pts</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Could not load leaderboard</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <Pressable style={styles.primaryButton} onPress={() => refetch()}>
            <Text style={styles.primaryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={data?.getLeaderboard ?? []}
          keyExtractor={(item) => `${item.user.id}-${item.rank}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.rank}>#{item.rank}</Text>
              <View style={styles.rowBody}>
                <Text style={styles.username}>{item.user.username}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.points}>{item.points}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.centerInline}>
              <Text style={styles.empty}>No scores yet. Be the first to submit one.</Text>
            </View>
          }
        />
      )}

      <View style={styles.buttonRow}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.replace("Game", { category })}>
          <Text style={styles.primaryButtonText}>Play Again</Text>
        </Pressable>
        <Pressable style={styles.ghostButton} onPress={() => navigation.popToTop()}>
          <Text style={styles.ghostButtonText}>Categories</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  centerInline: {
    paddingTop: 20,
    alignItems: "center",
  },
  latestCard: {
    backgroundColor: "#1d4ed8",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  latestLabel: {
    color: "#dbeafe",
    fontSize: 13,
  },
  latestValue: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 28,
    marginTop: 4,
  },
  listContent: {
    gap: 10,
    paddingBottom: 16,
  },
  row: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rank: {
    width: 36,
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  rowBody: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  date: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 12,
  },
  points: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  buttonRow: {
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  ghostButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  errorMessage: {
    color: "#b91c1c",
    textAlign: "center",
  },
  empty: {
    color: "#64748b",
    fontSize: 14,
  },
});
