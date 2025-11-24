import { ProductDetail } from "./product.types";

export interface CartItem extends ProductDetail {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: ProductDetail, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}