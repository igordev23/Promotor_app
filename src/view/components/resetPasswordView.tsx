import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { useResetPasswordViewModel } from "../../viewmodel/useResetPasswordViewModel";
import supabase from "../../config/supabase";

export function ResetPasswordView() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    state: { loading, error, success },
    actions: { resetPassword },
  } = useResetPasswordViewModel();

  useEffect(() => {
    if (success) {
      Alert.alert("Sucesso", "Senha redefinida com sucesso");
      router.replace("/loginScreen");
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      Alert.alert("Erro", error);
    }
  }, [error]);
  useEffect(() => {
  const checkRecoverySession = async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      Alert.alert(
        "Acesso inválido",
        "Este link expirou ou não é válido."
      );
      router.replace("/loginScreen");
      return;
    }

    // Opcional, mas recomendado
    if (data.session.user?.aud !== "authenticated") {
      router.replace("/loginScreen");
    }
  };

  checkRecoverySession();
}, []);

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
