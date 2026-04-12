//========== Authentication Type Definitions ===========

export type UserType = "Lender" | "Sponsor";

export interface User {
  id?: string;
  email?: string;
  customer_type?:string;
  profile_photo?: string;
  first_name?: string;
  last_name?: string;
  role?: UserType;
  phone?: string;
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
  customer_type?: UserType,
  first_name?: string,
  last_name?: string,
  email?: string,
  phone?: string,
  password?: string,
  confirm_password?: string,
  media_files?: File[],
  agreedToTerms?: boolean,
}


export interface AuthState {
  email: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: User | null;
  signUpData: signup | null;
  loading: boolean;
  authState: AuthState,
  setSignupData: (data: signup) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (formData: signup) => Promise<void>;
  verifyOTP: (otp: string, from: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>
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
