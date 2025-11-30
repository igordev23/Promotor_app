import React from "react";
import { Text, Center, VStack } from "gluestack-ui";
import { useDashboardViewModel } from "../viewmodel/useDashboardViewModel";

const DashboardScreen: React.FC = () => {
  const { state } = useDashboardViewModel();

  return (
    <Center flex={1} bg="white">
      <VStack space="4">
        <Text fontSize="2xl" fontWeight="bold">
          {state.welcomeMessage}
        </Text>
      </VStack>
    </Center>
  );
};

export default DashboardScreen;
