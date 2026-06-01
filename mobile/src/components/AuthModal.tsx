import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { withClickSound } from "../lib/soundManager";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";

type Props = {
  visible: boolean;
  loading: boolean;
  errorMessage: string | null;
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string, name: string, ageStr: string) => void;
  onCancel: () => void;
};

export function AuthModal({ visible, loading, errorMessage, onLogin, onRegister, onCancel }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [ageStr, setAgeStr] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleTabChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setLocalError(null);
  };

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      setLocalError("Player handle cannot be empty.");
      return;
    }
    if (!trimmedPassword) {
      setLocalError("Password cannot be empty.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setLocalError(null);

    if (mode === "login") {
      onLogin(trimmedUsername, trimmedPassword);
    } else {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setLocalError("Player name cannot be empty.");
        return;
      }
      const age = parseInt(ageStr.trim(), 10);
      if (isNaN(age) || age < 1 || age > 120) {
        setLocalError("Enter a valid Age (1-120).");
        return;
      }
      onRegister(trimmedUsername, trimmedPassword, trimmedName, ageStr);
    }
  };

  const errorText = localError || errorMessage;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>PLAYER PORTAL</Text>

          {/* Retro Tab Bar */}
          <View style={styles.tabContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.tabBtn,
                mode === "login" ? styles.tabBtnActive : styles.tabBtnInactive,
                pressed && styles.tabPressed,
              ]}
              onPress={withClickSound(() => handleTabChange("login"))}
            >
              <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>SIGN IN</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.tabBtn,
                mode === "register" ? styles.tabBtnActive : styles.tabBtnInactive,
                pressed && styles.tabPressed,
              ]}
              onPress={withClickSound(() => handleTabChange("register"))}
            >
              <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>REGISTER</Text>
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            {mode === "login"
              ? "ENTER YOUR HANDLE AND PASSWORD TO ACCESS THE SIMULATION."
              : "CREATE A NEW COGNITIVE PROFILE TO JOIN THE LEADERBOARDS."}
          </Text>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>PLAYER HANDLE (ID):</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="e.g. arcade_hero"
              placeholderTextColor="#5F5F5F"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={24}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PASSWORD (MIN 6 CHARS):</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="******"
              placeholderTextColor="#5F5F5F"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              maxLength={30}
            />
          </View>

          {mode === "register" ? (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>REAL NAME / PILOT NAME:</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. John Doe"
                  placeholderTextColor="#5F5F5F"
                  autoCorrect={false}
                  maxLength={30}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>PLAYER AGE:</Text>
                <TextInput
                  style={styles.input}
                  value={ageStr}
                  onChangeText={setAgeStr}
                  placeholder="e.g. 18"
                  placeholderTextColor="#5F5F5F"
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
            </>
          ) : null}

          {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitPressed,
                loading && styles.disabled,
              ]}
              onPress={withClickSound(handleSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.submitText}>
                  {mode === "login" ? "INITIALIZE LOGIN" : "INITIALIZE REGISTER"}
                </Text>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelPressed]}
              onPress={withClickSound(onCancel)}
              disabled={loading}
            >
              <Text style={styles.cancelText}>CANCEL</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  content: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    width: "100%",
    maxWidth: 340,
    padding: 20,
    gap: 12,
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
    textAlign: "center",
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 4,
  },
  tabBtn: {
    ...pixelBorder(2),
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabBtnInactive: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
  },
  tabPressed: {
    transform: [{ translateY: 2 }],
  },
  tabText: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.border,
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    textAlign: "center",
    lineHeight: 13,
    marginBottom: 4,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    fontWeight: "600",
  },
  input: {
    ...pixelBorder(3),
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    color: theme.colors.border,
    padding: 8,
    backgroundColor: theme.colors.background,
  },
  error: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  actions: {
    gap: 8,
    marginTop: 6,
  },
  submitBtn: {
    backgroundColor: theme.colors.success,
    ...pixelBorder(3),
    paddingVertical: 14,
    alignItems: "center",
    ...arcadeShadow(3),
  },
  submitPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  disabled: {
    opacity: 0.7,
  },
  submitText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cancelBtn: {
    backgroundColor: theme.colors.danger,
    ...pixelBorder(3),
    paddingVertical: 12,
    alignItems: "center",
    ...arcadeShadow(3),
  },
  cancelPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  cancelText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
