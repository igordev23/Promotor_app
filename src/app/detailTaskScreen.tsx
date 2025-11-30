import { useRouter, useLocalSearchParams } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { TextInput } from "react-native";
import { useDetailTaskViewModel } from "../viewmodel/useDetailTaskViewModel";
import { useEffect, useState } from "react";
import { FeedbackCard } from "../view/components/FeedbackCard";



export default function DetailTaskScreen() {
  const router = useRouter();
  const { index } = useLocalSearchParams();
  const { state, actions } = useDetailTaskViewModel(null);

  const { task, loading, error } = state;
  const { loadTask, updateTask, deleteTask } = actions;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Mensagem dinâmica
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (index !== undefined) {
      loadTask(Number(index));
    }
  }, [index]);

  useEffect(() => {
    if (task) {
      setTitle(task.titulo ?? "");
      setDescription(task.descricao ?? "");
    }
  }, [task]);

  const showFeedback = (type: any, message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleUpdateTask = async () => {
    if (task && index !== undefined) {
      const updatedTask = {
        ...task,
        titulo: title,
        descricao: description,
      };
      const success = await updateTask(Number(index), updatedTask);
      if (success) {
        showFeedback("success", "Tarefa atualizada com sucesso!");
      } else {
        showFeedback("error", "Erro ao atualizar tarefa.");
      }
    }
  };

  const handleDeleteTask = async () => {
    if (index !== undefined) {
      const success = await deleteTask(Number(index));
      if (success) {
        showFeedback("success", "Tarefa deletada com sucesso!");
        setTimeout(() => router.replace("./listTaskScreen"), 3500);
      } else {
        showFeedback("error", "Erro ao deletar tarefa.");
      }
    }
  };

  return (
    <Box className="flex-1 bg-white p-4">
      {/* Header */}
      <Box className="py-4 px-6 bg-primary-500">
        <Text className="text-white text-lg font-bold">Detalhes da Tarefa</Text>
      </Box>

      {/* FEEDBACK CARD */}
      {feedback && (
        <Box className="mt-4">
          <FeedbackCard
            type={feedback.type}
            message={feedback.message}
            onClose={() => setFeedback(null)}
          />
        </Box>
      )}

      {/* Conteúdo principal */}
      <Box className="mt-4 p-4 bg-gray-100 rounded-lg shadow">
        {loading ? (
          <Text className="text-center text-gray-500">Carregando...</Text>
        ) : error ? (
          <FeedbackCard type="error" message={error} />
        ) : task ? (
          <>
            <Text className="text-black font-medium mb-2">Título</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Digite o título da tarefa"
              className="p-4 bg-gray-100 rounded-lg shadow mb-4"
            />

            <Text className="text-black font-medium mb-2">Descrição</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Digite a descrição da tarefa"
              className="p-4 bg-gray-100 rounded-lg shadow"
            />

            <Text className="text-gray-600 text-sm mt-4">
              TimeStamp: {new Date(task.timeStamp ?? 0).toLocaleString()}
            </Text>
          </>
        ) : (
          <FeedbackCard type="info" message="Nenhuma tarefa encontrada." />
        )}
      </Box>

      {/* Botões */}
      <Box className="mt-4 space-y-4">
        <Pressable
          onPress={handleUpdateTask}
          disabled={loading || !task}
          className={`px-6 py-3 rounded-xl shadow-lg ${
            loading || !task ? "bg-gray-400" : "bg-blue-500"
          }`}
        >
          <Text className="text-white font-bold">
            {loading ? "Atualizando..." : "Atualizar Tarefa"}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteTask}
          disabled={loading || !task}
          className={`px-6 py-3 rounded-xl shadow-lg ${
            loading || !task ? "bg-gray-400" : "bg-red-500"
          }`}
        >
          <Text className="text-white font-bold">
            {loading ? "Deletando..." : "Deletar Tarefa"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("./listTaskScreen")}
          className="px-6 py-3 bg-primary-500 rounded-xl shadow-lg"
        >
          <Text className="text-white font-bold">Voltar para Lista</Text>
        </Pressable>
      </Box>
    </Box>
  );
}
