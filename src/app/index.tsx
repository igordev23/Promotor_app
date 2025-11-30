import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { View, Image } from "react-native";
import { CheckCircle2 } from "lucide-react-native";

export default function Home() {
  const router = useRouter();

  return (
    <Box className="flex-1 bg-white justify-center items-center px-6">
     

      <Image
        source={require("@/assets/iconToDo-List.png")}
        className="w-28 h-28 mb-2"
        resizeMode="contain"
      />
   
      <Text className="text-3xl font-bold text-black mb-2">
        Bem-vindo!
      </Text>

   
      <Text className="text-base text-gray-500 mb-8 text-center">
        Gerencie suas tarefas de forma simples e prática.
      </Text>


      <Pressable
        onPress={() => router.replace("./listTaskScreen")}
        className="px-8 py-4 bg-blue-500 rounded-2xl shadow-lg active:opacity-80"
      >
        <Text className="text-white text-lg font-semibold">
          Ir para Lista de Tarefas
        </Text>
      </Pressable>
    </Box>
  );
}
