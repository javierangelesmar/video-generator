export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  role: 'patient' | 'doctor';
}

export interface AuthState {
  userId: string | null;
  role: 'patient' | 'doctor' | 'admin' | null;
  isLoading: boolean;
  error: string | null;
}
