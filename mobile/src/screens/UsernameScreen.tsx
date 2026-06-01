import { useApolloClient, useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useRef, useEffect } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, Modal, Animated } from "react-native";
import { AnimatedReveal } from "../components/AnimatedReveal";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../lib/queries";
import { AuthModal } from "../components/AuthModal";
import { withClickSound } from "../lib/soundManager";
import { useSessionStore } from "../store/useSessionStore";
import { useNetworkStore } from "../store/useNetworkStore";
import { updateGraphqlHttpUrl } from "../lib/network";
import { discoverLocalServer, probeServer } from "../lib/serverDiscovery";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";
import { RootStackParamList, User } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Username">;

type CreateUserResponse = {
  createUser: User;
};

export function UsernameScreen(_props: Props) {
  const setUser = useSessionStore((state) => state.setUser);
  const setToken = useSessionStore((state) => state.setToken);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  const serverUrl = useNetworkStore((state) => state.serverUrl);
  const [showSettings, setShowSettings] = useState(false);
  const [inputUrl, setInputUrl] = useState(serverUrl);
  const [discoveryStatus, setDiscoveryStatus] = useState<string | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.15, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [blinkAnim]);

  const onSaveSettings = async () => {
    setDiscoveryStatus(null);
    setIsSaving(true);
    setDiscoveryStatus("VERIFYING CONNECTION...");
    try {
      const validUrl = await probeServer(inputUrl);
      if (validUrl) {
        updateGraphqlHttpUrl(validUrl);
        setInputUrl(validUrl);
        setDiscoveryStatus("✅ SERVER DETECTED!");
        setTimeout(() => setShowSettings(false), 600);
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

  const handleLogin = async (usernameInput: string, passwordInput: string) => {
    try {
      setErrorMessage(null);
      setLoading(true);
      const { data } = await loginMutation({
        variables: {
          username: usernameInput,
          password: passwordInput,
        },
      });

      if (data?.login) {
        setToken(data.login.token);
        setUser(data.login.user);
        setShowAuth(false);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    usernameInput: string,
    passwordInput: string,
    nameInput: string,
    ageInputStr: string
  ) => {
    try {
      setErrorMessage(null);
      setLoading(true);

      const age = parseInt(ageInputStr.trim(), 10);
      const { data } = await registerMutation({
        variables: {
          username: usernameInput,
          password: passwordInput,
          name: nameInput,
          age,
        },
      });

      if (data?.register) {
        setToken(data.register.token);
        setUser(data.register.user);
        setShowAuth(false);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to register profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
                  style={({ pressed }) => [styles.modalButton, styles.saveBtn, pressed && styles.modalButtonPressed, (isSaving) && styles.buttonDisabled]}
                  onPress={onSaveSettings}
                  disabled={isSaving}
                >
                  {isSaving ? <ActivityIndicator size="small" color={theme.colors.white} /> : <Text style={styles.modalButtonText}>SAVE</Text>}
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <AnimatedReveal style={styles.frame} duration={280} fromY={16}>
        <Text style={styles.title}>BRAINBLITZ</Text>
        <Text style={styles.subtitle}>A RETRO PIXEL ART TRIVIA CHALLENGE</Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={withClickSound(() => {
            setErrorMessage(null);
            setShowAuth(true);
          })}
        >
          <Animated.Text style={[styles.buttonText, { opacity: blinkAnim }]}>
            PRESS START
          </Animated.Text>
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
      </AnimatedReveal>

      <AuthModal
        visible={showAuth}
        loading={loading}
        errorMessage={errorMessage}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onCancel={() => setShowAuth(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
    backgroundColor: theme.colors.background,
  },
  frame: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    padding: 20,
    gap: 14,
  },
  kicker: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    color: theme.colors.border,
    lineHeight: 18,
  },
  inputShell: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    minHeight: 56,
    gap: 8,
  },
  inputPrefix: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    color: theme.colors.border,
  },
  cursorBlock: {
    width: 12,
    height: 18,
    backgroundColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    ...pixelBorder(3),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 2,
    ...arcadeShadow(4),
  },
  buttonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  error: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
  },
  settingsButton: {
    marginTop: 10,
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
