import { api } from "@/lib/axios";
import { User } from "@/stores/auth.store";

// Interfaces para las respuestas de autenticación
export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface LoginResponse {
  message: string;
  data: string; // JWT token
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  gender: "Masculino" | "Femenino" | "Otro";
  birthDate: string; // formato: YYYY-MM-DD
  rut: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailData {
  email: string;
  verificationCode: string;
}

export interface ResendCodeData {
  email: string;
}

export const authService = {
  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string) {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  /**
   * Registra un nuevo usuario
   */
  async register(userData: RegisterData) {
    const { data } = await api.post<ApiResponse<string>>("/auth/register", userData);
    return data;
  },

  /**
   * Verifica el email del usuario con el código de 6 dígitos
   */
  async verifyEmail(verifyData: VerifyEmailData) {
    const { data } = await api.post<ApiResponse<string>>("/auth/verify", verifyData);
    return data;
  },

  /**
   * Reenvía el código de verificación al email
   */
  async resendVerificationCode(email: string) {
    const { data } = await api.post<ApiResponse<string>>("/auth/resend-email-verification-code", {
      email,
    });
    return data;
  },

  /**
   * Obtiene el perfil del usuario autenticado
   */
  async getProfile(token: string) {
    const { data } = await api.get<ApiResponse<User>>("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  },
};
