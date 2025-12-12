'use client';

import { useState } from 'react';
import { useOrdersQuery } from '@/services/orders';
import { OrderTable } from './OrderTable';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 

/**
 * <summary>
 * Container component responsible for managing the state, fetching data,
 * and displaying the user's paginated order history.
 * </summary>
 * <remarks>
 * Handles pagination, search filtering by code, and displays loading/error/data states.
 * </remarks>
 * <returns>A React component rendering the order list view.</returns>
 */
export const OrderList = () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    
    const [searchCode, setSearchCode] = useState('');
    const [codeFilter, setCodeFilter] = useState('');

    const filter = { page, pageSize, code: codeFilter };
    
    // Utiliza el hook que incluye la solución de contingencia
    const { data, isLoading, isError, isFetching } = useOrdersQuery(filter);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); 
        setCodeFilter(searchCode);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600">Loading order history... ⏳</p>
            </div>
        );
    }

    if (isError) {
        // Muestra error solo para errores de red o del servidor (5xx)
        return (
            <div className="text-center py-10 text-xl text-red-700 bg-red-100 p-4 rounded-lg border border-red-200">
                Error loading orders! Please check your connection or the server (5xx error).
            </div>
        );
    }
    
    // Si la función getOrders maneja el 401/403, 'data' debería existir aquí (incluso si está vacío)
    if (!data) {
        return (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-xl text-gray-500">No order data available to display.</p>
            </div>
        );
    }

    const orderList = data;
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Purchase History</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search by order code..."
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button 
                    type="submit" 
                    disabled={isFetching}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-60"
                >
                    {isFetching ? 'Searching...' : 'Search'}
                </button>
            </form>

            {/* Order Table Display */}
            {orderList.orders.length > 0 ? (
                <>
                    <OrderTable orders={orderList.orders} />

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center pt-4">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1 || isFetching}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-colors"
                        >
                            <FaChevronLeft size={12} /> Previous
                        </button>
                        <span className="text-md font-medium text-gray-700">
                            Page {orderList.currentPage} of {orderList.totalPages} 
                            <span className="text-sm text-gray-500 ml-2">({orderList.totalCount} orders)</span>
                            {isFetching && <span className="ml-3 text-sm text-blue-500">Updating...</span>}
                        </span>
                        <button
                            onClick={() => setPage((prev) => (prev < orderList.totalPages ? prev + 1 : prev))}
                            disabled={page === orderList.totalPages || isFetching}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-full disabled:opacity-50 hover:bg-gray-300 transition-colors"
                        >
                            Next <FaChevronRight size={12} />
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                    <p className="text-xl text-gray-500">
                        {codeFilter ? `No orders found with code "${codeFilter}".` : "You have no orders in your history."}
                    </p>
                    {codeFilter && <button onClick={() => setCodeFilter('')} className="mt-4 text-blue-600 hover:underline">Show All Orders</button>}
                </div>
            )}
        </div>
    );
};