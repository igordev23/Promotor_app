import React, { useEffect, useState, FC, Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  AlertButton,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";

import { Lead } from "@/src/model/entities/Lead";
import { useListLeadsViewModel } from "@/src/viewmodel/useListLeadsViewModel";
import {
  IListLeadsViewModelReturn,
  RemoveLeadHandler,
  RemoveSelectedHandler,
  EditLeadHandler,
} from "@/src/viewmodel/types/ListLeadsTypes";
import { SuccessFeedbackCard } from "../components/SuccessSnackbar";

/**
 * Componente de listagem de leads
 * Responsável apenas pela renderização da UI
 * Toda lógica está delegada à useListLeadsViewModel
 */
const ListarLeadsView: FC = () => {
  const router = useRouter();
  const { state, actions }: IListLeadsViewModelReturn = useListLeadsViewModel();
  const [successVisible, setSuccessVisible]: [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ] = useState<boolean>(false);

  /**
   * Carrega leads ao montar o componente
   */
  useEffect((): void => {
    actions.loadLeads().catch((err: unknown): void => {
      console.error("Erro ao carregar leads:", err);
    });
  }, []);

  /**
   * Remove um lead individual com confirmação
   */
  const handleRemove: RemoveLeadHandler = (id: string): void => {
    const alertButtons: AlertButton[] = [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async (): Promise<void> => {
          try {
            await actions.removeLead(id);
            setSuccessVisible(true);
          } catch (err: unknown) {
            const errorMessage: string =
              state.error || "Erro ao remover lead";
            Alert.alert("Erro", errorMessage);
          }
        },
      },
    ];

    Alert.alert("Confirmar", "Deseja remover este lead?", alertButtons);
  };

  /**
   * Remove múltiplos leads com confirmação
   */
  const handleRemoveSelected: RemoveSelectedHandler = (): void => {
    const selectedCount: number = state.selectedLeads.length;
    const alertButtons: AlertButton[] = [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async (): Promise<void> => {
          try {
            await actions.removeSelected();
            setSuccessVisible(true);
          } catch (err: unknown) {
            const errorMessage: string =
              state.error || "Erro ao remover leads";
            Alert.alert("Erro", errorMessage);
          }
        },
      },
    ];

    Alert.alert(
      "Excluir Leads",
      `Deseja excluir ${selectedCount} leads?`,
      alertButtons
    );
  };

  /**
   * Navega para a tela de edição
   */
  const handleEditLead: EditLeadHandler = (lead: Lead): void => {
    const navigationParams: {
      id: string;
      nome: string;
      cpf: string;
      telefone: string;
    } = {
      id: lead.id,
      nome: lead.nome,
      cpf: lead.cpf,
      telefone: lead.telefone,
    };

    router.push({
      pathname: "/EditLeadScreen",
      params: navigationParams,
    });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={(): void => {
            router.push("/DashboardScreen");
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Listar Leads</Text>

        <TouchableOpacity
          onPress={(): void => {
            actions.selectAll();
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={
              state.selectedLeads.length === state.leads.length &&
                state.leads.length > 0
                ? "checkbox"
                : "square-outline"
            }
            size={22}
            color="#d33"
          />
        </TouchableOpacity>

        {state.selectedLeads.length > 0 && (
          <TouchableOpacity
            onPress={handleRemoveSelected}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={24} color="#d33" />
          </TouchableOpacity>
        )}
      </View>

      {/* LOADING */}
      {state.loading && <ActivityIndicator style={{ marginVertical: 20 }} />}

      {/* ERROR */}
      {state.error && (
        <Text style={{ color: "red", marginBottom: 10 }}>{state.error}</Text>
      )}

      {/* LISTA */}
      <FlatList<Lead>
        data={Array.from(state.leads)}
        keyExtractor={(item: Lead): string => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {/* SEARCH */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={18} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Procure por Leads Registrados"
                value={state.busca}
                onChangeText={(text: string): void => {
                  actions.updateSearchQuery(text);
                }}
                placeholderTextColor="#999"
              />
              {state.busca && (
                <TouchableOpacity
                  onPress={(): void => {
                    actions.updateSearchQuery("");
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={18} color="#777" />
                </TouchableOpacity>
              )}
            </View>

            {!state.loading && (
              <Text style={styles.countText}>
                {state.leads.length} Leads encontrados
              </Text>
            )}
          </>
        }
        renderItem={({ item }: { item: Lead }): JSX.Element => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.nome}</Text>

              <TouchableOpacity
                onPress={(): void => {
                  actions.toggleSelectLead(item.id);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    state.selectedLeads.includes(item.id)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={22}
                  color="#d33"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardInfo}>📅 {item.criadoEm}</Text>
            <Text style={styles.cardInfo}>📞 {item.telefone}</Text>
            <Text style={styles.cardInfo}>🪪 {item.cpf}</Text>

            <View style={styles.cardActions}>
              <TouchableOpacity
                onPress={(): void => {
                  handleEditLead(item);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={20} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={(): void => {
                  handleRemove(item.id);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="trash" size={22} color="#d33" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* FEEDBACK */}
      <SuccessFeedbackCard
        visible={successVisible}
        onDismiss={(): void => setSuccessVisible(false)}
        message="Lead excluído com sucesso!"
      />
    </View>
  );
};

export default ListarLeadsView;

interface IStyles {
  container: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
  searchRow: ViewStyle;
  searchBox: ViewStyle;
  input: TextStyle;
  filterButton: ViewStyle;
  countText: TextStyle;
  card: ViewStyle;
  cardTop: ViewStyle;
  cardTitle: TextStyle;
  cardInfo: TextStyle;
  cardActions: ViewStyle;
}

const styles = StyleSheet.create<IStyles>({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
    marginTop: 20,
    marginBottom: 110
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 5
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
  },

  input: {
    flex: 1,
    marginLeft: 6,
    paddingVertical: 0, // Android fix
  },

  filterButton: {
    padding: 6,
  },

  countText: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 20,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  cardTitle: {
    fontWeight: "600",
    fontSize: 20,
  },

  cardInfo: {
    fontWeight: "400",
    fontSize: 17,
    marginBottom: 7,
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 6,
  },
});