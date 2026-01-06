import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function DashboardView() {

  const [journeys, setJourneys] = useState<{start:string, end?:string}[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [leadsToday] = useState(0);

  function handleJourney(){

    const now = new Date().toLocaleTimeString();

    // INICIAR
    if(!isActive){
      setJourneys(prev => [...prev, { start: now }]);
      setIsActive(true);
    }

    // ENCERRAR
    else{
      setJourneys(prev => {
        const last = prev[prev.length - 1];
        last.end = now;
        return [...prev];
      });

      setIsActive(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <MaterialIcons name="account-circle" size={28} color="#3F51B5" />
      </View>

      {/* Status */}
      <Text style={styles.status}>
        Status da Jornada {isActive ? "🟢" : "🔴"}
      </Text>

      {/* Botão Iniciar / Encerrar */}
      <Button
        mode="contained"
        style={styles.mainButton}
        onPress={handleJourney}
      >
        {isActive ? "Encerrar Jornada" : "Iniciar Jornada"}
      </Button>

      {/* Lista de horários */}
      {journeys.map((j, index) => (
        <Text key={index} style={styles.timeText}>
          {index+1} Início: {j.start}  {j.end ? `| Fim: ${j.end}` : ""}
        </Text>
      ))}

      {/* Cards */}
      <View style={styles.metricsRow}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metricValue}>{leadsToday}</Text>
            <Text>Leads Hoje</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.metricValue}>{journeys.length}</Text>
            <Text>Jornadas</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Registrar Leads */}
      <View style={styles.actionRow}>
        <MaterialIcons name="person-add" size={28} color="#fff" style={styles.iconBox}/>
        <Text
          style={styles.actionText}
          onPress={() => router.push("/RegisterScreen")}
        >
          Registrar Leads
        </Text>
      </View>

      {/* Listar Leads */}
      <View style={styles.actionRow}>
        <MaterialIcons name="list-alt" size={28} color="#fff" style={styles.iconBox}/>
        <Text
          style={styles.actionText}
          onPress={() => router.push("/ListLeadsScreen")}
        >
          Listar Leads
        </Text>
      </View>

      {/* Sair */}
      <Button
        mode="contained"
        style={styles.exitButton}
        onPress={() => router.replace("/loginScreen")}
      >
        Sair
      </Button>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{
    flexGrow:1,
    backgroundColor:"#F7F9FF",
    padding:24
  },
  header:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:16
  },
  headerTitle:{
    fontSize:20,
    color:"#1B1B1F"
  },
  status:{
    color:"#3F51B5",
    textAlign:"center",
    marginBottom:12,
    fontWeight:"600"
  },
  mainButton:{
    alignSelf:"center",
    borderRadius:50,
    marginBottom:16
  },
  timeText:{
    textAlign:"center",
    color:"#1B1B1F",
    marginBottom:6
  },
  metricsRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginVertical:24
  },
  card:{
    width:"47%",
    backgroundColor:"#E2E2E6",
    borderRadius:16
  },
  metricValue:{
    fontSize:18,
    fontWeight:"600"
  },
  actionRow:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:24
  },
  iconBox:{
    backgroundColor:"#3F51B5",
    padding:12,
    borderRadius:12,
    marginRight:12
  },
  actionText:{
    color:"#3F51B5",
    fontSize:16,
    fontWeight:"600"
  },
  exitButton:{
    marginTop:"auto",
    alignSelf:"center",
    borderRadius:50
  }
});
