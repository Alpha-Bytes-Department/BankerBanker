"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthContextType, User, AuthState, signup } from "@/types/auth";
import api from "./api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


//------------ Auth Context ------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//------------ Auth Provider Component ------------
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    email: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [signUpData, setSignupData] = useState<signup | null>(null);
  const router = useRouter();

  //------------ Initialize Auth State from Storage ------------


  /*----------------------------------------
            Signup Function 
  ----------------------------------------------*/
  const signup = async (userData: signup) => {

    setSignupData(userData);

    // checking user type and redirecting accordingly 
    if (userData?.customer_type === "Lender" && userData?.media_files === undefined) {
      toast.info("Please upload media files to proceed.");
      router.push("/register/upload");
      return;
    }

    // validating media files
    if (userData?.media_files?.length === 0) {
      toast.error("Please upload at least one media file.");
      return;
    }

    // proceeding with signup
    try {
      setLoading(true);
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
      // on successful signup
      if (res.status === 201) {
        const newAuthState = {
          email: res.data.data.email,
          isAuthenticated: false,
        };
        setAuthState(newAuthState);
        setLoading(false);
        localStorage.setItem("Authstate", JSON.stringify(newAuthState));
        toast.success("Successfully signed up! Please verify your email.");
        router.push('/signin/verify_email');
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  /*----------------------------------------
            Verify OTP Function 
  ----------------------------------------------*/
  const verifyOTP = async (otp: string) => {
    const AuthState = localStorage.getItem("Authstate");
    if (!AuthState) {
      toast.error("No pending signup found. Please sign up first.");
      router.push('/register');
      return;
    }
    const email = JSON.parse(AuthState).email;
    console.log("email and otp", email, otp);
    // verifying otp
    try {
      setLoading(true);
      const res = await api.post("/api/accounts/verify-otp/", {
        email: email,
        otp_code: otp.trim(),
      });
      if (res.status === 200) {
        setLoading(false);
        localStorage.removeItem("Authstate");
        toast.success("Email verified successfully! You can now log in.");
        router.push('/signin');
      }
    } catch (error) {
      console.error("Verify email error:", error);
      toast.error("Email verification failed. Please try again.");
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
          setLoading(false);
          localStorage.setItem("Authstate", JSON.stringify(newAuthState));
          toast.success("OTP resend successfull");
          router.push('/signin/verify_email');
        }
      } else {
        toast.error("Email is required to resend OTP.");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
            Login Function 
  ----------------------------------------------*/
  const login = async (email: string, password: string, remember_me?: boolean) => {
    console.log("checking", email, password, remember_me);
    try {
      setLoading(true);
      const res = await api.post("/api/accounts/login/", {
        email,
        password,
        remember_me,
      });
      if (res.status === 200) {
        const { user, access, refresh } = res.data.data;
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        setUser(user);
        toast.success("Logged in successfully!");
        setLoading(false);
        if (user?.customer_type === "Sponsor") {
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
            Forgot Password Function 
  ----------------------------------------------*/
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      console.log(email);
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
        toast.success("otp sent to your email successfully!");
        router.push("/reset_pass_one/reset_pass_two");
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
          Verify OTP after forgot Function 


 Note: this is need to change from backend and make one function for verifyOtp
----------------------------------------------*/
  const verifyForgotOTP = async (otp: string) => {
    const AuthState = localStorage.getItem("Authstate");
    if (!AuthState) {
      toast.error("No pending signup found. Please sign up first.");
      router.push('/register');
      return;
    }
    const email = JSON.parse(AuthState).email;
    console.log("email and otp", email, otp);
    // verifying otp
    try {
      setLoading(true);
      const res = await api.post("/api/accounts/forgot-password/verify-otp/", {
        email: email,
        otp_code: otp.trim(),
      });
      if (res.status === 200) {
        setLoading(false);
        localStorage.removeItem("Authstate");
        toast.success("Email verified successfully! You can now log in.");
        router.push('/signin');
      }
    } catch (error) {
      console.error("Verify email error:", error);
      toast.error("Email verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
            Logout Function 
  ----------------------------------------------*/
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    toast.success("Logged out successfully!");
    router.push("/signin");
  };

  /*----------------------------------------
            setUser Function 
  ----------------------------------------------*/
  const setUser = (user: User | null) => {

  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        signUpData,
        loading,
        setSignupData,
        signup,
        verifyOTP,
        resendOtp,
        verifyForgotOTP,
        login,
        logout,
        forgotPassword,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*-----------------------------------------------
            exporting hooking 
  ----------------------------------------------*/
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
