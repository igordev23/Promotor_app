import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/pressable";
import { FlatList } from "react-native";
import { useListLeadsViewModel } from "../viewmodel/useListLeadsViewModel";

const ListLeadsScreen: React.FC = () => {
  const { state } = useListLeadsViewModel();

  return (
    <Box flex={1} bg="white" justifyContent="center" alignItems="center" p="4">
      {state.isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={state.leads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HStack space="2" p="4" borderBottomWidth="1" borderColor="gray.200">
              <Text fontSize="lg" fontWeight="bold">
                {item.name}
              </Text>
              <Text>{item.email}</Text>
            </HStack>
          )}
        />
      )}
    </Box>
  );
};

export default ListLeadsScreen;
