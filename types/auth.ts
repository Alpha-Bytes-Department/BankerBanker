//========== Authentication Type Definitions ===========

export type UserType = "Lender" | "Sponsor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserType;
  companyName?: string;
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

export interface AuthContextType{
  signUpData: signup | null;
  loading: boolean;
  authState: AuthState,
  setUser: (user: User | null) => void;
  setSignupData: (data: signup) => void;
  login: ( email: string, password: string, rememberMe?: boolean ) => Promise<void>;
  signup: (formData : signup) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string)=> Promise<void>
  verifyForgotOTP: (email: string)=> Promise<void>;
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
