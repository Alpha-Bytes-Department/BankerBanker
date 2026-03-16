"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType, User, AuthState, signup } from "@/types/auth";
import api from "./api";
import { useRouter, usePathname } from "next/navigation"; // added usePathname
import { toast } from "sonner";

// Public routes that don't need profile fetch
const PUBLIC_ROUTES = [
  "/register", "/signin", "/register/upload", "/verify_otp", "/reset_pass_one", "/reset_pass_one/reset_pass_two", "/reset_pass_one/reset_pass_two/reset_pass_three", "/reset_pass_one/reset_pass_two/reset_pass_three/reset_pass_four"
];

//------------ Auth Context ------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//------------ Auth Provider Component ------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    email: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [signUpData, setSignupData] = useState<signup | null>(null);
  const router = useRouter();
  const pathname = usePathname(); //  track current route

  /*----------------------------------------
            Signup Function 
  ----------------------------------------------*/
  const signup = async (userData: signup) => {
    setSignupData(userData);

    if (userData?.customer_type === "Lender" && userData?.media_files === undefined) {
      toast.info("Please upload media files to proceed.");
      router.push("/register/upload");
      return;
    }

    if (userData?.media_files?.length === 0) {
      toast.error("Please upload at least one media file.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (key !== "media_files") {
          formData.append(key, String(value));
        }
      });
      userData.media_files?.forEach((file: File) => {
        formData.append("media_files", file);
      });
      const res = await api.post("/api/accounts/signup/", formData);
      console.log("Signup response:", res);
      if (res.status === 201) {
        const newAuthState = {
          email: res.data.data.email,
          isAuthenticated: false,
        };
        setAuthState(newAuthState);
        localStorage.setItem("Authstate", JSON.stringify(newAuthState));
        toast.success("Successfully signed up! Please verify your email.");
        router.push('/verify_otp?from=signup');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
            Resend OTP Function 
  ----------------------------------------------*/
  const resendOtp = async (email: string) => {
    try {
      setLoading(true);
      if (email.length > 0) {
        const res = await api.post("/api/accounts/resend-otp/", {
          email: email.trim(),
        });
        if (res.status === 200) {
          const newAuthState = {
            email: email,
            isAuthenticated: false,
          };
          setAuthState(newAuthState);
          localStorage.setItem("Authstate", JSON.stringify(newAuthState));
          toast.success("OTP resent successfully!");
          router.push('/verify_otp?from=resendOtp');
        }
      } else {
        toast.error("Email is required to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false); // only in finally, removed duplicate on line 101
    }
  };

  /*----------------------------------------
            Forgot Password Function 
  ----------------------------------------------*/
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      const res = await api.post("/api/accounts/forgot-password/", {
        email: email.trim(),
      });
      if (res.status === 200) {
        const newAuthState = {
          email: email,
          isAuthenticated: false,
        };
        localStorage.setItem("Authstate", JSON.stringify(newAuthState));
        setAuthState(newAuthState);
        toast.success("OTP sent to your email successfully!");
        router.push("/reset_pass_one/reset_pass_two?from=forgotPassword");
      } else {
        toast.error("Failed to send password reset link. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Failed to process forgot password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
          Verify OTP Function 
  ----------------------------------------------*/
  const verifyOTP = async (otp: string, from: string) => {
    const AuthState = localStorage.getItem("Authstate");
    if (!AuthState) {
      toast.error("No pending signup found. Please sign up first.");
      router.push('/register');
      return;
    }

    //  guard against null email before sending to API
    const parsedState = JSON.parse(AuthState);
    const email = parsedState?.email;
    if (!email) {
      toast.error("Session expired. Please sign up again.");
      router.push('/register');
      return;
    }

    switch (from) {
      case "signup":
        try {
          setLoading(true);
          const res = await api.post("/api/accounts/verify-otp/", {
            email,
            otp_code: otp.trim(),
          });
          if (res.status === 200) {
            localStorage.removeItem("Authstate");
            toast.success("Email verified successfully! You can now log in.");
            router.push('/signin');
          }
        } catch (error) {
          console.error("Verify email error:", error);
          toast.error("Email verification failed. Please try again.");
        } finally {
          setLoading(false); //  break moved outside finally
        }
        break; //  break is now correctly outside finally

      case "forgotPassword":
        try {
          setLoading(true);
          const res = await api.post("/api/accounts/forgot-password/verify-otp/", {
            email,
            otp_code: otp.trim(),
          });
          if (res.status === 200) {
            localStorage.removeItem("Authstate");
            toast.success("OTP verified! Please set your new password.");
            router.push('/reset_pass_one/reset_pass_two/reset_pass_three/reset_pass_four');
          }
        } catch (error) {
          console.error("Verify email error:", error);
          toast.error("Email verification failed. Please try again.");
        } finally {
          setLoading(false); // break moved outside finally
        }
        break; // break is now correctly outside finally
    }
  };

  /*----------------------------------------
            Login Function 
  ----------------------------------------------*/
  const login = async (email: string, password: string, remember_me?: boolean) => {
    //  removed console.log with password
    try {
      setLoading(true);
      const res = await api.post("/api/accounts/login/", {
        email,
        password,
        remember_me,
      });
      if (res.status === 200) {
        const { user, access, refresh } = res.data.data;
        //  flat structure matches getTokensFromLocalStorage() in api.ts
        localStorage.setItem("userCredentials", JSON.stringify({
          access_token: access,
          refresh_token: refresh,
          user,
        }));
        setUser(user);
        toast.success("Logged in successfully!");
        // removed duplicate setLoading(false) here — finally handles it
        if (user?.role === "Sponsor") {
          router.push("/sponsor");
        } else {
          router.push("/lender");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
            Logout Function 
  ----------------------------------------------*/
  const logout = () => {
    localStorage.removeItem("userCredentials");
    setUser(null);
    toast.success("Logged out successfully!");
    router.push("/signin");
  };

  /*----------------------------------------
            Getting user data 
  ----------------------------------------------*/
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      // Skip profile fetch on public routes — this was causing the 401 loop
      const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));
      if (isPublicRoute) return;

      try {
        const userCredentials = localStorage.getItem("userCredentials");
        if (!userCredentials) return; // exit early if no credentials

        const res = await api.get("/api/accounts/profile/");
        if (res.status === 200) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, [pathname]); // re-run when route changes, not just on mount

  return (
    <AuthContext.Provider
      value={{
        user,
        authState,
        signUpData,
        loading,
        setSignupData,
        signup,
        verifyOTP,
        resendOtp,
        login,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*-----------------------------------------------
            exporting hook
  ----------------------------------------------*/
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};