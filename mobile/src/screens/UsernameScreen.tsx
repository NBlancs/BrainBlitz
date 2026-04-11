import { useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AnimatedReveal } from "../components/AnimatedReveal";
import { CREATE_USER } from "../lib/queries";
import { useSessionStore } from "../store/useSessionStore";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";
import { RootStackParamList, User } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Username">;

type CreateUserResponse = {
  createUser: User;
};

export function UsernameScreen(_props: Props) {
  const setUser = useSessionStore((state) => state.setUser);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createUser, { loading }] = useMutation<CreateUserResponse>(CREATE_USER);

  const onContinue = async () => {
    const normalized = username.trim();
    if (!normalized) {
      setErrorMessage("Enter a username to continue.");
      return;
    }

    try {
      setErrorMessage(null);
      const result = await createUser({
        variables: {
          username: normalized,
        },
      });

      if (!result.data?.createUser) {
        throw new Error("User could not be created.");
      }

      setUser(result.data.createUser);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <AnimatedReveal style={styles.frame} duration={280} fromY={16}>
        <Text style={styles.kicker}>ARCADE NET v1.0</Text>
        <Text style={styles.title}>BRAINBLITZ</Text>
        <Text style={styles.subtitle}>ENTER YOUR PLAYER HANDLE TO START.</Text>

        <View style={styles.inputShell}>
          <Text style={styles.inputPrefix}>{">"}</Text>
          <TextInput
            style={styles.input}
            placeholder="PLAYER_HANDLE"
            placeholderTextColor="#5F5F5F"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
            maxLength={24}
          />
          <View style={styles.cursorBlock} />
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
          onPress={onContinue}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.buttonText}>PRESS START</Text>}
        </Pressable>
      </AnimatedReveal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
    backgroundColor: theme.colors.background,
  },
  frame: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    padding: 20,
    gap: 14,
  },
  kicker: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 32,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    color: theme.colors.border,
    lineHeight: 18,
  },
  inputShell: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    minHeight: 56,
    gap: 8,
  },
  inputPrefix: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    color: theme.colors.border,
  },
  cursorBlock: {
    width: 12,
    height: 18,
    backgroundColor: theme.colors.border,
  },
  button: {
    backgroundColor: theme.colors.primary,
    ...pixelBorder(3),
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 2,
    ...arcadeShadow(4),
  },
  buttonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  error: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
  },
});
