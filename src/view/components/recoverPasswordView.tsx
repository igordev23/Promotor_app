import { View, Text } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useRecoverPasswordViewModel } from "../../viewmodel/useRecoverPasswordViewModel";

export default function RecoverPasswordView() {
  const { state, actions } = useRecoverPasswordViewModel();
  const [email, setEmail] = useState<string>("");
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.primary }]}>
        Recuperar senha
      </Text>

      <TextInput
        label="E-mail"
        placeholder="exemplo@email.com"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        outlineStyle={styles.outline}
      />

      {state.error && (
        <Text style={styles.errorText}>{state.error}</Text>
      )}

      {state.success && (
        <Text style={[styles.successText, { color: theme.colors.primary }]}>
          E-mail de recuperação enviado
        </Text>
      )}

      <Button
        mode="contained"
        onPress={() => actions.recoverPassword(email)}
        loading={state.loading}
        disabled={state.loading}
        style={styles.primaryButton}
        contentStyle={styles.buttonContent}
      >
        Enviar
      </Button>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 28,
  },

  input: {
    marginBottom: 20,
  },

  outline: {
    borderRadius: 12,
  },

  /* ✅ BOTÕES – somente tamanho físico */
  primaryButton: {
    marginTop: 8,
    borderRadius: 20,
  },

  secondaryButton: {
    marginTop: 12,
    borderRadius: 20,
  },

  buttonContent: {
    height: 44,           
    paddingHorizontal: 20 
  },

  errorText: {
    textAlign: "center",
    marginBottom: 12,
  },

  successText: {
    textAlign: "center",
    marginBottom: 12,
  },
});
