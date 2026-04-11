import { ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, StyleProp, ViewStyle } from "react-native";

type AnimatedRevealProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
  duration?: number;
  fromY?: number;
  resetKey?: string | number;
};

export function AnimatedReveal({
  children,
  style,
  delay = 0,
  duration = 260,
  fromY = 14,
  resetKey,
}: AnimatedRevealProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(fromY)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(fromY);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration, fromY, opacity, resetKey, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}