import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import { useLeadRegisterViewModel } from "../viewmodel/useLeadRegisterViewModel";

const RegisterScreen: React.FC = () => {
  const { state, actions } = useLeadRegisterViewModel();

  return (
    <Box flex={1} bg="white" justifyContent="center" alignItems="center" p="4">
      <Box w="80%" bg="gray.100" p="4" borderRadius="md" shadow="2">
        <HStack space="4">
          <Box>
            <Text fontSize="md" mb="2">
              Nome
            </Text>
            <Box
              as="input"
              type="text"
              placeholder="Digite seu nome"
              value={state.name}
              onChange={(e) => actions.setName(e.target.value)}
              w="100%"
              p="2"
              borderWidth="1"
              borderColor="gray.300"
              borderRadius="md"
            />
          </Box>

          <Box>
            <Text fontSize="md" mb="2">
              Email
            </Text>
            <Box
              as="input"
              type="email"
              placeholder="Digite seu email"
              value={state.email}
              onChange={(e) => actions.setEmail(e.target.value)}
              w="100%"
              p="2"
              borderWidth="1"
              borderColor="gray.300"
              borderRadius="md"
            />
          </Box>

          <Box>
            <Text fontSize="md" mb="2">
              Senha
            </Text>
            <Box
              as="input"
              type="password"
              placeholder="Digite sua senha"
              value={state.password}
              onChange={(e) => actions.setPassword(e.target.value)}
              w="100%"
              p="2"
              borderWidth="1"
              borderColor="gray.300"
              borderRadius="md"
            />
          </Box>

          {state.error && (
            <Text color="red.500" textAlign="center">
              {state.error}
            </Text>
          )}

          <Pressable
            bg="blue.500"
            p="3"
            borderRadius="md"
            alignItems="center"
            justifyContent="center"
            _hover={{ bg: "blue.600" }}
            _pressed={{ bg: "blue.700" }}
            onPress={actions.register}
          >
            <Text color="white" fontWeight="bold">
              Registrar
            </Text>
          </Pressable>
        </HStack>
      </Box>
    </Box>
  );
};

export default RegisterScreen;
