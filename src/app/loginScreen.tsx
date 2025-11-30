import React from "react";
import { Button, Input, VStack, Text, Center } from "gluestack-ui";
import { useLoginViewModel } from "../viewmodel/useLoginViewModel";

const LoginView: React.FC = () => {
  const { state, actions } = useLoginViewModel();

  return (
    <Center flex={1} bg="white">
      <VStack space="4" w="80%">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          Bem-vindo ao Promotor App
        </Text>

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
          isLoading={state.isLoading}
          onPress={actions.login}
          bg="blue.500"
          _text={{ color: "white" }}
        >
          Entrar
        </Button>
      </VStack>
    </Center>
  );
};

export default LoginView;
