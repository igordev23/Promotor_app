import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


import { useListLeadsViewModel } from "@/src/viewmodel/useListLeadsViewModel";

export default function ListarLeadsView() {
  const router = useRouter();
  const { state, actions } = useListLeadsViewModel();

  const [busca, setBusca] = useState("");

  // 🔹 Carrega leads ao entrar na tela
  useEffect(() => {
    actions.loadLeads();
  }, []);

  // 🔹 Pesquisa delegada ao ViewModel
  const handleSearch = (text: string) => {
    setBusca(text);
    if (!text.trim()) {
      actions.resetFilter();
    } else {
      actions.searchLeads(text);
    }
  };
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const toggleSelectLead = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // desmarca
        : [...prev, id] // marca
    );
  };

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

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Listar Leads</Text>

        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={26} color="#d33" />
        </TouchableOpacity>
      </View>

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Procure por Leads Registrados"
            value={busca}
            onChangeText={handleSearch}
          />
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={22} />
        </TouchableOpacity>
      </View>

      {/* LOADING */}
      {state.loading && (
        <ActivityIndicator style={{ marginTop: 20 }} />
      )}

      {/* ERROR */}
      {state.error && (
        <Text style={{ color: "red", marginTop: 10 }}>
          {state.error}
        </Text>
      )}

      {/* COUNT */}
      {!state.loading && (
        <Text style={styles.countText}>
          {state.leads.length} Leads encontrados
        </Text>
      )}

      {/* LIST */}
      <FlatList
        data={state.leads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>

            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <TouchableOpacity onPress={() => toggleSelectLead(item.id)}>
                <Ionicons
                  name={
                    selectedLeads.includes(item.id)
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={22}
                  color="#d33"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardInfo}>Criado em 📅:  {item.criadoEm}</Text>
            <Text style={styles.cardInfo}>Telefone 📞:     {formatPhone(item.telefone)}</Text>
            <Text style={styles.cardInfo}>CPF 🪪:              {formatCPF(item.cpf)}</Text>

            <View style={styles.cardActions}>
              <TouchableOpacity>
                <Ionicons name="pencil" size={20} />
              </TouchableOpacity>

              <TouchableOpacity>
                <Ionicons name="trash" size={22} color="#d33" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    marginBottom: 20
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
