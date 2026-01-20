import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLeadEditViewModel } from "@/src/viewmodel/useLeadEditViewModel";

export default function EditView() {
  const { state, actions } = useLeadEditViewModel();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  // 🔹 Apenas visual
  const dateTime = useMemo(() => new Date().toLocaleString("pt-BR"), []);

  // 🔹 Formatação
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3");
  };

  // 🔹 Inicializar dados vindos da lista (edição)
  useEffect(() => {
    if (params.nome) setNome(String(params.nome));
    if (params.cpf) setCpf(formatCPF(String(params.cpf)));
    if (params.telefone) setTelefone(formatPhone(String(params.telefone)));
  }, []);

  // 🔹 Salvar edição
  const handleSave = async () => {
    await actions.registerLead({
      id: String(params.id),
      nome,
      cpf: cpf.replace(/\D/g, ""),
      telefone: telefone.replace(/\D/g, ""),
    });

    // Redirecionar para a tela correta
    router.replace("/ListLeadsScreen");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          color="#1B1B1F"
          onPress={() => router.replace("/ListLeadsScreen")}
        />
        <Text style={styles.headerTitle}>Editar Lead</Text>
      </View>

      {/* FORM */}
      <View style={styles.card}>
        <TextInput
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={(text) => setTelefone(formatPhone(text))}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="CPF"
          value={cpf}
          onChangeText={(text) => setCpf(formatCPF(text))}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSave}
          loading={state.loading}
          disabled={!nome || !cpf || !telefone}
          style={styles.saveBtn}
        >
          Salvar
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E2E6",
  },

  input: {
    marginBottom: 24,
  },

  saveBtn: {
    marginTop: 16,
    borderRadius: 50,
  },
});
