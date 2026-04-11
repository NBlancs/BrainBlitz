export const theme = {
  colors: {
    background: "#FFFFFF",
    primary: "#0055FF",
    border: "#000000",
    success: "#4CAF50",
    warning: "#FFC107",
    danger: "#F44336",
    neutral: "#E0E0E0",
    white: "#FFFFFF",
  },
  fonts: {
    pixel: "PressStart2P_400Regular",
    mono: "PressStart2P_400Regular",
  },
};

export function pixelBorder(width = 4) {
  const depth = Math.max(2, Math.round(width / 2));
  return {
    borderWidth: width,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.border,
    shadowOffset: { width: depth, height: depth },
    shadowOpacity: 0.4 as const,
    shadowRadius: 0,
    elevation: depth,
  };
}

export function arcadeShadow(depth = 4) {
  return {
    shadowColor: theme.colors.border,
    shadowOffset: { width: 0, height: depth },
    shadowOpacity: 1 as const,
    shadowRadius: 0,
    elevation: depth,
  };
}

export const pressedShadow = {
  shadowOpacity: 0 as const,
  elevation: 0,
};
