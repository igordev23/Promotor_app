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

import { Lead } from "@/src/model/entities/Lead";
import { leadUseCase } from "@/src/useCases/LeadUseCase";

export default function ListarLeadsView() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  // 🔹 Carregar leads
  async function loadLeads() {
    try {
      setLoading(true);
      setError(null);

      const data = await leadUseCase.getLeads();
      setLeads(data);
      setAllLeads(data);
    } catch (err) {
      setError(leadUseCase.parseError(err));
    } finally {
      setLoading(false);
    }
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
      const filtered = leadUseCase.filterLeads(allLeads, text);
      setLeads(filtered);
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

      {/* LOADING */}
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

      {/* ERROR */}
      {error && <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>}

      {/* COUNT */}
      {!loading && (
        <Text style={styles.countText}>{leads.length} Leads encontrados</Text>
      )}

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
            <Text style={styles.cardInfo}>CPF 🪪: {item.cpf}</Text>
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
    marginBottom: 110,
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
    marginBottom: 5,
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
    marginBottom: 20,
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
});
