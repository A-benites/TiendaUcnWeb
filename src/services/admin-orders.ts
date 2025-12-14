import { api } from "@/lib/axios";
import {
  AdminOrderDTO,
  AdminOrderListResponse,
  AdminOrderSearchParams,
} from "@/models/admin.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

// MAPEO: Texto Frontend -> Número Backend (Enum C#)
const statusToEnum: Record<string, number> = {
  Pending: 0,
  Paid: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 4,
};

// --- API Calls ---

async function getOrders(params: AdminOrderSearchParams): Promise<AdminOrderListResponse> {
  const queryParams: Record<string, unknown> = {
    PageNumber: params.page,
    PageSize: params.pageSize,
  };

  if (params.search) queryParams.SearchTerm = params.search;
  if (params.status && params.status !== "all") queryParams.Status = params.status;

  const { data } = await api.get<{ data: AdminOrderListResponse }>("/admin/orders", {
    params: queryParams,
  });
  return data.data;
}

async function getOrderById(id: number): Promise<AdminOrderDTO> {
  // Ajustamos el tipo de retorno genérico de axios
  const { data } = await api.get<{ data: AdminOrderDTO }>(`/admin/orders/${id}`);
  return data.data;
}

async function updateOrderStatus(id: number, statusString: string): Promise<void> {
  const statusEnum = statusToEnum[statusString];

  if (statusEnum === undefined) {
    throw new Error(`El estado '${statusString}' no es válido para el mapeo.`);
  }

  // Enviamos el número (int) como espera el backend C#
  await api.patch(`/admin/orders/${id}/status`, { status: statusEnum });
}

// --- Hooks ---

export function useAdminOrders(params: AdminOrderSearchParams) {
  return useQuery<AdminOrderListResponse>({
    queryKey: ["admin-orders", params],
    queryFn: () => getOrders(params),
    placeholderData: (prev) => prev,
  });
}

export function useAdminOrderDetail(id: number) {
  return useQuery<AdminOrderDTO>({
    queryKey: ["admin-order", id],
    queryFn: () => getOrderById(id),
    enabled: id > 0,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError, { id: number; status: string }>({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      // Invalidamos para refrescar la UI automáticamente
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", variables.id] });
      toast.success("Estado actualizado correctamente.");
    },
    onError: (error) => {
      console.error("Error update:", error);

      // Acceso tipado al error
      const errorData = error.response?.data as {
        details?: string;
        message?: string;
        errors?: Record<string, string[]>;
      };

      // 1. Mensaje específico del backend ("Conflict", "Validation", etc.)
      const backendDetails = errorData?.details || errorData?.message;

      if (backendDetails) {
        if (backendDetails.includes("Cancelled order")) {
          toast.error("No se puede editar un pedido Cancelado (Estado final).");
        } else {
          toast.error(`Error: ${backendDetails}`);
        }
      }
      // 2. Errores de validación de formulario (.NET devuelve 'errors')
      else if (errorData?.errors) {
        const validationMsg = Object.values(errorData.errors).flat().join(", ");
        toast.error(`Validación fallida: ${validationMsg}`);
      }
      // 3. Fallback
      else {
        toast.error("No se pudo actualizar el estado.");
      }
    },
  });
}
