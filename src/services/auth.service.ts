import { api } from "@/lib/axios";

// Interfaces para la respuesta del login
export interface LoginResponse {
  token: string;
  user: {
    email: string;
    role: string;
  };
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
};
