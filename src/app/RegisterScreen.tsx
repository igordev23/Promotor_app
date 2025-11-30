import React from "react";
import { Button, Input, VStack, Text, Center } from "gluestack-ui";
import { useRegisterViewModel } from "../viewmodel/useLeadRegisterViewModel";

const RegisterScreen: React.FC = () => {
  const { state, actions } = useRegisterViewModel();

  return (
    <Center flex={1} bg="white">
      <VStack space="4" w="80%">
        <Input
          placeholder="Nome"
          value={state.name}
          onChangeText={actions.setName}
        />
        <Input
          placeholder="Email"
          value={state.email}
          onChangeText={actions.setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Senha"
          value={state.password}
          onChangeText={actions.setPassword}
          secureTextEntry
        />
        {state.error && (
          <Text color="red.500" textAlign="center">
            {state.error}
          </Text>
        )}
        <Button
          isLoading={state.isSubmitting}
          onPress={actions.register}
          bg="blue.500"
          _text={{ color: "white" }}
        >
          Registrar
        </Button>
      </VStack>
    </Center>
  );
};

export default RegisterScreen;
