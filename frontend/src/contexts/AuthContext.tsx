import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getToken, getEmail, setToken, setEmail, removeToken, removeEmail, authApi, LoginRequest, SignupRequest } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmailState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getToken();
    const storedEmail = getEmail();
    if (token && storedEmail) {
      setIsAuthenticated(true);
      setEmailState(storedEmail);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authApi.login(data);
    setToken(response.token);
    setEmail(response.email);
    setIsAuthenticated(true);
    setEmailState(response.email);
  };

  const signup = async (data: SignupRequest) => {
    const response = await authApi.signup(data);
    setToken(response.token);
    setEmail(response.email);
    setIsAuthenticated(true);
    setEmailState(response.email);
  };

  const logout = () => {
    removeToken();
    removeEmail();
    setIsAuthenticated(false);
    setEmailState(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
