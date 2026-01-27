import React, { FC, ReactNode } from "react";
import { Alert, TouchableOpacity } from "react-native";

interface IConfirmDeleteProps {
  message: string;
  onConfirm: () => Promise<void> | void;
  trigger: ReactNode; // Pode ser qualquer coisa clicável
}

/**
 * Componente para confirmação de ação de exclusão
 * Exibe um Alert quando o usuário clica no trigger
 */
export const ConfirmDelete: FC<IConfirmDeleteProps> = ({ message, onConfirm, trigger }) => {
  const handlePress = () => {
    Alert.alert("Confirmar", message, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await onConfirm();
          } catch (err: unknown) {
            Alert.alert("Erro", (err as Error)?.message || "Erro ao executar ação");
          }
        },
      },
    ]);
  };

  return <TouchableOpacity onPress={handlePress}>{trigger}</TouchableOpacity>;
};
