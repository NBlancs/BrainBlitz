import { useMutation } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CREATE_USER } from "../lib/queries";
import { useSessionStore } from "../store/useSessionStore";
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
      <Text style={styles.title}>BrainBlitz</Text>
      <Text style={styles.subtitle}>Set your player name to start your trivia session.</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={setUsername}
        maxLength={24}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Pressable style={styles.button} onPress={onContinue} disabled={loading}>
        {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Continue</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
    gap: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    marginTop: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#b91c1c",
    fontSize: 14,
  },
});
