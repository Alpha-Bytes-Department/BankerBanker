"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { AuthContextType, User, AuthState } from "@/types/auth";

//========== Auth Context ===========
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//========== Auth Provider Component ===========
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  //========== Initialize Auth State from Storage ===========
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const userFromLocalStorage = localStorage.getItem("user");
        const userFromSessionStorage = sessionStorage.getItem("user");
        const storedUser = userFromLocalStorage || userFromSessionStorage;

        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  //========== Signup Function ===========
  const signup = async (
    customer_type: "lender" | "sponsor",
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    password: string,
    confirm_password: string,
  ) => {
    try {
      
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  //========== Login Function ===========
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      //========== Temporary Mock Implementation ===========
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        email: email,
        name: email.split("@")[0],
        role: email.includes("lender") ? "lender" : "sponsor",
        companyName: email.includes("lender")
          ? "ABC Lending"
          : "XYZ Properties",
      };

      const storage = rememberMe ? localStorage : localStorage;
      storage.setItem("user", JSON.stringify(mockUser));
      storage.setItem("accessToken", "mock-access-token");
      storage.setItem("refreshToken", "mock-refresh-token");
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      //========== Set Cookies for Middleware ===========
      document.cookie = `accessToken=mock-access-token; path=/; SameSite=Lax`;
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(mockUser)
      )}; path=/; SameSite=Lax`;

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      //========== Redirect Based on Role ===========
      if (mockUser.role === "sponsor") {
        router.push("/sponsor");
      } else {
        router.push("/lender");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  //========== Logout Function ===========
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");

    //========== Clear Cookies ===========
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    router.push("/signin");
  };

  //========== Set User Function ===========
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

//========== Custom Hook to Use Auth Context ===========
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
