import React, { useEffect, useState, FC, Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Lead } from "@/src/model/entities/Lead";
import { useListLeadsViewModel } from "@/src/viewmodel/useListLeadsViewModel";
import { IListLeadsViewModelReturn } from "@/src/viewmodel/types/ListLeadsTypes";
import { SuccessFeedbackCard } from "../components/SuccessSnackbar";
import { ConfirmDelete } from "./confirm";

const ListarLeadsView: FC = () => {
  const router = useRouter();
  const { state, actions }: IListLeadsViewModelReturn = useListLeadsViewModel();
  const [successVisible, setSuccessVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false);

  // Carrega leads ao montar
  useEffect(() => {
    actions.loadLeads().catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/DashboardScreen")} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Listar Leads</Text>

        <TouchableOpacity onPress={actions.selectAll} activeOpacity={0.7}>
          <Ionicons
            name={
              state.selectedLeads.length === state.leads.length && state.leads.length > 0
                ? "checkbox"
                : "square-outline"
            }
            size={22}
            color="#d33"
          />
        </TouchableOpacity>

        {state.selectedLeads.length > 0 && (
          <ConfirmDelete
            message={`Deseja excluir ${state.selectedLeads.length} leads?`}
            onConfirm={async () => {
              await actions.removeSelected();
              setSuccessVisible(true);
            }}
            trigger={<Ionicons name="trash" size={24} color="#d33" />}
          />
        )}
      </View>

      {/* LOADING */}
      {state.loading && <ActivityIndicator style={{ marginVertical: 20 }} />}

      {/* ERROR */}
      {state.error && <Text style={{ color: "red", marginBottom: 10 }}>{state.error}</Text>}

      {/* LISTA */}
      <FlatList<Lead>
        data={Array.from(state.leads)}
        keyExtractor={(item) => item.id}
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
                onChangeText={actions.updateSearchQuery}
                placeholderTextColor="#999"
              />
              {state.busca && (
                <TouchableOpacity onPress={() => actions.resetFilter()} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={18} color="#777" />
                </TouchableOpacity>
              )}
            </View>

            {!state.loading && <Text style={styles.countText}>{state.leads.length} Leads encontrados</Text>}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <TouchableOpacity onPress={() => actions.toggleSelectLead(item.id)} activeOpacity={0.7}>
                <Ionicons
                  name={state.selectedLeads.includes(item.id) ? "checkbox" : "square-outline"}
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
                onPress={() =>
                  router.push({
                    pathname: "/EditLeadScreen",
                    params: {
                      id: item.id,
                      nome: item.nome,
                      cpf: item.cpf,
                      telefone: item.telefone,
                    },
                  })
                }
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={20} />
              </TouchableOpacity>

              <ConfirmDelete
                message="Deseja remover este lead?"
                onConfirm={async () => {
                  await actions.removeLead(item.id);
                  setSuccessVisible(true);
                }}
                trigger={<Ionicons name="trash" size={22} color="#d33" />}
              />
            </View>
          </View>
        )}
      />

      {/* FEEDBACK */}
      <SuccessFeedbackCard
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        message={state.successMessage || "Operação realizada com sucesso!"}
      />
    </View>
  );
};

export default ListarLeadsView;

// Styles (mesmos que você já tinha)
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
    marginBottom: 110,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  title: { flex: 1, fontSize: 18, fontWeight: "600" },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 5 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
  },
  input: { flex: 1, marginLeft: 6, paddingVertical: 0 },
  filterButton: { padding: 6 },
  countText: { marginTop: 10, marginBottom: 8, fontSize: 20 },
  card: { backgroundColor: "#FFF", padding: 14, borderRadius: 12, marginBottom: 10 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  cardTitle: { fontWeight: "600", fontSize: 20 },
  cardInfo: { fontWeight: "400", fontSize: 17, marginBottom: 7 },
  cardActions: { flexDirection: "row", justifyContent: "flex-end", gap: 16, marginTop: 6 },
});
