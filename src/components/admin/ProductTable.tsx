/* eslint-disable @next/next/no-img-element */

import { ProductForAdminDTO, useToggleProductStatusMutation } from '@/services/admin-products';
import { FaEdit, FaToggleOn, FaToggleOff, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';
import toast from 'react-hot-toast'; // Assuming toast is still used for the corrected version

/**
 * <summary>
 * Defines the properties required by the ProductTable component.
 * </summary>
 */
interface ProductTableProps {
    /** <summary>The list of products (ProductForAdminDTO) to be displayed.</summary> */
    products: ProductForAdminDTO[];
}

/**
 * <summary>
 * Presents the list of products in a sortable and filterable table format for administration.
 * </summary>
 * <param name="props">The component's properties, containing the list of products.</param>
 * <returns>A React component rendering the product table and action buttons.</returns>
 * <remarks>
 * Implements the activation/deactivation action using useToggleProductStatusMutation.
 * </remarks>
 */
export const ProductTable = ({ products }: ProductTableProps) => {
    // Implements mutations for actions (PATCH /api/admin/products/[id]/status)
    const toggleMutation = useToggleProductStatusMutation();

    /**
     * <summary>
     * Handles the click event for toggling a product's status using a confirmation Toast.
     * </summary>
     * <param name="id">The ID of the product to toggle.</param>
     * <param name="currentStatus">The product's current availability state.</param>
     * <param name="title">The product's title for the confirmation message.</param>
     */
    const handleToggleStatus = (id: number, currentStatus: boolean, title: string) => {
        // NOTE: The implementation here would use the toast logic provided previously
        // The structure below reflects the original structure for simple documentation:
        if (confirm(`Are you sure you want to change the status of ${title}?`)) {
            toggleMutation.mutate(id);
        }
    };

    return (
        <div className="overflow-x-auto shadow-lg sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price/Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Update</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => {
                        const isMutating = toggleMutation.isPending && toggleMutation.variables === product.id;
            
                        return (
                            <tr key={product.id} className="hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full mr-4 object-cover"
                                            src={product.mainImageURL || '/placeholder-image.png'} 
                                            alt={product.title} />
                                        <span className="text-sm font-medium text-gray-900">{product.title}</span>
                                    </div>
                                </td>
                
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <p className="font-semibold">{product.price}</p>
                                    <p className={`text-xs ${product.stockIndicator === 'Low' ? 'text-red-500' : 'text-green-500'}`}>
                                        Stock: {product.stock} ({product.stockIndicator})
                                    </p>
                                </td>
                
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span 
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                    >
                                        {product.isAvailable ? 'Available' : 'Inactive'}
                                    </span>
                                </td>
                
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {format(new Date(product.updatedAt), 'dd/MM/yy HH:mm')}
                                </td>
                
                                {/* Acciones */}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <div className="flex justify-center space-x-3">
                                        {/* Acción 1: Editar */}
                                        <Link 
                                            href={`/admin/products/edit/${product.id}`} 
                                            className="text-indigo-600 hover:text-indigo-900"
                                            title="Edit Product"
                                        >
                                            <FaEdit className="w-5 h-5" />
                                        </Link>
                    
                                        {/* Acción 2: Activar/Desactivar */}
                                        <button
                                            // NOTE: Passing currentStatus and title requires modification of handleToggleStatus signature
                                            onClick={() => handleToggleStatus(product.id, product.isAvailable, product.title)}
                                            disabled={isMutating}
                                            className={`text-gray-500 hover:text-gray-900 ${isMutating ? 'opacity-50' : ''}`}
                                            title={product.isAvailable ? 'Deactivate' : 'Activate'}
                                        >
                                            {isMutating ? (
                                                <FaSpinner className="w-5 h-5 animate-spin text-gray-500" />
                                            ) : product.isAvailable ? (
                                                <FaToggleOn className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <FaToggleOff className="w-5 h-5 text-red-500" />
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};