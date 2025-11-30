import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";

import { HStack } from "@/components/ui/hstack";

const LoginScreen: React.FC = () => {
  return (
    <Box flex={1} bg="white" justifyContent="center" alignItems="center" p="4">
      <Box w="80%" bg="gray.100" p="4" borderRadius="md" shadow="2">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb="4">
          Bem-vindo ao Promotor App
        </Text>

        <Box mb="4">
          <Text fontSize="md" mb="2">
            Email
          </Text>
          <Box
            as="input"
            type="email"
            placeholder="Digite seu email"
            w="100%"
            p="2"
            borderWidth="1"
            borderColor="gray.300"
            borderRadius="md"
          />
        </Box>

        <Box mb="4">
          <Text fontSize="md" mb="2">
            Senha
          </Text>
          <Box
            as="input"
            type="password"
            placeholder="Digite sua senha"
            w="100%"
            p="2"
            borderWidth="1"
            borderColor="gray.300"
            borderRadius="md"
          />
        </Box>

        <Pressable
          bg="blue.500"
          p="3"
          borderRadius="md"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: "blue.600" }}
          _pressed={{ bg: "blue.700" }}
        >
          <Text color="white" fontWeight="bold">
            Entrar
          </Text>
        </Pressable>

        <HStack justifyContent="center" mt="4">
          <Text fontSize="sm">Não tem uma conta?</Text>
          <Pressable onPress={() => alert("Navegar para registro")}>
            <Text fontSize="sm" color="blue.500" ml="1">
              Registre-se
            </Text>
          </Pressable>
        </HStack>
      </Box>
    </Box>
  );
};

export default LoginScreen;
