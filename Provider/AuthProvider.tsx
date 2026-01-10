"use client";

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextType, User, AuthState, signup } from "@/types/auth";
import api from "./api";
import { useRouter } from "next/navigation";

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
  const [signUpData, setSignupData] = useState<signup | null>(null);
  const router = useRouter();

  //------------ Initialize Auth State from Storage ------------


  //------------------- Signup Function ------------------------
  const signup = async (userData: signup) => {
    setSignupData(userData);

    console.log("Signup Data in AuthProvider:", userData);
    // checking user type and redirecting accordingly 
    if (userData?.customer_type === "Lender" && userData?.media_files === undefined) {
      router.push("/register/upload");
      return;
    }

    if (userData?.media_files?.length === 0) {
      throw new Error("Please upload at least one media file for Lender type.");
    }

    try {
      const formData = new FormData();

      // append normal fields
      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "media_files") {
          formData.append(key, String(value));
        }
      });

      // append files
      userData.media_files?.forEach((file: File) => {
        formData.append("media_files", file);
      });

      const res = await api.post("/api/accounts/signup/", formData);
      if(res.status === 201) {
        router.push('/signin/verify_email');
      }
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
        signUpData,
        setSignupData,
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
