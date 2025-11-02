import { View, Text } from "react-native";
import React from "react";
import Role from "./navigation/Role";
import { AuthProvider } from "./context/AuthenticationContext";

export default function App() {
  return (
    <AuthProvider>
      <Role />
    </AuthProvider>
  );
}
