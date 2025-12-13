/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaImage, FaTrash, FaCheckCircle, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";

// Importaciones de validación y servicios
import { ProductFormSchema, ProductFormValues } from "@/lib/validation/productSchema";
import { ProductDetailForAdminDTO, ProductImageDTO } from "@/services/admin-products";
import { useBrandsQuery, useCategoriesQuery } from "@/services/admin-form-data";

import ImageUploadPreview from "@/components/ui/ImageUploadPreview";

// Interfaz local para manejar el estado visual (isDeleted)
interface ProductImageUI extends ProductImageDTO {
  isDeleted: boolean;
}

interface ProductFormProps {
  initialData?: ProductDetailForAdminDTO;
  isEdit: boolean;
  productId?: number;
  onSubmitForm: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 2;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ProductForm = ({ initialData, isEdit, onSubmitForm, isLoading }: ProductFormProps) => {
  const [fileList, setFileList] = useState<File[]>([]);

  // Inicialización segura del estado de imágenes
  const [existingImagesState, setExistingImagesState] = useState<ProductImageUI[]>(() => {
    if (initialData?.images) {
      return initialData.images.map((img) => ({
        ...img,
        isDeleted: false,
      }));
    }
    return [];
  });

  // Fetch de datos auxiliares
  const { data: categories } = useCategoriesQuery();
  const { data: brands } = useBrandsQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<ProductFormValues>({
    // Corrección de tipos estricta para Zod
    resolver: zodResolver(ProductFormSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData ? parseFloat(initialData.price.toString().replace(/[$,]/g, "")) : 0,
      discount: initialData?.discount || 0,
      stock: initialData?.stock || 0,
      categoryId: initialData?.categoryId || 0,
      brandId: initialData?.brandId || 0,

      mainImageKey: initialData?.mainImageURL
        ? initialData.images.find((img) => img.url === initialData.mainImageURL)?.id.toString()
        : "",

      newImages: [],
      existingImages:
        initialData?.images.map((img) => ({
          id: img.id,
          url: img.url,
          isDeleted: false,
        })) || [],
    },
    mode: "onChange",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const activeExistingCount = existingImagesState.filter((img) => !img.isDeleted).length;
    const totalImages = fileList.length + activeExistingCount;

    if (totalImages + files.length > MAX_IMAGES) {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const validFiles = files.filter((file) => {
      const isSizeValid = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;
      const isTypeValid = ALLOWED_MIME_TYPES.includes(file.type);

      if (!isSizeValid) toast.error(`File ${file.name} is too large (>2MB).`);
      if (!isTypeValid) toast.error(`File ${file.name} format not supported.`);

      return isSizeValid && isTypeValid;
    });

    const newFileList = [...fileList, ...validFiles];
    setFileList(newFileList);
    setValue("newImages", newFileList, { shouldValidate: true });

    if (!getValues("mainImageKey") && newFileList.length > 0 && activeExistingCount === 0) {
      setValue("mainImageKey", "new-0");
    }
    event.target.value = "";
  };

  const handleRemoveExisting = (id: number) => {
    setExistingImagesState((prev) =>
      prev.map((img) => (img.id === id ? { ...img, isDeleted: true } : img))
    );

    const currentExisting = getValues("existingImages") || [];
    setValue(
      "existingImages",
      currentExisting.map((img) => (img.id === id ? { ...img, isDeleted: true } : img))
    );

    if (getValues("mainImageKey") === id.toString()) {
      setValue("mainImageKey", "");
    }
  };

  const handleRemoveNew = (index: number) => {
    const newFiles = fileList.filter((_, i) => i !== index);
    setFileList(newFiles);
    setValue("newImages", newFiles);

    if (getValues("mainImageKey") === `new-${index}`) {
      setValue("mainImageKey", "");
    }
  };

  const onSubmit: SubmitHandler<ProductFormValues> = useCallback(
    async (data) => {
      const formData = new FormData();

      formData.append("Title", data.title);
      formData.append("Description", data.description);
      formData.append("Price", data.price.toString());
      formData.append("Discount", data.discount.toString());
      formData.append("Stock", data.stock.toString());
      formData.append("CategoryId", data.categoryId.toString());
      formData.append("BrandId", data.brandId.toString());

      data.newImages?.forEach((file) => {
        formData.append("Images", file);
      });

      const deletedImageIds = data.existingImages
        ?.filter((img) => img.isDeleted)
        .map((img) => img.id);

      if (isEdit && deletedImageIds && deletedImageIds.length > 0) {
        deletedImageIds.forEach((id) => {
          formData.append("ImagesToDelete", id.toString());
        });
      }

      const mainImageKey = data.mainImageKey;
      if (mainImageKey) {
        if (!isNaN(Number(mainImageKey))) {
          formData.append("MainImageId", mainImageKey);
        } else {
          formData.append("NewMainImageKey", mainImageKey);
        }
      }

      await onSubmitForm(formData);
    },
    [isEdit, onSubmitForm]
  );

  const activeExistingImages = existingImagesState.filter((img) => !img.isDeleted);
  const totalImagesCount = activeExistingImages.length + fileList.length;

  const combinedPreviews = [
    ...activeExistingImages.map((img) => ({
      url: img.url,
      id: img.id.toString(),
      isMain: getValues("mainImageKey") === img.id.toString(),
    })),
    ...fileList.map((file, index) => ({
      url: URL.createObjectURL(file),
      id: `new-${index}`,
      isMain: getValues("mainImageKey") === `new-${index}`,
    })),
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
        {isEdit ? `Edit Product` : "Create New Product"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title</label>
          <input
            {...register("title")}
            placeholder="e.g., Wireless Noise Cancelling Headphones"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
          <input
            {...register("price")}
            type="number"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
          <input
            {...register("stock")}
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
        </div>

        {/* ⚠️ CORRECCIÓN APLICADA AQUÍ: CATEGORY SELECT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            {...register("categoryId")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="0">Select a Category</option>
            {/* Verificamos que sea un array antes de hacer map */}
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>

        {/* ⚠️ CORRECCIÓN APLICADA AQUÍ: BRAND SELECT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
          <select
            {...register("brandId")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="0">Select a Brand</option>
            {/* Verificamos que sea un array antes de hacer map */}
            {Array.isArray(brands) &&
              brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
          </select>
          {errors.brandId && <p className="text-red-500 text-sm mt-1">{errors.brandId.message}</p>}
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Discount (%)</label>
          <input
            {...register("discount")}
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          {errors.discount && (
            <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe the product features, specifications, etc."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Image Management Section */}
      <div className="border-2 border-dashed border-gray-200 p-6 rounded-xl bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            Product Gallery
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({totalImagesCount} / {MAX_IMAGES} images)
            </span>
          </h3>
          {errors.mainImageKey && (
            <span className="text-red-500 text-sm font-medium bg-red-50 px-2 py-1 rounded">
              {errors.mainImageKey.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {combinedPreviews.map((item, index) => (
            <div
              key={item.id}
              className="relative group rounded-lg overflow-hidden shadow-md aspect-square bg-white"
            >
              <ImageUploadPreview url={item.url} isMain={item.isMain} />

              <button
                type="button"
                onClick={() =>
                  isNaN(Number(item.id))
                    ? handleRemoveNew(index - activeExistingImages.length)
                    : handleRemoveExisting(Number(item.id))
                }
                className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                title="Remove Image"
              >
                <FaTrash size={14} />
              </button>

              <label
                className={`absolute bottom-0 w-full text-center text-xs py-2 cursor-pointer transition-colors ${
                  item.isMain
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-gray-800/60 text-white hover:bg-gray-800"
                }`}
              >
                <input
                  type="radio"
                  {...register("mainImageKey")}
                  value={item.id}
                  onChange={(e) => setValue("mainImageKey", e.target.value)}
                  checked={getValues("mainImageKey") === item.id}
                  className="hidden"
                />
                {item.isMain ? "★ Main Image" : "Set as Main"}
              </label>
            </div>
          ))}

          {totalImagesCount < MAX_IMAGES && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-square cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all group">
              <div className="bg-white p-3 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <FaImage className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="text-xs font-semibold text-gray-600">Upload Image</span>
              <span className="text-[10px] text-gray-400 mt-1">Max {MAX_FILE_SIZE_MB}MB</span>
              <input
                type="file"
                multiple
                accept={ALLOWED_MIME_TYPES.join(",")}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <FaCheckCircle className="mr-2" />
              {isEdit ? "Save Changes" : "Create Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};
