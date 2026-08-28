//========== Authentication Type Definitions ===========

export type UserType = "Lender" | "Sponsor";

export interface User {
  id?: string | number;
  email?: string;
  customer_type?: string;
  profile_photo?: string | null;
  first_name?: string;
  last_name?: string;
  role?: UserType;
  roles?: string[];
  active_role?: string;
  phone?: string;
  company_name?: string | null;
  position?: string | null;
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  company_information?: {
    company_name?: string;
    position?: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
  phoneNumber?: string;
  profileImage?: string;
}

export interface signup {
  customer_type?: UserType;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm_password?: string;
  media_files?: File[];
  agreedToTerms?: boolean;
}

export interface AuthState {
  email: string | null;
  isAuthenticated: boolean;
  from?: string;
}

export interface AuthContextType {
  user: User | null;
  signUpData: signup | null;
  loading: boolean;
  authState: AuthState;
  setSignupData: (data: signup) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (formData: signup) => Promise<void>;
  verifyOTP: (otp: string, from: string) => Promise<void>;
  resendOtp: (email: string, from?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string, confirmNewPassword: string) => Promise<void>;
  toggleRole: () => Promise<void>;
  switchRole: (role: "Sponsor" | "Lender") => Promise<void>;
  logout: () => void;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
