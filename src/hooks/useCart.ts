import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService, AddCartItemDTO, ChangeItemQuantityDTO } from "@/services/cart.service";
import { useCartStore } from "@/stores/cart.store";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Tipos para la respuesta del carrito del servidor
export interface ServerCartItem {
  productId: number;
  title: string;
  mainImageURL: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface ServerCart {
  buyerId: string;
  items: ServerCartItem[];
  totalPrice: number;
}

// Query key constants
export const CART_QUERY_KEY = ["cart"] as const;

/**
 * Hook para obtener el carrito del servidor
 */
export function useGetCart() {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return useQuery<ServerCart>({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getCart(),
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 segundos
  });
}

/**
 * Hook para agregar un item al carrito (sincronizado con servidor si está autenticado)
 */
export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;

  return useMutation({
    mutationFn: async (item: AddCartItemDTO) => {
      if (isAuthenticated) {
        return cartService.addItem(item);
      }
      // Si no está autenticado, solo retornamos el item (se maneja en el store)
      return item;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al agregar al carrito");
    },
  });
}

/**
 * Hook para actualizar la cantidad de un item en el carrito
 */
export function useUpdateQuantityMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const localUpdateQuantity = useCartStore((state) => state.updateQuantitySilent);

  return useMutation({
    mutationFn: async (item: ChangeItemQuantityDTO) => {
      // Optimistic update local (silencioso, sin toast)
      localUpdateQuantity(item.productId, item.quantity);

      if (isAuthenticated) {
        return cartService.updateQuantity(item);
      }
      return item;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
    },
    onError: (error: Error) => {
      // Revertir el cambio local en caso de error
      toast.error(error.message || "Error al actualizar cantidad");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Hook para eliminar un item del carrito
 */
export function useRemoveItemMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const localRemoveItem = useCartStore((state) => state.removeItemSilent);

  return useMutation({
    mutationFn: async (productId: number) => {
      // Optimistic update local (silencioso, sin toast)
      localRemoveItem(productId);

      if (isAuthenticated) {
        return cartService.removeItem(productId);
      }
      return productId;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
      toast.info("Producto eliminado del carrito");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar del carrito");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Hook para vaciar el carrito completo
 */
export function useClearCartMutation() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const localClearCart = useCartStore((state) => state.clearCartSilent);

  return useMutation({
    mutationFn: async () => {
      // Optimistic update local (silencioso, sin toast)
      localClearCart();

      if (isAuthenticated) {
        return cartService.clearCart();
      }
      return null;
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      }
      toast.info("Carrito vaciado");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al vaciar el carrito");
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
}

/**
 * Hook para sincronizar el carrito local con el servidor
 * Útil cuando el usuario inicia sesión
 */
export function useSyncCartMutation() {
  const queryClient = useQueryClient();
  const items = useCartStore((state) => state.items);

  return useMutation({
    mutationFn: async () => {
      // Limpiar carrito del servidor
      await cartService.clearCart();

      // Subir todos los items locales al servidor
      await Promise.all(
        items.map((item) =>
          cartService.addItem({
            productId: item.id,
            quantity: item.quantity,
          })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success("Carrito sincronizado con el servidor");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al sincronizar el carrito");
    },
  });
}
