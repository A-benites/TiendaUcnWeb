"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

/**
 * <summary>
 * Async function to handle product creation via API.
 * </summary>
 * <param name="formData">The FormData object containing fields and files.</param>
 * <returns>A Promise resolving to the ID of the created product.</returns>
 */
async function createProduct(formData: FormData): Promise<number> {
  const response = await api.post("/admin/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data as number;
}

/**
 * <summary>
 * Page component for creating a new product.
 * </summary>
 * <returns>Renders the ProductForm in creation mode.</returns>
 */
export default function AdminNewProductPage() {
  const router = useRouter();

  const createMutation = useMutation<number, Error, FormData>({
    mutationFn: createProduct,
    onSuccess: (newProductId) => {
      toast.success("Product created successfully!");
      router.push(`/admin/products/edit/${newProductId}`);
    },
    onError: (error) => {
      console.error("Create product failed:", error);
      toast.error("Error creating product. Check server logs.");
    },
  });

  const handleSubmit = async (formData: FormData) => {
    await createMutation.mutateAsync(formData);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <ProductForm
        isEdit={false}
        onSubmitForm={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </>
  );
}