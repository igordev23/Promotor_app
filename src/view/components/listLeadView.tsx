import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Lead = {
  id: string;
  nome: string;
  data: string;
  telefone: string;
  cpf: string;
};

const mockLeads: Lead[] = [
  {
    id: "1",
    nome: "João Silva da Costa Lima",
    data: "02/01/2026 - 10:38",
    telefone: "(62) 0000-0000",
    cpf: "000.000.000-00",
  },
  {
    id: "2",
    nome: "João Silva da Costa Lima",
    data: "02/01/2026 - 10:38",
    telefone: "(62) 0000-0000",
    cpf: "000.000.000-00",
  },
];

export default function ListarLeadsView() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [busca, setBusca] = useState("");

  const leadsFiltrados = leads.filter(l =>
    l.nome.toLowerCase().includes(busca.toLowerCase())
  );

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
            onChangeText={setBusca}
          />
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={22} />
        </TouchableOpacity>
      </View>

      {/* COUNT */}
      <Text style={styles.countText}>
        {leadsFiltrados.length} Leads encontrados
      </Text>

      {/* LIST */}
      <FlatList
        data={leadsFiltrados}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Ionicons name="alert-circle-outline" size={22} color="#d33" />
            </View>

            <Text>📅  {item.data}</Text>
            <Text>📞  {item.telefone}</Text>
            <Text>🪪  {item.cpf}</Text>

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
    flex: 1,
    padding: 18,
    backgroundColor: "#F4F4F4",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
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
  },

  filterButton: {
    padding: 6,
  },

  countText: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 14,
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
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 6,
  },
});
