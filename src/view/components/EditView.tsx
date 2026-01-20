import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLeadEditViewModel } from "@/src/viewmodel/useLeadEditViewModel";

type FieldErrors = {
  nome?: string;
  cpf?: string;
  telefone?: string;
};

export default function EditView() {
  const { state, actions } = useLeadEditViewModel();
  const router = useRouter();
  const params = useLocalSearchParams();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const dateTime = useMemo(
    () => new Date().toLocaleString("pt-BR"),
    []
  );

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

  // 🔹 Inicializa dados
  useEffect(() => {
    if (params.nome) setNome(String(params.nome));
    if (params.cpf) setCpf(formatCPF(String(params.cpf)));
    if (params.telefone) setTelefone(formatPhone(String(params.telefone)));
  }, []);

  const handleSave = async () => {
  setFieldErrors({});

  try {
    await actions.editLead({
      id: String(params.id),
      nome,
      cpf: cpf.replace(/\D/g, ""),
      telefone: telefone.replace(/\D/g, ""),
    });

    // ✅ só navega se NÃO deu erro
    router.replace("/ListLeadsScreen");

  } catch (err: any) {
    const msg = err.message.toLowerCase();
    const errors: FieldErrors = {};

    if (msg.includes("nome")) errors.nome = err.message;
    if (msg.includes("cpf")) errors.cpf = err.message;
    if (msg.includes("telefone")) errors.telefone = err.message;

    setFieldErrors(errors);
  }
};


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
        {/* NOME */}
        <TextInput
          label="Nome completo"
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            setFieldErrors((prev) => ({ ...prev, nome: undefined }));
          }}
          mode="outlined"
          error={!!fieldErrors.nome}
          style={styles.input}
        />
        {fieldErrors.nome && (
          <Text style={styles.errorText}>{fieldErrors.nome}</Text>
        )}

        {/* TELEFONE */}
        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={(text) => {
            setTelefone(formatPhone(text));
            setFieldErrors((prev) => ({ ...prev, telefone: undefined }));
          }}
          mode="outlined"
          keyboardType="phone-pad"
          error={!!fieldErrors.telefone}
          style={styles.input}
        />
        {fieldErrors.telefone && (
          <Text style={styles.errorText}>{fieldErrors.telefone}</Text>
        )}

        {/* CPF */}
        <TextInput
          label="CPF"
          value={cpf}
          onChangeText={(text) => {
            setCpf(formatCPF(text));
            setFieldErrors((prev) => ({ ...prev, cpf: undefined }));
          }}
          mode="outlined"
          keyboardType="numeric"
          error={!!fieldErrors.cpf}
          style={styles.input}
        />
        {fieldErrors.cpf && (
          <Text style={styles.errorText}>{fieldErrors.cpf}</Text>
        )}

        {state.loading ? (
          <ActivityIndicator />
        ) : (
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveBtn}
          >
            Salvar
          </Button>
        )}
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
  errorText: {
  color: "#D32F2F",
  marginTop: -18,
  marginBottom: 16,
  fontSize: 13,
},

});
