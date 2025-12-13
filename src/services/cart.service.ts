import { api } from '@/lib/axios';

export interface AddCartItemDTO {
    productId: number;
    quantity: number;
}

export interface ChangeItemQuantityDTO {
    productId: number;
    quantity: number;
}

export const cartService = {
    // Obtiene el carrito (y establece la cookie buyerId si no existe)
    getCart: async () => {
        const { data } = await api.get('/cart');
        return data;
    },

    addItem: async (item: AddCartItemDTO) => {
        const { data } = await api.post('/cart/items', item);
        return data;
    },

    removeItem: async (productId: number) => {
        const { data } = await api.delete(`/cart/items/${productId}`);
        return data;
    },

    updateQuantity: async (item: ChangeItemQuantityDTO) => {
        const { data } = await api.patch('/cart/items', item);
        return data;
    },

    clearCart: async () => {
        const { data } = await api.post('/cart/clear');
        return data;
    },
    
    // Validates stock and rules
    checkoutValidation: async () => {
        const { data } = await api.post('/cart/checkout');
        return data;
    }
};
