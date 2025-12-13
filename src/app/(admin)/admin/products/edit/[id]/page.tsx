"use client";

import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProductDetailsQuery } from "@/services/admin-form-data";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";
import { ProductDetailForAdminDTO } from "@/services/admin-products";
import { FaSpinner } from "react-icons/fa";

/**
 * <summary>
 * Async function to handle product updates via API.
 * </summary>
 * <param name="id">The product ID to update.</param>
 * <param name="formData">The FormData object containing updated fields and files.</param>
 * <returns>A Promise resolving to the updated product details.</returns>
 */
async function updateProduct({
  id,
  formData,
}: {
  id: number;
  formData: FormData;
}): Promise<ProductDetailForAdminDTO> {
  const response = await api.put(`/admin/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

/**
 * <summary>
 * Page component for editing an existing product.
 * </summary>
 * <returns>Renders the ProductForm in edit mode, pre-filled with data.</returns>
 */
export default function AdminEditProductPage() {
  const params = useParams();
  const productId = params.id ? parseInt(params.id as string) : null;

  const { data: initialData, isLoading: isFetching, isError } = useProductDetailsQuery(productId);

  const updateMutation = useMutation<
    ProductDetailForAdminDTO,
    Error,
    { id: number; formData: FormData }
  >({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully!");
    },
    onError: (error) => {
      console.error("Update product failed:", error);
      toast.error("Error updating product. Check server logs.");
    },
  });

  const handleSubmit = async (formData: FormData) => {
    if (productId) {
      await updateMutation.mutateAsync({ id: productId, formData });
    }
  };

  if (isFetching || !productId)
    return (
      <div className="text-center py-10 text-lg">
        <FaSpinner className="animate-spin inline mr-2" /> Loading product details...
      </div>
    );
  if (isError || !initialData)
    return (
      <div className="text-center py-10 text-xl text-red-600">Error or Product not found.</div>
    );

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm
        isEdit={true}
        productId={productId}
        initialData={initialData}
        onSubmitForm={handleSubmit}
        isLoading={updateMutation.isPending}
      />
    </>
  );
}