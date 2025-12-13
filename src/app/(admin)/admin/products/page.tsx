"use client";

import { useState } from "react";
import { useAdminProductsQuery, AdminProductSearchParams } from "@/services/admin-products";
import { ProductTable } from "@/components/admin/ProductTable";
import { FaSearch, FaPlus } from "react-icons/fa";

/**
 * <summary>
 * Client component page for the Product Administration panel route (/admin/products).
 * </summary>
 * <remarks>
 * Manages pagination and search state, handles data fetching via useAdminProductsQuery,
 * and displays the results in the ProductTable component.
 * </remarks>
 * <returns>A React component rendering the full product management interface.</returns>
 */
export default function AdminProductsPage() {
  /**
   * <summary>State for the query parameters (pagination and search).</summary>
   */
  const [params, setParams] = useState<AdminProductSearchParams>({
    page: 1,
    pageSize: 10,
    search: "",
  });
  /**
   * <summary>Local state for the search input field.</summary>
   */
  const [searchTerm, setSearchTerm] = useState(""); // 1. Implement service and useQuery for GET /api/admin/products (paginated and filtered)

  const { data, isLoading, isError, isFetching } = useAdminProductsQuery(params);

  /**
   * <summary>Handles the search form submission, resetting to page 1 and applying the search term.</summary>
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, page: 1, search: searchTerm }));
  };

  /**
   * <summary>Handles page change in the pagination controls.</summary>
   * <param name="newPage">The target page number.</param>
   */
  const handlePageChange = (newPage: number) => {
    // Safely access totalPages since data is checked later
    if (data && newPage > 0 && newPage <= data.totalPages) {
      setParams((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading) return <div className="text-center py-10 text-lg">Loading products...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-xl text-red-600">
        Error loading products. Check API connection or authorization.
      </div>
    );
  // Check if data is null (due to initial fetch or 4xx contingency)
  if (!data) {
    return <div className="text-center py-10 text-gray-500">No product data could be loaded.</div>;
  }
  const productList = data; // Data is guaranteed to exist here

  return (
    <>
         {" "}
      <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Product Management 📦</h1>   {" "}
        <button className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
              <FaPlus className="mr-2" /> New Product    {" "}
        </button>
           {" "}
      </div>
          {/* Control de Búsqueda */}   {" "}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
           {" "}
        <div className="relative flex-grow">
             {" "}
          <input
            type="text"
            placeholder="Search by title, brand, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
             {" "}
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> 
           {" "}
        </div>
           {" "}
        <button
          type="submit"
          disabled={isFetching}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-60"
        >
              {isFetching ? "Searching..." : "Search"}   {" "}
        </button>
           {" "}
      </form>
          {/* 2. Mostrar tabla de productos con acciones */}
          <ProductTable products={productList.products} />    {/* 3. Implementar paginación */}   {" "}
      <div className="flex justify-between items-center mt-6">
           {" "}
        <button
          onClick={() => handlePageChange(productList.currentPage - 1)}
          disabled={productList.currentPage === 1 || isFetching}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
              Previous    {" "}
        </button>
           {" "}
        <span className="text-sm text-gray-700">
              Page {productList.currentPage} of {productList.totalPages} ({productList.totalCount}{" "}
          items)    {" "}
        </span>
           {" "}
        <button
          onClick={() => handlePageChange(productList.currentPage + 1)}
          disabled={productList.currentPage === productList.totalPages || isFetching}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
              Next    {" "}
        </button>
           {" "}
      </div>
         {" "}
      {isFetching && <p className="text-center text-sm text-indigo-500 mt-2">Fetching data...</p>} 
       {" "}
    </>
  );
}
