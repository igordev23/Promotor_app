// src/view/components/dashboardView.tsx
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextStyle,
  ViewStyle
} from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDashboardViewModel } from "@/src/viewmodel/useDashboardViewModel";
import { useLoginViewModel } from "@/src/viewmodel/useLoginViewModel";

// Tipos para as propriedades do componente
interface DashboardViewProps { }

// Tipo para os estilos
interface DashboardStyles {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  status: TextStyle;
  mainButton: ViewStyle;
  mainButtonContent: ViewStyle;
  mainButtonLabel: TextStyle;
  metricsRow: ViewStyle;
  card: ViewStyle;
  metricValue: TextStyle;
  metricInfo: TextStyle;
  actionRow: ViewStyle;
  iconBox: ViewStyle;
  actionText: TextStyle;
  errorText: TextStyle;
  userText: TextStyle;
  timeText: TextStyle;
  exitButton: ViewStyle;
}

// Função utilitária para formatação de tempo
const formatElapsedTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const padNumber = (num: number): string => String(num).padStart(2, "0");

  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
};

export default function DashboardView(_props: DashboardViewProps): React.ReactElement {
  const { state, actions } = useDashboardViewModel();
  const {
    userName,
    isWorking,
    totalLeads,
    loading,
    error,
    elapsedMs
  } = state;

  const { loadData, toggleWorkStatus } = actions;

  const { actions: loginActions } = useLoginViewModel();
  const { logout } = loginActions;

  // Carrega dados ao montar o componente
  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.replace("/loginScreen");
  };

  const handleNavigateToRegisterLead = (): void => {
    router.replace("/RegisterLeadScreen");
  };

  const handleNavigateToListLeads = (): void => {
    router.push("/ListLeadsScreen");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <MaterialIcons
          name="account-circle"
          size={28}
          color="#3F51B5"
        />
      </View>

      {/* Exibição do nome do usuário */}
      {userName && (
        <Text style={styles.userText}>
          Olá, {userName}
        </Text>
      )}

      {/* Loading State */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#3F51B5"
          style={{ marginVertical: 20 }}
        />
      )}

      {/* Error State */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Status da Jornada */}
      <Text style={styles.status}>
        Status da Jornada {isWorking ? "🟢" : "🔴"}
      </Text>

      {/* Botão Principal - Iniciar/Encerrar Jornada */}
      <Button
        testID="journey-toggle-button"
        mode="contained"
        style={styles.mainButton}
        contentStyle={styles.mainButtonContent}
        labelStyle={styles.mainButtonLabel}
        onPress={toggleWorkStatus}
        disabled={loading}
        accessibilityLabel={isWorking ? "Encerrar jornada de trabalho" : "Iniciar jornada de trabalho"}
      >
        {isWorking ? "Encerrar Jornada" : "Iniciar Jornada"}
      </Button>

      {/* Tempo Ativo */}
      {isWorking && (
        <Text style={styles.timeText}>
          Tempo ativo: {formatElapsedTime(elapsedMs)}
        </Text>
      )}

      {/* Métricas */}
      <View style={styles.metricsRow}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metricValue}>
              {totalLeads}
            </Text>
            <Text style={styles.metricInfo}>
              Leads Hoje
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metricValue}>
              {isWorking ? formatElapsedTime(elapsedMs) : "00:00:00"}
            </Text>
            <Text style={styles.metricInfo}>
              Tempo Ativo
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Ações */}
      <View style={styles.actionRow}>
        <MaterialIcons
          name="person-add"
          size={28}
          color="#fff"
          style={styles.iconBox}
        />
        <Text
          style={styles.actionText}
          onPress={handleNavigateToRegisterLead}
          accessibilityRole="button"
        >
          Registrar Leads
        </Text>
      </View>

      <View style={styles.actionRow}>
        <MaterialIcons
          name="list-alt"
          size={28}
          color="#fff"
          style={styles.iconBox}
        />
        <Text
          testID="list-leads-button"
          style={styles.actionText}
          onPress={handleNavigateToListLeads}
          accessibilityRole="button"
        >
          Listar Leads
        </Text>
      </View>

      {/* Botão de Sair */}
      <Button
        mode="contained"
        style={[styles.mainButton, styles.exitButton]}
        contentStyle={styles.mainButtonContent}
        labelStyle={styles.mainButtonLabel}
        onPress={handleLogout}
        disabled={loading}
        accessibilityLabel="Sair da aplicação"
      >
        Sair
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create<DashboardStyles>({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1B1F",
  },
  status: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3F51B5",
    textAlign: "center",
    marginVertical: 32,
  },
  mainButton: {
    alignSelf: "center",
    borderRadius: 50,
    marginVertical: 16,
    width: '55%',
  },
  mainButtonContent: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  mainButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  timeText: {
    textAlign: "center",
    color: "#1B1B1F",
    fontSize: 14,
    marginBottom: 6,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 32,
  },
  card: {
    width: "46%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricValue: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: "#3F51B5",
  },
  metricInfo: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  iconBox: {
    backgroundColor: "#3F51B5",
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
  },
  actionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3F51B5",
    flex: 1,
  },
  exitButton: {
    marginTop: 32,
    marginBottom: 48,
  },
  userText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 24,
    textAlign: "center",
  },
  errorText: {
    color: "#D32F2F",
    backgroundColor: "#FDECEA",
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
});