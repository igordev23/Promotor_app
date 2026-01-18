// app/_layout.tsx
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import supabase from "../config/supabase";

const theme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: "#3F51B5", background: "#F7F9FF" } };

export default function RootLayout() {
  const router = useRouter();
  const [isBootstrapped, setIsBootstrapped] = useState(false);

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      // 1. Normaliza a URL (Supabase envia tokens após o #)
      const normalizedUrl = url.replace("#", "?");
      const { queryParams } = Linking.parse(normalizedUrl);

      const access_token = queryParams?.access_token as string | undefined;
      const refresh_token = queryParams?.refresh_token as string | undefined;
      const type = queryParams?.type;

      // 2. Se for recuperação, estabelece a sessão ANTES de mudar de tela
      if (type === "recovery" && access_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token: refresh_token || "",
        });

        if (!error) {
          setIsBootstrapped(true);
          // Pequeno timeout para garantir que o estado da sessão foi injetado
          setTimeout(() => router.replace("/resetPasswordScreen"), 100);
          return;
        }
      }

      setIsBootstrapped(true);
    };

    // Captura link se o app estava fechado
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
      else setIsBootstrapped(true);
    });

    // Captura link se o app estava em background
    const sub = Linking.addEventListener("url", (event) => handleDeepLink(event.url));

    return () => sub.remove();
  }, []);

  if (!isBootstrapped) return null;

  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}