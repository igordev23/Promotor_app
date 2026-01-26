// src/view/components/EditView.tsx
import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLeadEditForm } from "@/src/viewmodel/useLeadEditViewModel";
import { SuccessFeedbackCard } from "../components/SuccessSnackbar";

// Tipos para as propriedades do componente
interface EditViewProps { }

// Tipo para os parâmetros de rota
interface RouteParams {
  id?: string;
  nome?: string;
  cpf?: string;
  telefone?: string;
}

// Tipo para os estilos
interface EditViewStyles {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  card: ViewStyle;
  input: ViewStyle;
  saveBtn: ViewStyle;
  errorText: TextStyle;
  loadingContainer: ViewStyle;
  formContainer: ViewStyle;
  errorContainer: ViewStyle;
}

// Constantes
const VALIDATION_MESSAGES = {
  UPDATE_SUCCESS: "Lead atualizado com sucesso!",
  UPDATE_ERROR: "Erro ao atualizar lead.",
} as const;

export default function EditView(_props: EditViewProps): React.ReactElement {
  const router = useRouter();
  const params = useLocalSearchParams() as RouteParams;
  
  const {
    formData,
    handleFieldChange,
    initializeWithFormatting,
    loading,
    error,
    success,
    fieldErrors,
    editLead,
    clearError,
    clearFieldErrors,
    clearSuccess,
  } = useLeadEditForm();

  // Inicializa os dados do formulário com os parâmetros da rota
  useEffect(() => {
    if (params.id) {
      initializeWithFormatting({
        id: params.id,
        nome: params.nome,
        cpf: params.cpf,
        telefone: params.telefone,
      });
    }
  }, [params.id, params.nome, params.cpf, params.telefone, initializeWithFormatting]);

  // Handler para salvar lead
  const handleSave = useCallback(async (): Promise<void> => {
    if (!params.id) {
      return;
    }

    clearError();
    clearFieldErrors();

    try {
      await editLead({
        id: params.id,
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
      });

      // Sucesso é gerenciado pelo view model
      // Navega após 1.5 segundos
      setTimeout(() => {
        router.replace("/ListLeadsScreen");
      }, 1500);

    } catch (error: unknown) {
      // Erro já é tratado pelo view model
      console.error("Erro ao salvar lead:", error);
    }
  }, [
    params.id,
    formData.nome,
    formData.cpf,
    formData.telefone,
    editLead,
    router,
    clearError,
    clearFieldErrors,
  ]);

  // Handler para voltar
  const handleGoBack = useCallback((): void => {
    router.replace("/ListLeadsScreen");
  }, [router]);

  // Renderização de campo com erro
  const renderFieldWithError = (
    label: string,
    value: string,
    field: keyof typeof fieldErrors,
    keyboardType: "default" | "numeric" | "phone-pad" = "default",
    additionalProps: Partial<React.ComponentProps<typeof TextInput>> = {}
  ): React.ReactElement => (
    <View style={styles.formContainer}>
      <TextInput
        label={label}
        value={value}
        onChangeText={(text) => handleFieldChange(field, text)}
        mode="outlined"
        keyboardType={keyboardType}
        error={!!fieldErrors[field]}
        style={styles.input}
        editable={!loading}
        accessibilityLabel={label}
        accessibilityRole="text"
        {...additionalProps}
      />
      {fieldErrors[field] && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {fieldErrors[field]}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={26}
          color="#3F51B5"
          onPress={handleGoBack}
          accessibilityLabel="Voltar para lista de leads"
          accessibilityRole="button"
          disabled={loading}
        />
        <Text style={styles.headerTitle}>Editar Lead</Text>
      </View>

      {/* Erro geral */}
      {error && !Object.keys(fieldErrors).length && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} accessibilityRole="alert">
            {error}
          </Text>
        </View>
      )}

      {/* Formulário */}
      <View style={styles.card}>
        {/* Campo Nome */}
        {renderFieldWithError(
          "Nome completo",
          formData.nome,
          "nome",
          "default",
          { 
            autoCapitalize: "words",
            autoCorrect: false,
          }
        )}

        {/* Campo Telefone */}
        {renderFieldWithError(
          "Telefone",
          formData.telefone,
          "telefone",
          "phone-pad",
          {
            maxLength: 15, // (00) 00000-0000
          }
        )}

        {/* Campo CPF */}
        {renderFieldWithError(
          "CPF",
          formData.cpf,
          "cpf",
          "numeric",
          {
            maxLength: 14, // 000.000.000-00
          }
        )}

        {/* Botão Salvar ou Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#3F51B5"
              accessibilityLabel="Salvando alterações"
            />
          </View>
        ) : (
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.saveBtn}
            disabled={loading}
            accessibilityLabel="Salvar alterações do lead"
            accessibilityRole="button"
          >
            Salvar
          </Button>
        )}
      </View>

      {/* Feedback de Sucesso */}
      <SuccessFeedbackCard
        visible={success}
        onDismiss={clearSuccess}
        message={VALIDATION_MESSAGES.UPDATE_SUCCESS}
        duration={1500}
        onDismissComplete={() => {
          // Navega automaticamente após fechar o feedback
          router.replace("/ListLeadsScreen");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create<EditViewStyles>({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FF",
    padding: 24,
    paddingTop: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B1B1F",
    flex: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E2E6",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    backgroundColor: "#FAFAFA",
    marginBottom: 4,
  },
  saveBtn: {
    marginTop: 24,
    borderRadius: 50,
    paddingVertical: 8,
    backgroundColor: "#3F51B5",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 8,
  },
  loadingContainer: {
    marginTop: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  formContainer: {
    marginBottom: 8,
  },
});