import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { withClickSound } from "../lib/soundManager";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";

type Props = {
  visible: boolean;
  onSelect: (difficulty: "EASY" | "MEDIUM" | "HARD") => void;
  onClose: () => void;
};

export function DifficultyModal({ visible, onSelect, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>SELECT DIFFICULTY</Text>
          <Text style={styles.subtitle}>CHOOSE YOUR CHALLENGE LEVEL:</Text>

          <View style={styles.optionsWrap}>
            <Pressable
              style={({ pressed }) => [
                styles.optionCard,
                { borderColor: theme.colors.success, shadowColor: theme.colors.success },
                pressed && styles.pressed,
              ]}
              onPress={withClickSound(() => onSelect("EASY"))}
            >
              <Text style={[styles.optionTitle, { color: theme.colors.success }]}>EASY</Text>
              <Text style={styles.optionDesc}>PERFECT FOR BEGINNERS & KIDS!</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.optionCard,
                { borderColor: theme.colors.warning, shadowColor: theme.colors.warning },
                pressed && styles.pressed,
              ]}
              onPress={withClickSound(() => onSelect("MEDIUM"))}
            >
              <Text style={[styles.optionTitle, { color: theme.colors.warning }]}>MEDIUM</Text>
              <Text style={styles.optionDesc}>A SOLID GENERAL CHALLENGE!</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.optionCard,
                { borderColor: theme.colors.danger, shadowColor: theme.colors.danger },
                pressed && styles.pressed,
              ]}
              onPress={withClickSound(() => onSelect("HARD"))}
            >
              <Text style={[styles.optionTitle, { color: theme.colors.danger }]}>HARD</Text>
              <Text style={styles.optionDesc}>ONLY FOR TRUE TRIVIA CHAMPIONS!</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelPressed]}
            onPress={withClickSound(onClose)}
          >
            <Text style={styles.cancelText}>CANCEL</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    fontSize: 10,
    color: theme.colors.border,
    textAlign: "center",
    lineHeight: 14,
    marginBottom: 4,
  },
  optionsWrap: {
    gap: 12,
  },
  optionCard: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
    padding: 12,
    gap: 4,
    ...arcadeShadow(3),
  },
  pressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  optionTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  optionDesc: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    lineHeight: 12,
  },
  cancelBtn: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.neutral,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 6,
    ...arcadeShadow(3),
  },
  cancelPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  cancelText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.border,
  },
});
