// contexts/AuthContext.js
import React, { createContext, useState, useContext } from "react";

const AuthenticationContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(true);

  return (
    <AuthenticationContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
