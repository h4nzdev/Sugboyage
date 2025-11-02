import React, { useState } from "react";
import Home from "../screens/Main/Home/Home";
import AppNavigation from "./AppNavigation";
import { useAuth } from "../context/AuthenticationContext";
import AuthNavigation from "./AuthNavigation";

export default function Role() {
  const { user } = useAuth();

  if (user) return <AppNavigation />;
  if (!user) return <AuthNavigation />;

  return null;
}
