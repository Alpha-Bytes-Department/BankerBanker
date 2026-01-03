//========== Authentication Type Definitions ===========

export interface User {
  id: string;
  email: string;
  name: string;
  role: "lender" | "sponsor";
  companyName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signup: (
    customer_type: "lender" | "sponsor",
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    password: string,
    confirm_password: string,
  ) => Promise<void>;
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
