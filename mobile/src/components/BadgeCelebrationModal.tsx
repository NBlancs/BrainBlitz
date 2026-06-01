import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { BadgeIcon } from "./BadgeIcon";
import { withClickSound } from "../lib/soundManager";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";

type Props = {
  visible: boolean;
  badge: "BRONZE" | "SILVER" | "GOLD" | "SCHOLAR";
  onClose: () => void;
};

export function BadgeCelebrationModal({ visible, badge, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.kicker}>🌟 PROMOTION UNLOCKED 🌟</Text>
          <Text style={styles.title}>RANK UPGRADE!</Text>

          <View style={styles.badgeWrapper}>
            <BadgeIcon badge={badge} size={96} />
          </View>

          <Text style={styles.badgeName}>{badge}</Text>
          <Text style={styles.desc}>
            CONGRATULATIONS! YOUR TOTAL BRAIN POWER TIER HAS ESCALATED. YOU ARE NOW RECOGNIZED AS A {badge} BLITZER.
          </Text>

          <Pressable
            style={({ pressed }) => [styles.continueBtn, pressed && styles.continuePressed]}
            onPress={withClickSound(onClose)}
          >
            <Text style={styles.continueText}>PRESS START TO CONTINUE</Text>
          </Pressable>
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
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.background,
    width: "100%",
    maxWidth: 340,
    padding: 22,
    gap: 12,
    alignItems: "center",
  },
  kicker: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.warning,
    textAlign: "center",
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
    textAlign: "center",
  },
  badgeWrapper: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.neutral,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  badgeName: {
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.warning,
  },
  desc: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    textAlign: "center",
    lineHeight: 14,
    marginBottom: 6,
  },
  continueBtn: {
    backgroundColor: theme.colors.success,
    ...pixelBorder(3),
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    ...arcadeShadow(3),
  },
  continuePressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  continueText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
