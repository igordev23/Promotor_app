import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SuccessFeedbackCard } from "../components/SuccessSnackbar";

import { useLeadRegisterViewModel } from "@/src/viewmodel/useLeadRegisterViewModel";

export default function RegisterView() {
  const { state, actions } = useLeadRegisterViewModel();
  const router = useRouter();

  const dateTime = useMemo(() => new Date().toLocaleString("pt-BR"), []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          onPress={() => router.replace("/DashboardScreen")}
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
          value={state.lead.nome}
          onChangeText={(text) => actions.updateField("nome", text)}
          mode="outlined"
          error={!!state.fieldErrors.nome}
          style={styles.input}
        />
        {state.fieldErrors.nome && (
          <Text style={styles.errorText}>{state.fieldErrors.nome}</Text>
        )}

        {/* TELEFONE */}
        <TextInput
          label="Digite seu número"
          value={state.lead.telefone}
          onChangeText={(text) => actions.updateField("telefone", text)}
          mode="outlined"
          keyboardType="phone-pad"
          error={!!state.fieldErrors.telefone}
          style={styles.input}
        />
        {state.fieldErrors.telefone && (
          <Text style={styles.errorText}>{state.fieldErrors.telefone}</Text>
        )}

        {/* CPF */}
        <TextInput
          label="Digite seu CPF"
          value={state.lead.cpf}
          onChangeText={(text) => actions.updateField("cpf", text)}
          mode="outlined"
          keyboardType="numeric"
          error={!!state.fieldErrors.cpf}
          style={styles.input}
        />
        {state.fieldErrors.cpf && (
          <Text style={styles.errorText}>{state.fieldErrors.cpf}</Text>
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
              onPress={actions.registerLead}
              style={styles.saveBtn}
            >
              Salvar
            </Button>
          )}
        </View>
      </View>

    <SuccessFeedbackCard
  visible={state.success}
  onDismiss={actions.clearSuccess}
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
    marginBottom: 90,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
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
    backgroundColor: "#3F51B5",
  },

  input: {
    marginBottom: 32,
  },

  timeBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#E2E2E6",
    alignSelf: "center",
    marginBottom: 24,
  },

  timeLabel: {
    fontWeight: "600",
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
    marginBottom: 32,
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
