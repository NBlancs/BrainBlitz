import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useGameStore } from "../store/useGameStore";
import { withClickSound } from "../lib/soundManager";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function HeartsGoneModal({ visible, onClose }: Props) {
  const heartsDepletedAt = useGameStore((state) => state.heartsDepletedAt);
  const [countdown, setCountdown] = useState("00:59:59");

  useEffect(() => {
    if (!visible || !heartsDepletedAt) return;

    const updateTimer = () => {
      const elapsed = Date.now() - heartsDepletedAt;
      const remainingMs = Math.max(0, 300000 - elapsed);

      const hours = Math.floor(remainingMs / 3600000);
      const minutes = Math.floor((remainingMs % 3600000) / 60000);
      const seconds = Math.floor((remainingMs % 60000) / 1000);

      const formatted = [hours, minutes, seconds]
        .map((v) => String(v).padStart(2, "0"))
        .join(":");

      setCountdown(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [visible, heartsDepletedAt]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.dangerTitle}>⚠️ GAME OVER ⚠️</Text>
          <Text style={styles.lockoutHeader}>BRAIN OVERLOAD DETECTED!</Text>
          <Text style={styles.desc}>
            ALL LIVES ARE DEPLETED. PLUG IN THE COOLING SYSTEMS AND TAKE A SHORT MENTAL BREAK.
          </Text>

          <View style={styles.timerCard}>
            <Text style={styles.timerLabel}>RECHARGING LIVES IN:</Text>
            <Text style={styles.timerValue}>{countdown}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closePressed]}
            onPress={withClickSound(onClose)}
          >
            <Text style={styles.closeText}>BACK TO MISSIONS</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },
  content: {
    ...pixelBorder(4),
    borderColor: theme.colors.danger,
    backgroundColor: theme.colors.background,
    width: "100%",
    maxWidth: 340,
    padding: 22,
    gap: 14,
    alignItems: "center",
  },
  dangerTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.danger,
    textAlign: "center",
  },
  lockoutHeader: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.border,
    textAlign: "center",
  },
  desc: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    textAlign: "center",
    lineHeight: 14,
  },
  timerCard: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
    padding: 12,
    width: "100%",
    alignItems: "center",
    gap: 4,
    borderColor: theme.colors.border,
  },
  timerLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
  },
  timerValue: {
    fontFamily: theme.fonts.mono,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  closeBtn: {
    backgroundColor: theme.colors.primary,
    ...pixelBorder(3),
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    ...arcadeShadow(3),
  },
  closePressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  closeText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
