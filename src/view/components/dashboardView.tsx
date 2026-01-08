import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDashboardViewModel } from "@/src/viewmodel/useDashboardViewModel";
import { useLoginViewModel } from "@/src/viewmodel/useLoginViewModel";

export default function DashboardView() {
  const { state, actions } = useDashboardViewModel();

  const {
    userName,
    isWorking,
    totalLeads,
    loading,
    error,
  } = state;

  const { loadData, toggleWorkStatus } = actions;

  // Carrega dados ao abrir a tela
  useEffect(() => {
    loadData();
  }, []);

  const { actions: loginActions } = useLoginViewModel();
  const { logout } = loginActions;


  const handleLogout = async () => {
    await logout();
    router.replace("/loginScreen");
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <MaterialIcons name="account-circle" size={28} color="#3F51B5" />
      </View>

      <Text style={styles.userText}>Olá, {userName}</Text>

      {/* Loading */}
      {loading && (
        <ActivityIndicator size="large" color="#3F51B5" />
      )}

      {/* Erro */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Status */}
      <Text style={styles.status}>
        Status da Jornada {isWorking ? "🟢 Ativa" : "🔴 Inativa"}
      </Text>

      {/* Botão Iniciar / Encerrar */}
      <Button
        mode="contained"
        style={styles.mainButton}
        onPress={toggleWorkStatus}
        disabled={loading}
      >
        {isWorking ? "Encerrar Jornada" : "Iniciar Jornada"}
      </Button>

      {/* Cards */}
      <View style={styles.metricsRow}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metricValue}>{totalLeads}</Text>
            <Text style={styles.metricInfo}>Leads Hoje</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metricValue}>
              {isWorking ? 1 : 0}    {/* Registrar Leads */}
            </Text>
            <Text style={styles.metricInfo}>Tempo Ativo</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Registrar Leads */}
      <View style={styles.actionRow}>
        <MaterialIcons
          name="person-add"
          size={28}
          color="#fff"
          style={styles.iconBox}
        />
        <Text
          style={styles.actionText}
          onPress={() => router.push("/RegisterLeadScreen")}
        >
          Registrar Leads
        </Text>
      </View>

      {/* Listar Leads */}
      <View style={styles.actionRow}>
        <MaterialIcons
          name="list-alt"
          size={28}
          color="#fff"
          style={styles.iconBox}
        />
        <Text
          style={styles.actionText}
          onPress={() => router.push("/ListLeadsScreen")}
        >
          Listar Leads
        </Text>
      </View>

      {/* Sair */}
      <Button
        mode="contained"
        style={styles.exitButton}
        onPress={handleLogout}
      >
        Sair
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FF",
    padding: 24
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 20,
    color: "#1B1B1F"
  },
  status: {
    color: "#3F51B5",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600"
  },
  mainButton: {
    alignSelf: "center",
    borderRadius: 50,
    marginBottom: 16
  },
  timeText: {
    textAlign: "center",
    color: "#1B1B1F",
    marginBottom: 6
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24
  },
  card: {
    width: "47%",
    backgroundColor: "#E2E2E6",
    borderRadius: 16
  },
  metricValue: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600"
  },
  metricInfo: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "400"
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24
  },
  iconBox: {
    backgroundColor: "#3F51B5",
    padding: 12,
    borderRadius: 12,
    marginRight: 12
  },
  actionText: {
    color: "#3F51B5",
    fontSize: 16,
    fontWeight: "600"
  },
  exitButton: {
    marginTop: "auto",
    alignSelf: "center",
    borderRadius: 50
  },
  userText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },

  errorText: {
    color: "#D32F2F",
    backgroundColor: "#FDECEA",
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
    textAlign: "center",
    fontSize: 14,
  },
});
