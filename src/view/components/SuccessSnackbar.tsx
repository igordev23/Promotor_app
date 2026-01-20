import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

type SuccessFeedbackCardProps = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
  duration?: number;
};

export function SuccessFeedbackCard({
  visible,
  message,
  onDismiss,
  duration = 2000,
}: SuccessFeedbackCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />

      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <MaterialIcons
          name="check-circle"
          size={72}
          color="#4CAF50"
        />

        <Text style={styles.title}>Sucesso!</Text>

        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  card: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    color: "#2E7D32",
  },

  message: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
