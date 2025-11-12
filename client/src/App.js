import { View, Text } from "react-native";
import React from "react";
import Role from "./navigation/Role";
import { AuthProvider } from "./context/AuthenticationContext";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationModal } from "./components/NotificationModal";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Role />
        <NotificationModal />
      </NotificationProvider>
    </AuthProvider>
  );
}
