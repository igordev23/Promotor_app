import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useResetPasswordViewModel } from "../../viewmodel/useResetPasswordViewModel";

export function ResetPasswordView() {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    state: { loading, error, success },
    actions: { resetPassword },
  } = useResetPasswordViewModel();

  useEffect(() => {
    if (success) {
      Alert.alert("Sucesso", "Senha redefinida com sucesso");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      Alert.alert("Erro", error);
    }
  }, [error]);

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 16 }}>
        Redefinir senha
      </Text>

      <TextInput
        placeholder="Nova senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />

      <TextInput
        placeholder="Confirmar nova senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button
        title={loading ? "Salvando..." : "Confirmar"}
        onPress={() => resetPassword(password, confirmPassword)}
        disabled={loading}
      />
    </View>
  );
}
