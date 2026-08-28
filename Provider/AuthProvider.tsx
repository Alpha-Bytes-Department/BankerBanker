"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthContextType, User, AuthState, signup } from "@/types/auth";
import api from "./api";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

// Public routes that don't need profile fetch
const PUBLIC_ROUTES = [
  "/register",
  "/signin",
  "/register/upload",
  "/verify_otp",
  "/reset_pass_one",
  "/reset_pass_one/reset_pass_two",
  "/reset_pass_one/reset_pass_two/reset_pass_three",
  "/reset_pass_one/reset_pass_two/reset_pass_three/reset_pass_four",
];

const normalizeRole = (value?: string): "Sponsor" | "Lender" => {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "sponsor") return "Sponsor";
  if (normalized === "lender" || normalized === "lander") return "Lender";
  return "Sponsor";
};

const formatErrorMessage = (error: any, fallback: string): string => {
  if (error?.response?.data) {
    const data = error.response.data;
    if (data.message && typeof data.message === "string") {
      if (data.errors && typeof data.errors === "object") {
        const errorList = Object.entries(data.errors)
          .map(([key, msgs]) => `${key}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join(" | ");
        return `${data.message} (${errorList})`;
      }
      return data.message;
    }
    if (data.detail && typeof data.detail === "string") return data.detail;
    if (data.errors && typeof data.errors === "object") {
      return Object.entries(data.errors)
        .map(([key, msgs]) => `${key}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
        .join(" | ");
    }
  }
  return fallback;
};

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
  const pathname = usePathname();

  // Hydrate pending Authstate from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("Authstate");
      if (savedAuth) {
        try {
          const parsed = JSON.parse(savedAuth);
          if (parsed?.email) {
            setAuthState(parsed);
          }
        } catch (e) {
          console.error("Failed to parse Authstate from storage", e);
        }
      }
    }
  }, []);

  /*----------------------------------------
            Signup Function 
  ----------------------------------------------*/
  const signup = async (userData: signup) => {
    setSignupData(userData);

    try {
      setLoading(true);
      const res = await api.post("/auth/signup/", {
        first_name: userData.first_name?.trim(),
        last_name: userData.last_name?.trim(),
        email: userData.email?.trim(),
        phone: userData.phone?.trim(),
        password: userData.password,
        confirm_password: userData.confirm_password,
      });

      console.log("Signup response:", res);
      if (res.status === 200 || res.status === 201) {
        const email = res.data?.data?.email || userData.email || null;
        const newAuthState = {
          email,
          isAuthenticated: false,
          from: "signup",
        };
        setAuthState(newAuthState);
        localStorage.setItem("Authstate", JSON.stringify(newAuthState));
        toast.success(res.data?.message || "Successfully signed up! Please verify your email.");
        router.push("/verify_otp?from=signup");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(formatErrorMessage(error, "Signup failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
            Resend OTP Function 
  ----------------------------------------------*/
  const resendOtp = async (email: string, from?: string) => {
    try {
      setLoading(true);
      if (!email?.trim()) {
        toast.error("Email is required to resend OTP.");
        return;
      }
      const isForgot = from === "forgotPassword";
      const endpoint = isForgot ? "/auth/forgot-otp-resend/" : "/auth/signup-resend-otp/";
      const res = await api.post(endpoint, {
        email: email.trim(),
      });
      if (res.status === 200 || res.status === 201) {
        const newAuthState = {
          email: email.trim(),
          isAuthenticated: false,
          from: from || "signup",
        };
        setAuthState(newAuthState);
        localStorage.setItem("Authstate", JSON.stringify(newAuthState));
        toast.success(res.data?.message || "OTP resent successfully!");
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error(formatErrorMessage(error, "Failed to resend OTP. Please try again."));
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
      if (!email?.trim()) {
        toast.error("Email is required.");
        return;
      }
      const res = await api.post("/auth/forgot-password/", {
        email: email.trim(),
      });
      if (res.status === 200 || res.status === 201) {
        const newAuthState = {
          email: email.trim(),
          isAuthenticated: false,
          from: "forgotPassword",
        };
        localStorage.setItem("Authstate", JSON.stringify(newAuthState));
        setAuthState(newAuthState);
        toast.success(res.data?.message || "OTP sent to your email successfully!");
        router.push("/reset_pass_one/reset_pass_two?from=forgotPassword");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(formatErrorMessage(error, "Failed to process forgot password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
          Verify OTP Function 
  ----------------------------------------------*/
  const verifyOTP = async (otp: string, from: string) => {
    const savedState = localStorage.getItem("Authstate");
    const parsedState = savedState ? JSON.parse(savedState) : null;
    const email = authState?.email || parsedState?.email;

    if (!email) {
      toast.error("Session expired or missing email. Please start again.");
      router.push(from === "forgotPassword" ? "/reset_pass_one" : "/register");
      return;
    }

    if (!otp?.trim()) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    if (from === "forgotPassword") {
      try {
        setLoading(true);
        const res = await api.post("/auth/forgot-password-verify/", {
          email: email.trim(),
          otp_code: otp.trim(),
        });
        if (res.status === 200 || res.status === 201) {
          const updatedState = {
            email: email.trim(),
            isAuthenticated: false,
            from: "forgotPassword",
          };
          setAuthState(updatedState);
          localStorage.setItem("Authstate", JSON.stringify(updatedState));
          toast.success(res.data?.message || "OTP verified! Please set your new password.");
          router.push("/reset_pass_one/reset_pass_two/reset_pass_three");
        }
      } catch (error: any) {
        console.error("Forgot password OTP verification error:", error);
        toast.error(formatErrorMessage(error, "OTP verification failed. Please try again."));
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const res = await api.post("/auth/verify-signup/", {
          email: email.trim(),
          otp_code: otp.trim(),
        });
        if (res.status === 200 || res.status === 201) {
          localStorage.removeItem("Authstate");
          setAuthState({ email: null, isAuthenticated: false });
          toast.success(res.data?.message || "Email verified successfully! You can now log in.");
          router.push("/signin");
        }
      } catch (error: any) {
        console.error("Verify email error:", error);
        toast.error(formatErrorMessage(error, "Email verification failed. Please try again."));
      } finally {
        setLoading(false);
      }
    }
  };

  /*----------------------------------------
          Reset Password Function 
  ----------------------------------------------*/
  const resetPassword = async (
    email: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/reset-password/", {
        email: email.trim(),
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      if (res.status === 200 || res.status === 201) {
        localStorage.removeItem("Authstate");
        setAuthState({ email: null, isAuthenticated: false });
        toast.success(res.data?.message || "Password reset successfully!");
        router.push(
          "/reset_pass_one/reset_pass_two/reset_pass_three/reset_pass_four",
        );
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(formatErrorMessage(error, "Failed to reset password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
            Login Function 
  ----------------------------------------------*/
  const login = async (
    email: string,
    password: string,
    remember_me?: boolean,
  ) => {
    try {
      console.log("Attempting login for email:", email);
      setLoading(true);
      const res = await api.post("/auth/login/", {
        email: email.trim(),
        password,
        remember_me: !!remember_me,
      });

      console.log("Login response:", res);
      if (res.status === 200) {
        const { user: rawUser, access, refresh } = res.data.data;
        const activeRole =
          rawUser?.active_role ||
          (rawUser?.roles && rawUser.roles[0]) ||
          rawUser?.role ||
          "Sponsor";
        const normalizedRole = normalizeRole(activeRole);
        const normalizedUser: User = {
          ...rawUser,
          role: normalizedRole,
          customer_type: normalizedRole,
          active_role: activeRole,
          roles: rawUser?.roles || ["Sponsor", "Lender"],
        };

        localStorage.setItem(
          "userCredentials",
          JSON.stringify({
            access_token: access,
            refresh_token: refresh,
            user: normalizedUser,
          }),
        );
        setUser(normalizedUser);
        toast.success(res.data?.message || "Logged in successfully!");

        if (normalizedRole === "Sponsor") {
          console.log("Redirecting to sponsor dashboard for user:", normalizedUser);
          router.push("/sponsor");
        } else {
          console.log("Redirecting to lender dashboard for user:", normalizedUser);
          router.push("/lender");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(formatErrorMessage(error, "Login failed. Please check your credentials and try again."));
    } finally {
      setLoading(false);
    }
  };

  /*----------------------------------------
            Role Switching / Toggle Function 
  ----------------------------------------------*/
  const switchRole = async (targetRole: "Sponsor" | "Lender") => {
    try {
      setLoading(true);
      const res = await api.patch("/auth/role/", { role: targetRole });
      if (res.status === 200) {
        const newActiveRole = res.data?.data?.active_role || targetRole;
        const updatedRoles = res.data?.data?.roles || user?.roles || ["Sponsor", "Lender"];
        const normalized = normalizeRole(newActiveRole);

        const updatedUser: User = {
          ...(user || {}),
          active_role: newActiveRole,
          role: normalized,
          customer_type: normalized,
          roles: updatedRoles,
        };

        const userCredentials = localStorage.getItem("userCredentials");
        if (userCredentials) {
          const parsed = JSON.parse(userCredentials);
          localStorage.setItem(
            "userCredentials",
            JSON.stringify({
              ...parsed,
              user: updatedUser,
            }),
          );
        }

        setUser(updatedUser);
        toast.success(`Switched to ${newActiveRole} mode`);

        if (normalized === "Sponsor") {
          router.push("/sponsor");
        } else {
          router.push("/lender");
        }
      }
    } catch (error: any) {
      console.error("Role switch error:", error);
      toast.error(formatErrorMessage(error, "Failed to switch role. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async () => {
    const currentRole = normalizeRole(user?.active_role || user?.role || user?.customer_type);
    const targetRole = currentRole === "Lender" ? "Sponsor" : "Lender";
    await switchRole(targetRole);
  };

  /*----------------------------------------
            Logout Function 
  ----------------------------------------------*/
  const logout = async () => {
    try {
      const userCredentials = localStorage.getItem("userCredentials");
      if (userCredentials) {
        const { refresh_token } = JSON.parse(userCredentials);
        if (refresh_token) {
          await api.post("/auth/logout/", { refresh_token });
        }
      }
    } catch (error) {
      console.error("Logout api error:", error);
    } finally {
      localStorage.removeItem("userCredentials");
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/signin");
    }
  };

  /*----------------------------------------
            Getting user data 
  ----------------------------------------------*/
  useEffect(() => {
    const fetchUserProfile = async () => {
      const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname?.startsWith(route),
      );
      if (isPublicRoute) return;

      try {
        const userCredentials = localStorage.getItem("userCredentials");
        if (!userCredentials) return;

        const parsedCredentials = JSON.parse(userCredentials);
        const storedUser: User | null = parsedCredentials?.user ?? null;

        if (storedUser) {
          setUser((prev) => prev ?? storedUser);
        }

        const res = await api.get("/auth/profile/");
        if (res.status === 200) {
          const profileUser: User = res.data?.data || res.data;
          const activeRole =
            profileUser?.active_role ||
            (profileUser?.roles && profileUser.roles[0]) ||
            profileUser?.role ||
            storedUser?.role ||
            "Sponsor";
          const normalizedRole = normalizeRole(activeRole);
          const mergedUser: User = {
            ...(storedUser || {}),
            ...profileUser,
            role: normalizedRole,
            customer_type: normalizedRole,
            active_role: activeRole,
            roles: profileUser?.roles || storedUser?.roles || ["Sponsor", "Lender"],
          };

          setUser(mergedUser);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, [pathname]);

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
        resetPassword,
        switchRole,
        toggleRole,
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
