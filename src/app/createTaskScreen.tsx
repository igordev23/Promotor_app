import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { TextInput } from "react-native";
import { useCreateTaskViewModel } from "../viewmodel/useCreateTaskViewModel";
import { useState } from "react";
import { Task } from "../model/entities/Task";
import { FeedbackCard } from "../view/components/FeedbackCard";

export default function CreateTaskScreen() {
  const router = useRouter();

  const { state, actions } = useCreateTaskViewModel({
    id: "",
    titulo: "",
    descricao: "",
    timeStamp: Date.now(),
  });

  const { loading, error } = state;
  const { createTask } = actions;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveTask = async () => {
    const newTask: Task = {
      id: `${Date.now()}`,
      titulo: title,
      descricao: description,
      timeStamp: Date.now(),
    };

    const success = await createTask(newTask);
    if (success) {
      setSuccessMessage("Tarefa criada com sucesso!");
      setTimeout(() => {
        setSuccessMessage(null);
        router.back();
      }, 1500);
    }
  };

  return (
    <Box className="flex-1 bg-white p-4">
      {/* Header */}
      <Box className="py-4 px-6 bg-primary-500">
        <Text className="text-white text-lg font-bold">Criar Nova Tarefa</Text>
      </Box>

      {error ? (
        <Box className="mt-4">
          <FeedbackCard
            type="error"
            title="Erro"
            message={error}
            onClose={() => {}}
          />
        </Box>
      ) : null}

      {successMessage ? (
        <Box className="mt-4">
          <FeedbackCard
            type="success"
            title="Sucesso"
            message={successMessage}
            onClose={() => setSuccessMessage(null)}
          />
        </Box>
      ) : null}

      {/* Form */}
      <Box className="mt-4">
        <Text className="text-black font-medium mb-2">Título</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Digite o título da tarefa"
          className="p-4 bg-gray-100 rounded-lg shadow"
        />

        <Text className="text-black font-medium mt-4 mb-2">Descrição</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Digite a descrição da tarefa"
          className="p-4 bg-gray-100 rounded-lg shadow"
        />

        {error && <Text className="text-red-500 mt-2">{error}</Text>}
      </Box>

      {/* Save button */}
      <Pressable
        onPress={handleSaveTask}
        disabled={loading}
        className={`mt-4 px-6 py-3 rounded-xl shadow-lg ${
          loading ? "bg-gray-400" : "bg-primary-500"
        }`}
      >
        <Text className="text-white font-bold">
          {loading ? "Salvando..." : "Salvar Tarefa"}
        </Text>
      </Pressable>
    </Box>
  );
}
