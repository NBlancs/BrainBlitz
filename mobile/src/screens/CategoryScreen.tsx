import { useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, Modal, TextInput } from "react-native";
import { AnimatedReveal } from "../components/AnimatedReveal";
import { GET_CATEGORIES } from "../lib/queries";
import { withClickSound } from "../lib/soundManager";
import { useSessionStore } from "../store/useSessionStore";
import { useNetworkStore } from "../store/useNetworkStore";
import { updateGraphqlHttpUrl } from "../lib/network";
import { discoverLocalServer, probeServer } from "../lib/serverDiscovery";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";
import { Category, RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Categories">;

type CategoriesResponse = {
  getCategories: Category[];
};

const iconMap: Record<string, string> = {
  microscope: "🔬",
  landmark: "🏛️",
  globe: "🌍",
  book: "📚",
  film: "🎬",
  music: "🎵",
  tv: "📺",
  gamepad: "🎮",
  scroll: "🐉",
  trophy: "🏆",
  palette: "🎨",
  paw: "🐾",
  car: "🚗",
};

const accentMap: Record<string, string> = {
  microscope: theme.colors.success,
  landmark: theme.colors.warning,
  globe: theme.colors.danger,
  book: theme.colors.primary,
  film: theme.colors.success,
  music: theme.colors.warning,
  tv: theme.colors.danger,
  gamepad: theme.colors.success,
  scroll: theme.colors.warning,
  trophy: theme.colors.danger,
  palette: theme.colors.primary,
  paw: theme.colors.success,
  car: theme.colors.danger,
};

export function CategoryScreen({ navigation }: Props) {
  const user = useSessionStore((state) => state.user);
  const clearUser = useSessionStore((state) => state.clearUser);

  const serverUrl = useNetworkStore((state) => state.serverUrl);
  const [showSettings, setShowSettings] = useState(false);
  const [inputUrl, setInputUrl] = useState(serverUrl);
  const [discoveryStatus, setDiscoveryStatus] = useState<string | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onSaveSettings = async () => {
    setDiscoveryStatus(null);
    setIsSaving(true);
    setDiscoveryStatus("VERIFYING CONNECTION...");
    try {
      const validUrl = await probeServer(inputUrl);
      if (validUrl) {
        updateGraphqlHttpUrl(validUrl);
        setInputUrl(validUrl);
        setDiscoveryStatus("✅ CONNECTED!");
        setTimeout(() => {
          setShowSettings(false);
          void refetch();
        }, 600);
      } else {
        setDiscoveryStatus("❌ NOT FOUND (CHECK WI-FI)");
      }
    } catch {
      setDiscoveryStatus("❌ CONNECTION ERROR");
    } finally {
      setIsSaving(false);
    }
  };

  const onAutoDiscover = async () => {
    try {
      setIsDiscovering(true);
      setDiscoveryStatus("STARTING SCAN...");
      const discovered = await discoverLocalServer((status) => setDiscoveryStatus(status));
      if (discovered) {
        setInputUrl(discovered);
        setDiscoveryStatus("✅ FOUND SERVER!");
      } else {
        setDiscoveryStatus("❌ NOT FOUND (CHECK WI-FI)");
      }
    } catch {
      setDiscoveryStatus("❌ ERROR DISCOVERING");
    } finally {
      setIsDiscovering(false);
    }
  };

  const { data, loading, error, refetch } = useQuery<CategoriesResponse>(GET_CATEGORIES);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.loadingText}>SYNCING MISSIONS...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Modal visible={showSettings} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>SERVER CONFIG</Text>
              <Text style={styles.modalLabel}>ENTER BACKEND GRAPHQL URL:</Text>
              
              <TextInput
                style={styles.modalInput}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="http://192.168.1.X:4000/graphql"
                placeholderTextColor="#5F5F5F"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {discoveryStatus ? (
                <Text style={styles.discoveryText}>{discoveryStatus}</Text>
              ) : null}

              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [styles.modalButton, styles.discoverBtn, pressed && styles.modalButtonPressed]}
                  onPress={onAutoDiscover}
                  disabled={isDiscovering || isSaving}
                >
                  <Text style={styles.modalButtonText}>AUTO-DISCOVER</Text>
                </Pressable>
                
                <View style={styles.rowActions}>
                  <Pressable
                    style={({ pressed }) => [styles.modalButton, styles.cancelBtn, pressed && styles.modalButtonPressed]}
                    onPress={() => setShowSettings(false)}
                    disabled={isSaving}
                  >
                    <Text style={styles.modalButtonText}>CANCEL</Text>
                  </Pressable>
                  
                  <Pressable
                    style={({ pressed }) => [styles.modalButton, styles.saveBtn, pressed && styles.modalButtonPressed, isSaving && { opacity: 0.7 }]}
                    onPress={onSaveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.modalButtonText}>SAVE</Text>}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        <Text style={styles.errorTitle}>Could not load categories</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Pressable style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]} onPress={withClickSound(() => refetch())}>
          <Text style={styles.retryText}>RETRY</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}
          onPress={() => {
            setInputUrl(useNetworkStore.getState().serverUrl);
            setDiscoveryStatus(null);
            setShowSettings(true);
          }}
        >
          <Text style={styles.settingsButtonText}>⚙️ CONFIGURE SERVER</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedReveal>
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.kicker}>PLAYER</Text>
            <Text style={styles.welcome}>{user?.username}</Text>
            <Text style={styles.subtitle}>SELECT A MISSION TO START A 10-QUESTION ROUND.</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutButtonPressed]} onPress={withClickSound(clearUser)}>
            <Text style={styles.signOutText}>SIGN OUT</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>SELECT MISSION</Text>
      </AnimatedReveal>

      <AnimatedReveal style={styles.listWrap} delay={70}>
        <FlatList
          data={data?.getCategories ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <AnimatedReveal delay={120 + index * 70} duration={220} fromY={10}>
              <Pressable
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={withClickSound(() => navigation.navigate("Game", { category: item }))}
              >
                <View style={[styles.cardIconWrap, { backgroundColor: accentMap[item.icon] ?? theme.colors.primary }]}>
                  <Text style={styles.cardIcon}>{iconMap[item.icon] ?? "🧠"}</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{item.name.toUpperCase()}</Text>
                  <Text style={styles.cardMeta}>{item.questionCount} QUESTIONS AVAILABLE</Text>
                </View>
                <Text style={styles.cardArrow}>{">"}</Text>
              </Pressable>
            </AnimatedReveal>
          )}
        />
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    padding: 24,
    gap: 10,
  },
  loadingText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  headerCard: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    position: "relative",
    paddingRight: 126,
    marginBottom: 16,
    padding: 14,
  },
  kicker: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  welcome: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
    marginTop: 2,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    lineHeight: 17,
  },
  signOutButton: {
    ...pixelBorder(3),
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...arcadeShadow(3),
  },
  signOutButtonPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  signOutText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.border,
    marginBottom: 8,
    letterSpacing: 1,
  },
  listWrap: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: theme.colors.background,
    ...pixelBorder(4),
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...arcadeShadow(4),
  },
  cardPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    ...pixelBorder(3),
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    fontSize: 24,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.border,
  },
  cardMeta: {
    marginTop: 4,
    color: theme.colors.border,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
  },
  cardArrow: {
    fontFamily: theme.fonts.mono,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.border,
  },
  errorTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.border,
  },
  errorMessage: {
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    color: theme.colors.danger,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: theme.colors.primary,
    ...pixelBorder(3),
    paddingHorizontal: 18,
    paddingVertical: 11,
    ...arcadeShadow(4),
  },
  retryButtonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  retryText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    letterSpacing: 1,
    fontWeight: "700",
  },
  settingsButton: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 10,
  },
  settingsButtonPressed: {
    opacity: 0.7,
  },
  settingsButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    width: "100%",
    maxWidth: 340,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  modalLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
  },
  modalInput: {
    ...pixelBorder(3),
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    color: theme.colors.border,
    padding: 10,
    backgroundColor: theme.colors.background,
  },
  discoveryText: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.warning,
    textAlign: "center",
    marginVertical: 4,
  },
  modalActions: {
    gap: 8,
    marginTop: 6,
  },
  rowActions: {
    flexDirection: "row",
    gap: 8,
  },
  modalButton: {
    ...pixelBorder(3),
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    ...arcadeShadow(3),
  },
  discoverBtn: {
    backgroundColor: theme.colors.warning,
    flex: 0,
  },
  cancelBtn: {
    backgroundColor: theme.colors.danger,
  },
  saveBtn: {
    backgroundColor: theme.colors.success,
  },
  modalButtonText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.white,
  },
  modalButtonPressed: {
    transform: [{ translateY: 3 }],
    shadowOffset: { width: 0, height: 0 },
  },
});
