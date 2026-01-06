import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useLeadRegisterViewModel } from "@/src/viewmodel/useLeadRegisterViewModel";

export default function RegisterView() {

  const vm = useLeadRegisterViewModel();
  const router = useRouter();

  return (
    <View style={styles.container}>

      {/* Top Bar */}
      <View style={styles.header}>
        <MaterialIcons 
          name="arrow-back" 
          size={26} 
          color="#1B1B1F"
          onPress={() => router.back()}
        />

        <Text 
        style={styles.headerTitle}
        onPress={() => router.push("/RegisterScreen")}
        >
            Registrar Leads</Text>
        
      </View>

      {/* Card */}
      <View style={styles.card}>

        <Button
          icon="account-plus"
          mode="contained"
          style={styles.newLeadBtn}
        >
          Novo Lead
        </Button>

        <TextInput
          label="Nome completo"
          value={vm.name}
          onChangeText={vm.setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Digite seu número"
          value={vm.phone}
          onChangeText={vm.setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Digite seu CPF"
          value={vm.cpf}
          onChangeText={vm.setCpf}
          mode="outlined"
          style={styles.input}
        />

        <View style={styles.timeBox}>
          <Text style={styles.timeLabel}>Registro salvo em:</Text>
          <Text>{vm.dateTime}</Text>
        </View>

        <Button
          mode="contained"
          onPress={vm.saveLead}
          style={styles.saveBtn}
        >
          Salvar
        </Button>

      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FF",
    padding: 16
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "600"
  },

  card: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E2E6",
  },

  newLeadBtn: {
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 24,
    backgroundColor: "#3F51B5"
  },

  input: {
    marginBottom: 16
  },

  timeBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#E2E2E6",
    alignSelf: "center",
    marginBottom: 24
  },

  timeLabel: {
    fontWeight: "600"
  },

  saveBtn: {
    borderRadius: 50,
    alignSelf: "center",
    width: 160
  }
});
