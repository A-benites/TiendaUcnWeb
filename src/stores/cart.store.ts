import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState } from "@/models/cart.types";
import { ProductDetail } from "@/models/product.types";
import { toast } from "sonner";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: ProductDetail, quantity: number) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;

          if (newQuantity > product.stock) {
            toast.error(`No hay suficiente stock. Máximo disponible: ${product.stock}`);
            return;
          }

          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: newQuantity } : item
            ),
          });
          toast.success("Cantidad actualizada en el carrito");
        } else {
          if (quantity > product.stock) {
            toast.error("La cantidad excede el stock disponible");
            return;
          }

          set({ items: [...currentItems, { ...product, quantity }] });
          toast.success("Producto agregado al carrito");
        }
      },

      removeItem: (productId: number) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        toast.info("Producto eliminado del carrito");
      },

      updateQuantity: (productId: number, quantity: number) => {
        const item = get().items.find((i) => i.id === productId);
        if (!item) return;

        if (quantity > item.stock) {
          toast.error(`Stock máximo alcanzado (${item.stock})`);
          return;
        }

        if (quantity < 1) return;

        set({
          items: get().items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        });
      },

      clearCart: () => {
        set({ items: [] });
        toast.info("Carrito vaciado");
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price =
            typeof item.finalPrice === "string"
              ? parseFloat(item.finalPrice.replace(/[^0-9]/g, ""))
              : item.finalPrice;

          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "shopping-cart-storage",
    }
  )
);
