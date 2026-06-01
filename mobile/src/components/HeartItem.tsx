import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

type Props = {
  active: boolean;
};

export function HeartItem({ active }: Props) {
  const scaleVal = useRef(new Animated.Value(1)).current;
  const rotateVal = useRef(new Animated.Value(0)).current;
  const prevActiveRef = useRef(active);

  useEffect(() => {
    // If transitioning from active (true) to lost (false), trigger animation
    if (prevActiveRef.current && !active) {
      Animated.sequence([
        // Bounce up and shake
        Animated.parallel([
          Animated.timing(scaleVal, {
            toValue: 1.4,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(rotateVal, { toValue: 1, duration: 40, useNativeDriver: true }),
            Animated.timing(rotateVal, { toValue: -1, duration: 40, useNativeDriver: true }),
            Animated.timing(rotateVal, { toValue: 1, duration: 40, useNativeDriver: true }),
            Animated.timing(rotateVal, { toValue: -1, duration: 40, useNativeDriver: true }),
            Animated.timing(rotateVal, { toValue: 0, duration: 40, useNativeDriver: true }),
          ]),
        ]),
        // Shrink down below normal scale and pop back to 1 (lost style)
        Animated.timing(scaleVal, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleVal, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!prevActiveRef.current && active) {
      // If transitioning from lost to active (refill), pop scale
      Animated.sequence([
        Animated.timing(scaleVal, { toValue: 1.3, duration: 150, useNativeDriver: true }),
        Animated.timing(scaleVal, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
    prevActiveRef.current = active;
  }, [active, scaleVal, rotateVal]);

  const rotation = rotateVal.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-18deg", "18deg"],
  });

  return (
    <Animated.Image
      source={active ? require("../assets/heart_active.png") : require("../assets/heart_lose.png")}
      style={[
        styles.heart,
        {
          transform: [{ scale: scaleVal }, { rotate: rotation }],
        },
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  heart: {
    width: 22,
    height: 22,
    marginHorizontal: 2,
  },
});
