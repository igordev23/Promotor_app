// app/_layout.tsx
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { Slot } from "expo-router";


const theme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: "#3F51B5", background: "#F7F9FF" } };

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <Slot />
    </PaperProvider>
  );
}
