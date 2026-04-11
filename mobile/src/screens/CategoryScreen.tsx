import { useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { GET_CATEGORIES } from "../lib/queries";
import { useSessionStore } from "../store/useSessionStore";
import { Category, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

type CategoriesResponse = {
  getCategories: Category[];
};

const iconMap: Record<string, string> = {
  microscope: "🔬",
  landmark: "🏛️",
  globe: "🌍",
};

export function CategoryScreen({ navigation }: Props) {
  const user = useSessionStore((state) => state.user);
  const clearUser = useSessionStore((state) => state.clearUser);

  const { data, loading, error, refetch } = useQuery<CategoriesResponse>(GET_CATEGORIES);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load categories</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Pressable style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcome}>Welcome, {user?.username}</Text>
          <Text style={styles.subtitle}>Pick a category and start your 10-question round.</Text>
        </View>
        <Pressable onPress={clearUser}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      <FlatList
        data={data?.getCategories ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate("Game", { category: item })}
          >
            <Text style={styles.cardIcon}>{iconMap[item.icon] ?? "🧠"}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.questionCount} questions available</Text>
            </View>
          </Pressable>
        )}
      />
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
    backgroundColor: "#f8fafc",
    padding: 24,
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
  },
  signOut: {
    color: "#1d4ed8",
    fontWeight: "600",
    marginTop: 4,
  },
  listContent: {
    gap: 10,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  cardMeta: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  errorMessage: {
    fontSize: 14,
    color: "#b91c1c",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#1d4ed8",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
