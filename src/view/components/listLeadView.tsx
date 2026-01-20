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
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

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

  // 🔹 Selecionar
  function toggleSelectLead(id: string) {
    setSelectedLeads((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  // 🔹 Remover
  async function handleRemove(id: string) {
    try {
      await leadUseCase.removeLead(id);

      const updated = allLeads.filter((l) => l.id !== id);
      setAllLeads(updated);
      setLeads(updated);
    } catch (err) {
      setError(leadUseCase.parseError(err));
    }
  }

  // 🔹 Formatadores
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

              <Text style={styles.cardInfo}>
                Criado em 📅: {item.criadoEm}
              </Text>
              <Text style={styles.cardInfo}>
                Telefone 📞: {formatPhone(item.telefone)}
              </Text>
              <Text style={styles.cardInfo}>
                CPF 🪪: {formatCPF(item.cpf)}
              </Text>

              <View style={styles.cardActions}>
                <TouchableOpacity>
                  <Ionicons name="pencil" size={20} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemove(item.id)}>
                  <Ionicons name="trash" size={22} color="#d33" />
                </TouchableOpacity>
              </View>
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
