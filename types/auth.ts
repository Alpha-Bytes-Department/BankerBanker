//========== Authentication Type Definitions ===========

export type UserType = "Lender" | "Sponsor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserType
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
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  signUpData: signup | null;
  error: string | null;
  loading: boolean;
  setSignupData: (data: signup) => void;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signup: (formData : signup) => Promise<void>;
  verifyEmail: (otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
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
