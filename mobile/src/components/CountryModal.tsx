import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { withClickSound } from "../lib/soundManager";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";
import { Country } from "../types";

type Props = {
  visible: boolean;
  onSelect: (country: Country) => void;
  onClose: () => void;
};

type CountryItem = {
  code: Country;
  name: string;
  flag: string;
};

const COUNTRIES: CountryItem[] = [
  { code: "PHILIPPINES", name: "PHILIPPINES", flag: "🇵🇭" },
  { code: "UNITED_STATES", name: "UNITED STATES", flag: "🇺🇸" },
  { code: "GREAT_BRITAIN", name: "GREAT BRITAIN", flag: "🇬🇧" },
  { code: "CHINA", name: "CHINA", flag: "🇨🇳" },
  { code: "JAPAN", name: "JAPAN", flag: "🇯🇵" },
  { code: "SOUTH_KOREA", name: "SOUTH KOREA", flag: "🇰🇷" },
];

export function CountryModal({ visible, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState<Country>("PHILIPPINES");

  const handleConfirm = () => {
    onSelect(selected);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>SELECT COUNTRY</Text>
          <Text style={styles.subtitle}>LOCALIZE YOUR MISSION QUESTIONS TO A SPECIFIC NATION:</Text>

          <ScrollView style={styles.scroll} contentContainerStyle={styles.optionsWrap}>
            {COUNTRIES.map((item) => {
              const isSelected = item.code === selected;
              return (
                <Pressable
                  key={item.code}
                  style={({ pressed }) => [
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                    pressed && styles.pressed,
                  ]}
                  onPress={withClickSound(() => setSelected(item.code))}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.confirmBtn, pressed && styles.confirmPressed]}
              onPress={withClickSound(handleConfirm)}
            >
              <Text style={styles.confirmText}>START MISSION</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelPressed]}
              onPress={withClickSound(onClose)}
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
    maxHeight: 520,
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
    marginBottom: 4,
  },
  scroll: {
    flexGrow: 0,
    marginBottom: 6,
  },
  optionsWrap: {
    gap: 10,
    paddingBottom: 4,
  },
  optionCard: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.background,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    ...arcadeShadow(3),
  },
  optionCardSelected: {
    borderColor: theme.colors.success,
    shadowColor: theme.colors.success,
    backgroundColor: "#F4FCF6", // Light green tint for success selection
  },
  pressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  flag: {
    fontSize: 24,
  },
  optionTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.border,
    letterSpacing: 0.5,
  },
  optionTitleSelected: {
    color: theme.colors.success,
  },
  actions: {
    gap: 8,
  },
  confirmBtn: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.success,
    paddingVertical: 14,
    alignItems: "center",
    ...arcadeShadow(3),
  },
  confirmPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  confirmText: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: 1,
  },
  cancelBtn: {
    ...pixelBorder(3),
    backgroundColor: theme.colors.neutral,
    paddingVertical: 11,
    alignItems: "center",
    ...arcadeShadow(3),
  },
  cancelPressed: {
    transform: [{ translateY: 3 }],
    ...pressedShadow,
  },
  cancelText: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.border,
  },
});
