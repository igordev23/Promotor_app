// src/view/components/EditView.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  Alert
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLeadEditViewModel } from "@/src/viewmodel/useLeadEditViewModel";
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

// Tipo para erros de campo
interface FieldErrors {
  nome?: string;
  cpf?: string;
  telefone?: string;
}

// Tipo para os dados do formulário
interface LeadFormData {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
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
}

// Constantes para validação
const VALIDATION_MESSAGES = {
  NOME_REQUIRED: "Nome é obrigatório",
  CPF_INVALID: "CPF inválido",
  TELEFONE_INVALID: "Telefone inválido",
  UPDATE_SUCCESS: "Lead atualizado com sucesso!",
  UPDATE_ERROR: "Erro ao atualizar lead. Verifique os dados.",
} as const;

// Funções utilitárias para formatação
const formatCPF = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{1})(\d{4})(\d{4})$/, "$1 $2-$3");
};

// Função para extrair apenas dígitos
const extractDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};

export default function EditView(_props: EditViewProps): React.ReactElement {
  const { state, actions } = useLeadEditViewModel();
  const router = useRouter();
  const params = useLocalSearchParams() as RouteParams;

  const [formData, setFormData] = useState<Omit<LeadFormData, "id">>({
    nome: "",
    cpf: "",
    telefone: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [successVisible, setSuccessVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Data e hora atual formatada
  const currentDateTime = useMemo(
    () => new Date().toLocaleString("pt-BR"),
    []
  );

  // Inicializa os dados do formulário com os parâmetros da rota
  useEffect(() => {
    const initializeFormData = () => {
      const updatedFormData = { ...formData };

      if (params.nome) updatedFormData.nome = String(params.nome);
      if (params.cpf) updatedFormData.cpf = formatCPF(String(params.cpf));
      if (params.telefone) updatedFormData.telefone = formatPhone(String(params.telefone));

      setFormData(updatedFormData);
    };

    initializeFormData();
  }, []);

  // Validação do formulário
  const validateForm = useCallback((): boolean => {
    const errors: FieldErrors = {};
    let isValid = true;

    // Validação do nome
    if (!formData.nome.trim()) {
      errors.nome = VALIDATION_MESSAGES.NOME_REQUIRED;
      isValid = false;
    }

    // Validação do CPF
    const cpfDigits = extractDigits(formData.cpf);
    if (cpfDigits.length !== 11) {
      errors.cpf = VALIDATION_MESSAGES.CPF_INVALID;
      isValid = false;
    }

    // Validação do telefone
    const phoneDigits = extractDigits(formData.telefone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      errors.telefone = VALIDATION_MESSAGES.TELEFONE_INVALID;
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  }, [formData]);

  // Handler para salvar lead
  const handleSave = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    if (!params.id) {
      Alert.alert("Erro", "ID do lead não encontrado");
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const leadData: LeadFormData = {
        id: params.id,
        nome: formData.nome.trim(),
        cpf: extractDigits(formData.cpf),
        telefone: extractDigits(formData.telefone),
      };

      await actions.editLead(leadData);

      // Mostra feedback de sucesso
      setSuccessVisible(true);

      // Navega após 1.5 segundos
      setTimeout(() => {
        router.replace("/ListLeadsScreen");
      }, 1500);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message.toLowerCase()
        : "Erro desconhecido";

      const errors: FieldErrors = {};

      if (errorMessage.includes("nome")) {
        errors.nome = errorMessage;
      }
      if (errorMessage.includes("cpf")) {
        errors.cpf = errorMessage;
      }
      if (errorMessage.includes("telefone")) {
        errors.telefone = errorMessage;
      }

      setFieldErrors(errors);

      Alert.alert("Erro", VALIDATION_MESSAGES.UPDATE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, params.id, validateForm, actions.editLead, router]);

  // Handlers para atualizar campos
  const handleNomeChange = useCallback((text: string): void => {
    setFormData(prev => ({ ...prev, nome: text }));
    setFieldErrors(prev => ({ ...prev, nome: undefined }));
  }, []);

  const handleCpfChange = useCallback((text: string): void => {
    setFormData(prev => ({ ...prev, cpf: formatCPF(text) }));
    setFieldErrors(prev => ({ ...prev, cpf: undefined }));
  }, []);

  const handleTelefoneChange = useCallback((text: string): void => {
    setFormData(prev => ({ ...prev, telefone: formatPhone(text) }));
    setFieldErrors(prev => ({ ...prev, telefone: undefined }));
  }, []);

  // Handler para voltar
  const handleGoBack = useCallback((): void => {
    router.replace("/ListLeadsScreen");
  }, [router]);

  // Renderização de campo com erro
  const renderFieldWithError = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    error?: string,
    keyboardType: "default" | "numeric" | "phone-pad" = "default",
    additionalProps: Partial<React.ComponentProps<typeof TextInput>> = {}
  ): React.ReactElement => (
    <View style={styles.formContainer}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChange}
        mode="outlined"
        keyboardType={keyboardType}
        error={!!error}
        style={styles.input}
        editable={!isSubmitting}
        {...additionalProps}
      />
      {error && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
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
        />
        <Text style={styles.headerTitle}>Editar Lead</Text>
      </View>

      {/* Formulário */}
      <View style={styles.card}>
        {/* Campo Nome */}
        {renderFieldWithError(
          "Nome completo",
          formData.nome,
          handleNomeChange,
          fieldErrors.nome,
          "default",
          { autoCapitalize: "words" }
        )}

        {/* Campo Telefone */}
        {renderFieldWithError(
          "Telefone",
          formData.telefone,
          handleTelefoneChange,
          fieldErrors.telefone,
          "phone-pad"
        )}

        {/* Campo CPF */}
        {renderFieldWithError(
          "CPF",
          formData.cpf,
          handleCpfChange,
          fieldErrors.cpf,
          "numeric"
        )}

        {/* Botão Salvar ou Loading */}
        {isSubmitting || state.loading ? (
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
            disabled={isSubmitting}
            accessibilityLabel="Salvar alterações do lead"
            accessibilityRole="button"
          >
            Salvar
          </Button>
        )}
      </View>

      {/* Feedback de Sucesso */}
      <SuccessFeedbackCard
        visible={successVisible}
        onDismiss={() => setSuccessVisible(false)}
        message={VALIDATION_MESSAGES.UPDATE_SUCCESS}
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
    marginBottom: 32,
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
    marginBottom: 8,
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
    marginTop: -4,
    marginBottom: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    marginTop: 24,
    paddingVertical: 16,
  },
  formContainer: {
    marginBottom: 8,
  },
});