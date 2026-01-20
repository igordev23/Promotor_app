import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Snackbar } from "react-native-paper";
import { SuccessFeedbackCard } from "../components/SuccessSnackbar";


import { useLeadRegisterViewModel } from "@/src/viewmodel/useLeadRegisterViewModel";

type FieldErrors = {
  nome?: string;
  cpf?: string;
  telefone?: string;
};

export default function RegisterView() {
  const { state, actions } = useLeadRegisterViewModel();
  const router = useRouter();
  const [successVisible, setSuccessVisible] = useState(false);

  // 🔹 Campos
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  // 🔹 Erros por campo
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

  const handleSave = async () => {
  setFieldErrors({});

  try {
    await actions.registerLead({
      nome,
      cpf: cpf.replace(/\D/g, ""),
      telefone: telefone.replace(/\D/g, ""),
    });

    // ✅ Limpa campos
    setNome("");
    setCpf("");
    setTelefone("");

    // ✅ Feedback visual
    setSuccessVisible(true);

  } catch (err: any) {
    const error = err.message.toLowerCase();
    const errors: FieldErrors = {};

    if (error.includes("nome")) errors.nome = err.message;
    if (error.includes("cpf")) errors.cpf = err.message;
    if (error.includes("telefone")) errors.telefone = err.message;

    setFieldErrors(errors);
  }
};


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Registrar Leads</Text>
      </View>

      <View style={styles.card}>
        <Button
  icon="account-plus"
  mode="contained"
  style={styles.newLeadBtn}
  onPress={() => {}}
>
  Novo Lead
</Button>


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
          label="Digite seu número"
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
          label="Digite seu CPF"
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

        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>Registro salvo em:</Text>
          <Text>{dateTime}</Text>
        </View>

        <View style={styles.boxButton}>
          <Button
            mode="contained"
            onPress={() => router.push("/DashboardScreen")}
            style={styles.cancelarBtn}
          >
            Cancelar
          </Button>

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
      
<SuccessFeedbackCard
  visible={successVisible}
  onDismiss={() => setSuccessVisible(false)}
  message="Lead registrado com sucesso!"
/>


    </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
    marginTop: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 90
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600"
  },

  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E2E6",
  },

  newLeadBtn: {
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 32,
    backgroundColor: "#3F51B5"
  },

  input: {
    marginBottom: 32
  },

  timeBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#E2E2E6",
    alignSelf: "center",
    marginBottom: 24
  },

  timeLabel: {
    fontWeight: "600"
  },

  saveBtn: {
    margin: 10,
    borderRadius: 50,
    width: "50%",
  },

  boxButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "85%",
    marginBottom: 32
  },


  cancelarBtn: {
    margin: 10,
    borderRadius: 50,
    width: "50%",
    backgroundColor: "#F44336", // vermelho
  },
  errorText: {
  color: "#D32F2F",
  marginTop: -24,
  marginBottom: 16,
  fontSize: 13,
},

});