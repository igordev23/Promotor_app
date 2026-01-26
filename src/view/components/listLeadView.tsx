import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Lead } from "@/src/model/entities/Lead";
import { leadUseCase } from "@/src/useCases/LeadUseCase";
import { SuccessFeedbackCard } from "../components/SuccessSnackbar";
export default function ListarLeadsView() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [successVisible, setSuccessVisible] = useState(false);

  // 🔹 Carregar leads
  async function loadLeads() {
    try {
      setLoading(true);
      setError(null);

      const data = await leadUseCase.getLeads();
      setLeads(data);
      setAllLeads(data);
      setSelectedLeads([]);
    } catch (err) {
      setError(leadUseCase.parseError(err));
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Selecionar / desmarcar lead
  function toggleSelectLead(id: string) {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  }

  // 🔹 Selecionar todos
  function handleSelectAll() {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((l) => l.id));
    }
  }

  // 🔹 Remover lead individual
  async function handleRemove(id: string) {
    Alert.alert("Confirmar", "Deseja remover este lead?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await leadUseCase.removeLead(id);

            const updated = allLeads.filter((l) => l.id !== id);
            setAllLeads(updated);
            setLeads(updated);
            setSelectedLeads((prev) => prev.filter((l) => l !== id));
            // ✅ Feedback visual
    setSuccessVisible(true);
          } catch (err) {
            Alert.alert("Erro", leadUseCase.parseError(err));
          }
        },
      },
    ]);
  }

  // 🔹 Remover selecionados
  async function handleRemoveSelected() {
    Alert.alert(
      "Excluir Leads",
      `Deseja excluir ${selectedLeads.length} leads?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await Promise.all(
                selectedLeads.map((id) => leadUseCase.removeLead(id))
              );

              const updated = allLeads.filter(
                (l) => !selectedLeads.includes(l.id)
              );

              setAllLeads(updated);
              setLeads(updated);
              setSelectedLeads([]);
              // ✅ Feedback visual
    setSuccessVisible(true);
            } catch (err) {
              Alert.alert("Erro", leadUseCase.parseError(err));
            }
          },
        },
      ]
    );
  }

  useEffect(() => {
    loadLeads();
  }, []);

  // 🔹 Buscar
  function handleSearch(text: string) {
    setBusca(text);

    if (!text.trim()) {
      setLeads(allLeads);
    } else {
      setLeads(leadUseCase.filterLeads(allLeads, text));
    }
  }

 function handleEditLead(lead: Lead) {
  router.replace({
    pathname: "/EditLeadScreen",
    params: {
      id: lead.id,
      nome: lead.nome,
      cpf: lead.cpf,
      telefone: lead.telefone,
    },
  });
}

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/DashboardScreen")}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Listar Leads</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#777" />
          <TextInput
            testID="search-leads-input"
            style={styles.input}
            placeholder="Procure por Leads Registrados"
            value={busca}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      <Text style={styles.title}>Listar Leads</Text>

      <TouchableOpacity onPress={handleSelectAll}>
        <Ionicons
          name={
            selectedLeads.length === leads.length && leads.length > 0
              ? "checkbox"
              : "square-outline"
          }
          size={22}
          color="#d33"
        />
      </TouchableOpacity>

      {selectedLeads.length > 0 && (
        <TouchableOpacity onPress={handleRemoveSelected}>
          <Ionicons name="trash" size={24} color="#d33" />
        </TouchableOpacity>
      )}
    </View>

    {/* LOADING */}
    {loading && <ActivityIndicator style={{ marginVertical: 20 }} />}

    {/* ERROR */}
    {error && <Text style={{ color: "red" }}>{error}</Text>}

    {/* LISTA */}
    <FlatList
      data={leads}
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
              value={busca}
              onChangeText={handleSearch}
            />
          </View>

      {/* LIST */}
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card} testID={`lead-item-${item.id}`}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.nome}</Text>

              <TouchableOpacity onPress={() => handleEditLead(item)}>
                <Ionicons name="pencil" size={20} />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardInfo}>
              Telefone 📞: {item.telefone}
            </Text>
          )}
        </>
      }
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

          <Text style={styles.cardInfo}>📅 {item.criadoEm}</Text>
          <Text style={styles.cardInfo}>📞 {item.telefone}</Text>
          <Text style={styles.cardInfo}>🪪 {item.cpf}</Text>

          <View style={styles.cardActions}>
            <TouchableOpacity onPress={() => handleEditLead(item)}>
              <Ionicons name="pencil" size={20} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Ionicons name="trash" size={22} color="#d33" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />

    {/* FEEDBACK */}
    <SuccessFeedbackCard
      visible={successVisible}
      onDismiss={() => setSuccessVisible(false)}
      message="Lead excluído com sucesso!"
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