import axios from "axios";
import { getSession } from "next-auth/react";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  async (config) => {
    // Obtener la sesión de NextAuth
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }

    // Si el body es FormData, eliminar el Content-Type para que el navegador lo establezca automáticamente
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si el error es 401, cerrar sesión
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Use NextAuth signOut
      // We might want to avoid infinite loops if the signOut calls an API that 401s
      // But signOut normally clears client cookies.
      // await signOut({ redirect: false });
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
