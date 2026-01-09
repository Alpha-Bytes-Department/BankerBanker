"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextType, User, AuthState } from "@/types/auth";
import api from "./api";

//------------ Auth Context ------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//------------ Auth Provider Component ------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  //------------ Initialize Auth State from Storage ------------


  //------------ Signup Function ------------
  const signup = async (userData: ) => {
    try {
      const res = await api.post("/api/accounts/signup/", {});
      console.log(res.data);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  //------------ Login Function ------------
  const login = async () => {
  };

  //------------ Logout Function ------------
  const logout = () => {

  };

  //------------ Set User Function ------------
  const setUser = (user: User | null) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isAuthenticated: !!user,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signup,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//------------ Custom Hook to Use Auth Context ------------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
