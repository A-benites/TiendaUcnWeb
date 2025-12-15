import { api } from "@/lib/axios";
import { TaxonomyItem } from "@/models/admin.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type TaxonomyType = "categories" | "brands";

// API Calls
async function getAll(type: TaxonomyType): Promise<TaxonomyItem[]> {
  const { data } = await api.get(`/admin/${type}`);

  // Handle the specific backend response format:
  // { message: "...", data: { categories: [...] } } or { message: "...", data: { brands: [...] } }
  if (data?.data) {
    const innerData = data.data;
    // Check for the specific property name (categories or brands)
    if (Array.isArray(innerData[type])) {
      return innerData[type];
    }
    // Fallback: check if innerData itself is an array
    if (Array.isArray(innerData)) {
      return innerData;
    }
  }

  // Direct array response
  if (Array.isArray(data)) {
    return data;
  }

  // Fallback to empty array if response format is unexpected
  console.warn(`Unexpected response format for ${type}:`, data);
  return [];
}

async function create(type: TaxonomyType, name: string) {
  const { data } = await api.post(`/admin/${type}`, { name });
  return data;
}

async function update(type: TaxonomyType, id: number, name: string) {
  const { data } = await api.put(`/admin/${type}/${id}`, { name });
  return data;
}

async function remove(type: TaxonomyType, id: number) {
  await api.delete(`/admin/${type}/${id}`);
}

export function useAdminTaxonomy(type: TaxonomyType) {
  const queryClient = useQueryClient();
  const queryKey = [`admin-${type}`];

  const query = useQuery<TaxonomyItem[]>({
    queryKey,
    queryFn: () => getAll(type),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => create(type, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Creado exitosamente");
    },
    onError: () => toast.error("Error al crear"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => update(type, id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Actualizado correctamente");
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => remove(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Eliminado correctamente");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        toast.error("No se puede eliminar: Está en uso.");
      } else {
        toast.error("Error al eliminar.");
      }
    },
  });

  return {
    items: query.data || [],
    isLoading: query.isLoading,
    // ESTAS DOS LÍNEAS SON LAS QUE FALTABAN:
    isError: query.isError,
    refetch: query.refetch,
    //
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
  };
}
