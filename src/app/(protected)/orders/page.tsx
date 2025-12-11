import { OrderList } from '@/components/orders/OrderList'; 

/**
 * <summary>
 * Metadata definitions for the Orders History page.
 * </summary>
 */
export const metadata = {
    /** <summary>The title displayed in the browser tab.</summary> */
    title: "Tus órdenes de compra",
    /** <summary>Description for search engine optimization.</summary> */
    description: "Gestiona tus órdenes de compra desde esta página.",
};

/**
 * <summary>
 * Page component for the user's order history route (/orders).
 * </summary>
 * <remarks>
 * This component acts as a simple wrapper, rendering the main OrderList container.
 * </remarks>
 * <returns>A React component rendering the OrderList view.</returns>
 */
export default function OrdersPage() {
    return <OrderList />;
}