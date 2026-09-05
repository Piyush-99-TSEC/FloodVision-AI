import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../api/client";
import { AuthUser } from "../types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("floodvision_token"));
  const [loading, setLoading] = useState<boolean>(true);

  // Check JWT token validity on mount
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem("floodvision_token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem("floodvision_token");
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("floodvision_token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.success && response.data?.token && response.data?.user) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem("floodvision_token", newToken);
      setToken(newToken);
      setUser(userData);
    } else {
      throw new Error(response.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string, role: string = "viewer") => {
    const response = await authApi.register(name, email, password, role);
    if (response.success && response.data?.token && response.data?.user) {
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem("floodvision_token", newToken);
      setToken(newToken);
      setUser(userData);
    } else {
      throw new Error(response.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("floodvision_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
