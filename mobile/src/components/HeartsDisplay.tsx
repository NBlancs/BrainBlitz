import React from "react";
import { StyleSheet, View } from "react-native";
import { HeartItem } from "./HeartItem";

type Props = {
  hearts: number;
};

export function HeartsDisplay({ hearts }: Props) {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((index) => (
        <HeartItem key={index} active={index < hearts} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
