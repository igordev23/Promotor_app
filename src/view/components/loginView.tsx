import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

import { useLoginViewModel } from "@/src/viewmodel/useLoginViewModel";

export default function LoginView() {
  const vm = useLoginViewModel();

  return (
    <View style={styles.container}>

      <View style={styles.iconWrapper}>
        <MaterialIcons name="account-circle" size={110} color="#3F51B5" />
      </View>

      <Text style={styles.title}>Promotor{"\n"}app</Text>

      <TextInput
        label="Digite seu e-mail"
        placeholder="exemplo@gmail.com"
        value={vm.email}
        onChangeText={vm.setEmail}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Digite sua senha"
        placeholder="exemplo: scararobaruamakita123"
        value={vm.password}
        onChangeText={vm.setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.link}>Esqueceu sua senha?</Text>

      <Button
        mode="contained"
        onPress={vm.login}
        loading={vm.loading}
        style={styles.button}
        contentStyle={{ paddingVertical: 6 }}
      >
        Entrar
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
    alignItems: "center",
  },
  iconWrapper: {
    marginTop: 36,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#3F51B5",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    marginTop: 16,
  },
  link: {
    alignSelf: "flex-start",
    marginTop: 12,
    color: "#1B1B1F",
  },
  button: {
    width: "70%",
    marginTop: 24,
    borderRadius: 50,
  },
});
