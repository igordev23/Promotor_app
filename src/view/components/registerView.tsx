import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useLeadRegisterViewModel } from "@/src/viewmodel/useLeadRegisterViewModel";

export default function RegisterView() {
  const { state, actions } = useLeadRegisterViewModel();
  const router = useRouter();

  // 🔹 Estados controlados pela View
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");

  // 🔹 Apenas visual
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
    await actions.registerLead({
      nome,
      cpf: cpf.replace(/\D/g, ""),            //remover formatação antes de enviar
      telefone: telefone.replace(/\D/g, "")   //remover formatação antes de enviar
    });

    setNome("");
    setCpf("");
    setTelefone("");
  };


  return (
    <View style={styles.container}>

      {/* Top Bar */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          color="#1B1B1F"
          onPress={() => router.back()}
        />

        <Text style={styles.headerTitle}>
          Registrar Leads
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>

        <Button
          icon="account-plus"
          mode="contained"
          style={styles.newLeadBtn}
        >
          Novo Lead
        </Button>

        <TextInput
          label="Nome completo"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Digite seu número"
          value={telefone}
          onChangeText={(text) => setTelefone(formatPhone(text))}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Digite seu CPF"
          value={cpf}
          onChangeText={(text) => setCpf(formatCPF(text))}
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
        />

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
              disabled={!nome || !cpf || !telefone}
            >
              Salvar
            </Button>
          )}

          {state.error && (
            <Text style={{ color: "red", marginTop: 8 }}>
              {state.error}
            </Text>
          )}
        </View>
      </View>
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
  }
});