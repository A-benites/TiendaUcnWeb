import { api } from "@/lib/axios";

// Interfaces para las respuestas de autenticación
export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(email: string, password: string) {
    // Ajusta la URL '/auth/login' según tu backend real
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  async register(userData: RegisterData) {
    // Ajusta la URL '/auth/register' según tu backend real
    const { data } = await api.post<RegisterResponse>("/auth/register", userData);
    return data;
  },
};
