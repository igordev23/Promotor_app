// config/deepLinks.ts
import * as Linking from "expo-linking";

export const DEEP_LINKS = {
  // REMOVA: "http://localhost:8081/resetPasswordScreen"
  // USE ISTO:
  resetPassword: Linking.createURL("resetPasswordScreen"),
};