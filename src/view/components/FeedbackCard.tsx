import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { HStack } from "@/components/ui/hstack";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from "lucide-react-native";

type FeedbackType = "success" | "error" | "info" | "warning";

type FeedbackCardProps = {
  type: FeedbackType;
  title?: string;
  message: string;
  onClose?: () => void;
};

const typeConfig: Record<
  FeedbackType,
  {
    container: string;
    iconColor: string;
    textColor: string;
  }
> = {
  success: {
    container: "bg-green-50 border border-green-400",
    iconColor: "text-green-600",
    textColor: "text-green-700",
  },
  error: {
    container: "bg-red-50 border border-red-400",
    iconColor: "text-red-600",
    textColor: "text-red-700",
  },
  info: {
    container: "bg-blue-50 border border-blue-400",
    iconColor: "text-blue-600",
    textColor: "text-blue-700",
  },
  warning: {
    container: "bg-amber-50 border border-amber-400",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
  },
};

export function FeedbackCard({ type, title, message, onClose }: FeedbackCardProps) {
  const cfg = typeConfig[type];

  const Icon =
    type === "success"
      ? CheckCircle2
      : type === "error"
      ? AlertCircle
      : type === "warning"
      ? AlertTriangle
      : Info;

  return (
    <Box className={`rounded-2xl p-4 ${cfg.container}`}>
      <HStack className="items-start justify-between">
        <HStack className="items-center" space="sm">
          <Icon size={22} color={undefined} className={cfg.iconColor} />
          <Box>
            {title ? (
              <Text className={`font-bold ${cfg.textColor}`}>{title}</Text>
            ) : null}
            <Text className={`mt-1 ${cfg.textColor}`}>{message}</Text>
          </Box>
        </HStack>
        {onClose ? (
          <Pressable onPress={onClose} className="p-2 rounded-full">
            <X size={18} color={undefined} className="text-typography-700" />
          </Pressable>
        ) : null}
      </HStack>
    </Box>
  );
}

