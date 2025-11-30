import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";

const mockLeads = [
  { id: "1", name: "João Silva", email: "joao.silva@email.com" },
  { id: "2", name: "Maria Oliveira", email: "maria.oliveira@email.com" },
  { id: "3", name: "Carlos Santos", email: "carlos.santos@email.com" },
];

const ListLeadsScreen: React.FC = () => {
  const isLoading = false; // Simulação de estado de carregamento

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={mockLeads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.leadItem}>
              <Text style={styles.leadName}>{item.name}</Text>
              <Text style={styles.leadEmail}>{item.email}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  leadItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
  },
  leadName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  leadEmail: {
    fontSize: 14,
    color: "#666666",
  },
});

export default ListLeadsScreen;
