// app/_layout.tsx
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import supabase from "../config/supabase";
import { JourneyProvider } from "../contexts/JourneyContext";
import { AuthProvider } from "../contexts/AuthContext";


const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#3F51B5",
    background: "#F7F9FF",
  },
};

export default function RootLayout() {
  

  

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <JourneyProvider>
          <Slot />
        </JourneyProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
