import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLeadEditViewModel } from "@/src/viewmodel/useLeadEditViewModel";
import { SuccessFeedbackCard } from "../components/SuccessSnackbar";

export default function EditView() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [successVisible, setSuccessVisible] = useState(false);

  const { state, actions } = useLeadEditViewModel(
    String(params.id),
    {
      nome: String(params.nome ?? ""),
      cpf: String(params.cpf ?? ""),
      telefone: String(params.telefone ?? ""),
    },
    () => {
      // callback chamado direto pelo ViewModel
      setSuccessVisible(true);
      setTimeout(() => {
        router.replace("/ListLeadsScreen");
      }, 1500);
    }
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          onPress={() => router.replace("/ListLeadsScreen")}
        />
        <Text style={styles.headerTitle}>Editar Lead</Text>
      </View>

      {/* FORM */}
      <View style={styles.card}>
        <TextInput
          label="Nome completo"
          value={state.nome}
          onChangeText={actions.setNome}
          mode="outlined"
          error={!!state.errors.nome}
          style={styles.input}
        />
        {state.errors.nome && <Text style={styles.errorText}>{state.errors.nome}</Text>}

        <TextInput
          label="Telefone"
          value={state.telefone}
          onChangeText={actions.setTelefone}
          mode="outlined"
          keyboardType="phone-pad"
          error={!!state.errors.telefone}
          style={styles.input}
        />
        {state.errors.telefone && <Text style={styles.errorText}>{state.errors.telefone}</Text>}

        <TextInput
          label="CPF"
          value={state.cpf}
          onChangeText={actions.setCpf}
          mode="outlined"
          keyboardType="numeric"
          error={!!state.errors.cpf}
          style={styles.input}
        />
        {state.errors.cpf && <Text style={styles.errorText}>{state.errors.cpf}</Text>}

        {state.loading ? (
          <ActivityIndicator />
        ) : (
          <Button mode="contained" onPress={actions.editLead} style={styles.saveBtn}>
            Salvar
          </Button>
        )}
      </View>

      <SuccessFeedbackCard
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        message="Lead atualizado com sucesso!"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F9FF", padding: 24 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 32 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  card: { backgroundColor: "#FFF", padding: 24, borderRadius: 16, borderWidth: 1, borderColor: "#E2E2E6" },
  input: { marginBottom: 24 },
  saveBtn: { marginTop: 16, borderRadius: 50 },
  errorText: { color: "#D32F2F", marginTop: -18, marginBottom: 16, fontSize: 13 },
});
