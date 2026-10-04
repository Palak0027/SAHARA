import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { http } from "../services/api/http";

export type UserRole =
  | "donor"
  | "receiver"
  | "admin"
  | "volunteer";

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;

  role?: UserRole;
  roles?: UserRole[];
  activeRole?: UserRole;

  receiverType?: string;

  location?: {
    city?: string;
    address?: string;
  };

  organization?: {
    orgName?: string;
  };

  onBehalfOf?: string;

  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  email?: string;
  password: string;

  // Volunteer is now publicly registerable
  intent: "donor" | "receiver" | "volunteer";

  location: {
    city: string;
    address: string;
  };

  receiverType?: string;

  onBehalfOf?: string;

  organization?: {
    orgName?: string;
  };
}

interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

interface ProfileResponse {
  success: boolean;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;

  loading: boolean;

  login: (
    identifier: string,
    password: string
  ) => Promise<User>;

  register: (
    data: RegisterData
  ) => Promise<User>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  // --------------------------------
  // Restore saved user
  // --------------------------------

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  // --------------------------------
  // Restore saved token
  // --------------------------------

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const [loading, setLoading] =
    useState<boolean>(true);

  // --------------------------------
  // Save authentication
  // --------------------------------

  const saveAuth = (
    authToken: string,
    authUser: User
  ) => {
    localStorage.setItem(
      "token",
      authToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(authUser)
    );

    setToken(authToken);
    setUser(authUser);
  };

  // --------------------------------
  // LOGIN
  // --------------------------------

  const login = async (
    identifier: string,
    password: string
  ): Promise<User> => {
    setLoading(true);

    try {
      const response =
        await http.post<AuthResponse>(
          "/api/auth/login",
          {
            identifier,
            password,
          }
        );

      saveAuth(
        response.token,
        response.user
      );

      return response.user;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // REGISTER
  // --------------------------------

  const register = async (
    data: RegisterData
  ): Promise<User> => {
    setLoading(true);

    try {
      const response =
        await http.post<AuthResponse>(
          "/api/auth/register",
          data
        );

      saveAuth(
        response.token,
        response.user
      );

      return response.user;
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // LOGOUT
  // --------------------------------

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // --------------------------------
  // RESTORE SESSION
  // --------------------------------

  useEffect(() => {
    const existingToken =
      localStorage.getItem("token");

    if (!existingToken) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response =
          await http.get<ProfileResponse>(
            "/api/auth/profile"
          );

        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        setUser(response.user);
        setToken(existingToken);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // --------------------------------
  // PROVIDER
  // --------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        isAuthenticated:
          Boolean(token && user),

        loading,

        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// --------------------------------
// useAuth Hook
// --------------------------------

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}