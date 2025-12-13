
import { api } from '@/lib/axios';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
// Asegúrate de importar la interfaz DTO desde tu archivo de servicios
import { ProductDetailForAdminDTO } from './admin-products'; 

// --- Interfaces de Select ---
export interface SelectOptionDTO {
    id: number;
    name: string;
}

// --- Funciones de Fetching ---

export async function getCategories(): Promise<SelectOptionDTO[]> {
    try {
        const response = await api.get('/admin/categories');
        const data = response.data.data || response.data;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error loading categories:", error);
        return [];
    }
}

export async function getBrands(): Promise<SelectOptionDTO[]> {
    try {
        const response = await api.get('/admin/brands');
        const data = response.data.data || response.data;
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error loading brands:", error);
        return [];
    }
}

/**
 * ⚠️ CORRECCIÓN CLAVE AQUÍ:
 * Tipamos explícitamente el retorno como Promise<ProductDetailForAdminDTO>.
 * Esto soluciona el error "Type Promise<unknown> is not assignable to ProductDetailForAdminDTO".
 */
export async function getProductDetails(id: number): Promise<ProductDetailForAdminDTO> {
    const response = await api.get(`/admin/products/${id}`);
    // Aseguramos que devolvemos la data con el tipo correcto
    return response.data.data as ProductDetailForAdminDTO;
}

// --- Hooks de React Query ---

export const useCategoriesQuery = (): UseQueryResult<SelectOptionDTO[], Error> => {
    return useQuery<SelectOptionDTO[], Error>({
        queryKey: ['categoriesList'],
        queryFn: getCategories,
        staleTime: Infinity,
    });
};

export const useBrandsQuery = (): UseQueryResult<SelectOptionDTO[], Error> => {
    return useQuery<SelectOptionDTO[], Error>({
        queryKey: ['brandsList'],
        queryFn: getBrands,
        staleTime: Infinity,
    });
};

/**
 * Hook para obtener detalles.
 * Ahora que getProductDetails devuelve el tipo correcto, este hook dejará de dar error.
 */
export const useProductDetailsQuery = (
  id: number | null
): UseQueryResult<ProductDetailForAdminDTO, Error> => {
  return useQuery<ProductDetailForAdminDTO, Error>({
    queryKey: ["productDetail", id],
    // Usamos 'id!' porque 'enabled' asegura que id no es null cuando se ejecuta
    queryFn: () => getProductDetails(id!),
    enabled: !!id && id > 0,
  });
};