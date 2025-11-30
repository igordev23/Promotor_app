import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";  
import { useDashboardViewModel } from "../viewmodel/useDashboardViewModel";

const DashboardScreen: React.FC = () => {
  const { state } = useDashboardViewModel();

  return (
    <Box flex={1} bg="white" justifyContent="center" alignItems="center" p="4">
      <HStack space="4" alignItems="center">
        <Text fontSize="2xl" fontWeight="bold">
          {state.welcomeMessage}
        </Text>
      </HStack>
    </Box>
  );
};

export default DashboardScreen;
