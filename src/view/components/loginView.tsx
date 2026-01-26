import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useLoginViewModel } from "../../viewmodel/useLoginViewModel";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
const TEST_EMAIL = "promotor2@test.com";
const TEST_PASSWORD = "12345678";


export default function LoginView() {
  const { state, actions } = useLoginViewModel();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconWrapper}>
          <MaterialIcons name="account-circle" size={110} color="#3F51B5" />
        </View>

        <Text style={styles.title}>Promotor{"\n"}app</Text>

        <Text style={styles.titleInput}>E-mail/Nome de Usuário</Text>
        <TextInput
          testID="email-input"
          label="Digite seu e-mail"
          placeholder="exemplo@gmail.com"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
        />

        <Text style={styles.titleInput}>Senha</Text>
        <TextInput
          testID="password-input"
          label="Digite sua senha"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <Text
          style={[styles.titleInput, styles.forgotPassword]}
          onPress={() => router.push("/recoverPasswordScreen")}
        >
          Esqueceu a sua senha?
        </Text>

        {state.error && (
          <Text style={{ color: "red", marginBottom: 8 }}>
            {state.error}
          </Text>
        )}

        <Button
          testID="login-button"
          mode="contained"
          onPress={() => actions.loginAndNavigate(email, password)}
          loading={state.loading}
          disabled={state.loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          Entrar
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
    paddingTop: 32,
    alignItems: "center",
  },
  iconWrapper: {
    marginTop: 36,
    marginBottom: 12,
  },
  title: {
    fontSize: 64,
    fontWeight: "700",
    color: "#3F51B5",
    textAlign: "center",
    marginBottom: 24,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "300",
    color: "#49454F",
    width: "100%",
    textAlign: "left",
    margin: 8,
  },
  forgotPassword: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "300",
    color: "#49454F",
    width: "100%",
    margin: 8,
  },
  input: {
    borderRadius: "20%",
    width: "100%",
    margin: 0,

  },
  link: {
    alignSelf: "flex-start",
    marginTop: 12,
    color: "#1B1B1F",
  },
  button: {
    width: "70%",
    marginTop: 24,
    borderRadius: 50,
  },
});
