/* eslint-disable @typescript-eslint/no-explicit-any */


import { api } from '@/lib/axios'; // Asume tu cliente Axios configurado
import { 
    useQuery, 
    useMutation, 
    useQueryClient, 
    UseQueryResult,
    UseMutationResult
} from '@tanstack/react-query';
import { throws } from 'assert';
import { AxiosError } from 'axios';
import { tr } from 'zod/v4/locales';

// --- Interfaces de Datos (Basadas en tus DTOs de C#) ---

/**
 * Filtros y paginación para la API de productos de administración.
 * Se mapea a SearchParamsDTO de C#.
 */
export interface AdminProductSearchParams {
    page: number;
    pageSize: number;
    search?: string; // Para buscar por título u otros campos
    // Puedes añadir más filtros como categoryId, isAvailable, etc.
}

/**
 * Estructura de un producto individual para la tabla de administración.
 * Mapea a ProductForAdminDTO.
 */
export interface ProductForAdminDTO {
    id: number;
    title: string;
    mainImageURL?: string;
    price: string;
    stock: number;
    stockIndicator: string;
    categoryName: string;
    brandName: string;
    statusName: string;
    isAvailable: boolean;
    updatedAt: string;
}

/**
 * Respuesta paginada de la lista de productos de administración.
 * Mapea a ListedProductsForAdminDTO.
 */
export interface ListedProductsForAdminDTO {
    products: ProductForAdminDTO[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

// --- Clave de Consulta ---
const ADMIN_PRODUCTS_QUERY_KEY = 'adminProductsList';

// --- Funciones de Fetching y Mutación ---


export async function getAdminProducts(params: AdminProductSearchParams): Promise<ListedProductsForAdminDTO> {
    
    // ⚠️ CORRECCIÓN DE NOMBRES DE PARÁMETROS para C#: PageNumber, PageSize, SearchTerm
    const queryParams: Record<string, any> = {
        // Mapeo: frontend.page -> backend.PageNumber
        PageNumber: Number(params.page),
        
        // Mapeo: frontend.pageSize -> backend.PageSize (el DTO acepta null, pero enviamos el número)
        PageSize: Number(params.pageSize),
    };
    
    // Solo incluye el filtro de búsqueda si tiene un valor real.
    if (params.search && params.search.trim() !== '') {
        queryParams.SearchTerm = params.search.trim(); // Mapeo: frontend.search -> backend.SearchTerm
    }
    
    // Si tu SearchParamsDTO tiene otros campos requeridos (como SortBy), deberías incluirlos aquí.
    // Ejemplo: queryParams.SortBy = 'Newest'; 
    
    try {
        const response = await api.get('/admin/products', { params: queryParams });
        return response.data.data; // Retorno en caso de éxito
        
    } catch (err) {
        // Manejamos el error 400 (Bad Request) o 401/403 (Contingencia)
        console.error("Error fetching admin products. Check parameters or auth:", err);
        
        const error = err as AxiosError;
        
        // Si el error es un código de cliente (4xx), devolvemos una lista vacía.
        if (error.response && error.response.status >= 400 && error.response.status < 500) {
            
            // Retornamos el DTO vacío para que useQuery no marque isError = true
            return {
                products: [],
                totalCount: 0,
                currentPage: params.page, // Usamos el número de página solicitado
                pageSize: params.pageSize,
                totalPages: 0,
            }; // Retorno 1 del catch (Error 4xx)
        }
        throw error; // Retorno 2 del catch (Error 5xx o Network)
    }
}
/**
 * <summary>Alterna el estado de disponibilidad de un producto (PATCH /api/admin/products/{id}/status).</summary>
 */
export async function toggleProductStatus(id: number): Promise<void> {
    // La mutación PATCH no necesita un body, solo la llamada al endpoint
    await api.patch(`/admin/products/${id}/status`);
}

// --- Hooks de React Query ---

/**
 * <summary>Hook para obtener la lista paginada de productos de administración.</summary>
 */
export const useAdminProductsQuery = (
    params: AdminProductSearchParams
// ⚠️ CORRECCIÓN 1: Especificar el tipo de error (Error)
): UseQueryResult<ListedProductsForAdminDTO, Error> => {
    return useQuery<ListedProductsForAdminDTO, Error>({
        queryKey: [ADMIN_PRODUCTS_QUERY_KEY, params],
        queryFn: () => getAdminProducts(params),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60,
    });
};
/**
 * <summary>Hook para mutar (activar/desactivar) el estado de un producto.</summary>
 */
export const useToggleProductStatusMutation = (): UseMutationResult<void, Error, number> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: toggleProductStatus,
        // Optimización de la caché después de una mutación exitosa
        onSuccess: () => {
            // Invalida la caché de la lista de productos para forzar un nuevo fetch.
            // Esto asegura que la tabla se actualice con el nuevo estado.
            queryClient.invalidateQueries({ queryKey: [ADMIN_PRODUCTS_QUERY_KEY] });
            // Opcionalmente, se podría hacer una actualización optimista aquí
        },
    });
};