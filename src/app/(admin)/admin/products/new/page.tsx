

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { api } from "@/lib/axios";
import toast from "react-hot-toast";

/**
 * Función de mutación para crear un producto.
 * @param formData El objeto FormData que contiene los campos del producto y los archivos de imagen.
 */
async function createProduct(formData: FormData): Promise<number> {
  const response = await api.post("/admin/products", formData, {
    headers: {
      // El Content-Type debe ser 'multipart/form-data' para FormData
      "Content-Type": "multipart/form-data",
    },
  });
  // Asume que el backend devuelve el ID del producto creado en response.data.data
  return response.data.data as number;
}

/**
 * Página para crear un nuevo producto.
 */
export default function AdminNewProductPage() {
  const router = useRouter();

  const createMutation = useMutation<number, Error, FormData>({
    mutationFn: createProduct,
    onSuccess: (newProductId) => {
      toast.success("Product created successfully!");
      // Redirigir a la página de edición o al listado
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
