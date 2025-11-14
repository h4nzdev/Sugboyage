import { createContext, useState, useEffect } from "react";
import { AuthenticationService } from "../services/authenticationService";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true to prevent flashing
  const [error, setError] = useState(null);

  // Check if user is logged in on app start
  useEffect(() => {
    const currentUser = AuthenticationService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false); // Finish loading after check
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    const result = await AuthenticationService.login(credentials);

    if (result.success) {
      setUser(result.user);
      AuthenticationService.saveUserToLocalStorage(result.user);
    } else {
      setError(result.message);
    }

    setLoading(false);
    return result;
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    const result = await AuthenticationService.register(userData);

    if (result.success) {
      setUser(result.user);
      AuthenticationService.saveUserToLocalStorage(result.user);
    } else {
      setError(result.message);
    }

    setLoading(false);
    return result;
  };

  const logout = () => {
    setUser(null);
    setError(null);
    AuthenticationService.removeUserFromLocalStorage();
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
