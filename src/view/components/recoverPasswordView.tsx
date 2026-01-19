import { View, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useRecoverPasswordViewModel } from "../../viewmodel/useRecoverPasswordViewModel";

export default function RecoverPasswordView() {
  const { state, actions } = useRecoverPasswordViewModel();
  const [email, setEmail] = useState("");

  const handleRecover = async () => {
    console.log("Recuperando senha para o e-mail:", email);
    console.log("Estado atual antes da recuperação:", state);
    await actions.recoverPassword(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>

      <TextInput
        label="E-mail"
        placeholder="exemplo@email.com"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {state.error && (
        <Text style={styles.errorText}>
          {state.error}
        </Text>
      )}

      {state.success && (
        <Text style={styles.successText}>
          E-mail de recuperação enviado
        </Text>
      )}

      <Button
        mode="contained"
        onPress={handleRecover}
        loading={state.loading}
        disabled={state.loading}
        style={styles.button}
      >
        Enviar
      </Button>
    </View>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
    paddingTop: 32,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3F51B5",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    borderRadius: 50,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginBottom: 8,
    textAlign: "center",
  },
});
