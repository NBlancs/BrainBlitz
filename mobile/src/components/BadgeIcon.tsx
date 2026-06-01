import React from "react";
import { Image, ImageStyle, StyleProp } from "react-native";

const bronzeImg = require("../assets/bronze_rank.png");
const silverImg = require("../assets/silver_rank.png");
const goldImg = require("../assets/gold_rank.png");
const scholarImg = require("../assets/scholar_rank.png");

const BADGE_ASSETS = {
  BRONZE: bronzeImg,
  SILVER: silverImg,
  GOLD: goldImg,
  SCHOLAR: scholarImg,
} as const;

type Props = {
  badge: "BRONZE" | "SILVER" | "GOLD" | "SCHOLAR";
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export function BadgeIcon({ badge, size = 24, style }: Props) {
  const source = BADGE_ASSETS[badge] || bronzeImg;

  return (
    <Image
      source={source}
      style={[{ width: size, height: size }, style]}
      resizeMode="contain"
    />
  );
}
