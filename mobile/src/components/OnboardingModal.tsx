import React, { useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { withClickSound } from "../lib/soundManager";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";

type Props = {
  visible: boolean;
  loading: boolean;
  errorMessage: string | null;
  onSubmit: (username: string, name: string, ageStr: string) => void;
  onCancel: () => void;
};

export function OnboardingModal({ visible, loading, errorMessage, onSubmit, onCancel }: Props) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [ageStr, setAgeStr] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setLocalError("Player handle cannot be empty.");
      return;
    }

    setLocalError(null);
    onSubmit(trimmedUsername, name, ageStr);
  };

  const errorText = localError || errorMessage;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>PLAYER SIGN IN</Text>
          <Text style={styles.subtitle}>ENTER YOUR HANDLE TO SIGN IN, OR FILL ALL FIELDS TO REGISTER A NEW PROFILE.</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>PLAYER HANDLE (SIGN-IN ID):</Text>
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
            <Text style={styles.label}>PLAYER NAME (NEW PLAYER ONLY):</Text>
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
            <Text style={styles.label}>PLAYER AGE (NEW PLAYER ONLY):</Text>
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

          {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.submitBtn, pressed && styles.submitPressed, loading && styles.disabled]}
              onPress={withClickSound(handleSubmit)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.submitText}>START GAME</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
  },
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    textAlign: "center",
    lineHeight: 13,
    marginBottom: 6,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    color: theme.colors.border,
    fontWeight: "600",
  },
  input: {
    ...pixelBorder(3),
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    color: theme.colors.border,
    padding: 10,
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
    fontSize: 12,
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
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
