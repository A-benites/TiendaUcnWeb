import { toast } from "sonner";
import { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
  details?: string;
  errors?: Record<string, string[]>;
}

/**
 * Centralized error handler for API requests.
 * Extracts meaningful messages from backend responses and shows a toast notification.
 */
export function handleApiError(error: unknown, defaultMessage = "Ocurrió un error inesperado") {
  console.error("API Error:", error);

  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;

    // 1. Backend specific message
    if (data?.message || data?.details) {
      toast.error(data.details || data.message);
      return;
    }

    // 2. Validation errors (.NET typical format)
    if (data?.errors) {
      const validationMessages = Object.values(data.errors).flat().join(", ");
      toast.error(`Error de validación: ${validationMessages}`);
      return;
    }

    // 3. Status codes handling
    if (error.response?.status === 401) {
      toast.error("Sesión expirada o no autorizada.");
      return;
    }
    
    if (error.response?.status === 403) {
      toast.error("No tienes permisos para realizar esta acción.");
      return;
    }
    
    if (error.response?.status === 404) {
      toast.error("Recurso no encontrado.");
      return;
    }
  }

  // 4. Default fallback
  toast.error(defaultMessage);
}