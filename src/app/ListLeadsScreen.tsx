import React from "react";
import { FlatList, Text, Center, VStack, Spinner } from "gluestack-ui";
import { useListLeadsViewModel } from "../viewmodel/useListLeadsViewModel";

const ListLeadsScreen: React.FC = () => {
  const { state } = useListLeadsViewModel();

  return (
    <Center flex={1} bg="white">
      {state.isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          data={state.leads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <VStack space="2" p="4" borderBottomWidth="1" borderColor="gray.200">
              <Text fontSize="lg" fontWeight="bold">
                {item.name}
              </Text>
              <Text>{item.email}</Text>
            </VStack>
          )}
        />
      )}
    </Center>
  );
};

export default ListLeadsScreen;
