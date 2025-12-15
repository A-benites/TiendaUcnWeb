"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAdminProductDetail,
  useAdminUpdateProduct,
  useUploadProductImages,
  useDeleteProductImage,
} from "@/services/admin-products";
import { useAdminTaxonomy } from "@/services/admin-taxonomy";

// Componentes UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save, Upload, X, ImageIcon, Trash2, AlertTriangle } from "lucide-react";
import Image from "next/image";

// Función auxiliar para parsear números de forma segura
const safeParse = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  const clean = value.toString().replace(/[^0-9]/g, "");
  return parseInt(clean, 10) || 0;
};

// Fallback para Textarea
const Textarea = (props: React.ComponentProps<"textarea">) => (
  <textarea
    {...props}
    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

const productSchema = z.object({
  title: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres" })
    .max(50, { message: "El título no puede exceder 50 caracteres" }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(100, { message: "La descripción no puede exceder 100 caracteres" }),
  price: z.coerce.number().min(1, { message: "El precio debe ser mayor a 0" }),
  stock: z.coerce.number().min(0, { message: "El stock no puede ser negativo" }),
  discount: z.coerce.number().min(0).max(100, { message: "El descuento debe estar entre 0 y 100" }),
  status: z.coerce.number(),
  categoryId: z.coerce.number().optional(),
  brandId: z.coerce.number().optional(),
});

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id;
  const productId = Number(Array.isArray(rawId) ? rawId[0] : rawId);

  // Queries y Mutations
  const { data: product, isLoading, isError, refetch } = useAdminProductDetail(productId);
  const updateMutation = useAdminUpdateProduct();
  const uploadImagesMutation = useUploadProductImages();
  const deleteImageMutation = useDeleteProductImage();

  // Cargar categorías y marcas
  const { items: categories } = useAdminTaxonomy("categories");
  const { items: brands } = useAdminTaxonomy("brands");

  const safeCategories = Array.isArray(categories)
    ? [...categories].sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const safeBrands = Array.isArray(brands)
    ? [...brands].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Estado para nuevas imágenes
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageToDelete, setImageToDelete] = useState<{ id: number; url: string } | null>(null);

  // CORRECCIÓN: Quitamos el genérico para evitar conflicto de tipos con el resolver
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      discount: 0,
      status: 1,
      categoryId: 0,
      brandId: 0,
    },
  });

  // Convertimos el control a un tipo genérico compatible
  const formControl = form.control as unknown as Control<FieldValues>;

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title || "",
        description: product.description || "",
        price: safeParse(product.price),
        stock: safeParse(product.stock),
        discount: safeParse(product.discount),
        status: product.isAvailable ? 1 : 0,
        categoryId: product.categoryId || 0,
        brandId: product.brandId || 0,
      });
    }
  }, [product, form]);

  // Limpiar previews cuando el componente se desmonte
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p));
    };
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validar tipo de archivo
    const validTypesFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validTypesFiles.length !== files.length) {
      toast.error("Solo se permiten archivos de imagen");
    }

    // Validar tamaño de archivo (máx 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validSizeFiles = validTypesFiles.filter((file) => file.size <= maxSize);

    if (validSizeFiles.length !== validTypesFiles.length) {
      toast.error("Algunos archivos exceden el tamaño máximo permitido (10MB)");
    }

    const updatedFiles = [...newFiles, ...validSizeFiles];
    setNewFiles(updatedFiles);

    const newPreviews = validSizeFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadNewImages = () => {
    if (newFiles.length === 0) return;

    uploadImagesMutation.mutate(
      { productId, files: newFiles },
      {
        onSuccess: () => {
          setNewFiles([]);
          previews.forEach((p) => URL.revokeObjectURL(p));
          setPreviews([]);
          refetch();
        },
      }
    );
  };

  const confirmDeleteImage = () => {
    if (!imageToDelete) return;

    deleteImageMutation.mutate(
      { productId, imageId: imageToDelete.id },
      {
        onSuccess: () => {
          setImageToDelete(null);
          refetch();
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    updateMutation.mutate(
      { id: productId, data: values },
      {
        onSuccess: () => {
          toast.success("Producto actualizado correctamente");
          router.push("/admin/products");
        },
        onError: () => {
          toast.error("Error al actualizar el producto");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium text-destructive">No se pudo cargar el producto.</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>
    );
  }

  // Parsear imágenes existentes
  const existingImages: { id: number; url: string }[] = product.images || [];
  const displayImages =
    existingImages.length > 0
      ? existingImages
      : (product.imagesURL || []).map((url, idx) => ({ id: idx + 1, url }));

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Editar Producto #{productId}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Formulario Principal */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
            <CardDescription>Modifica los datos del producto</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={formControl}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Polerón UCN 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formControl}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detalles del producto..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={formControl}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formControl}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={formControl}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descuento (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>0 = sin descuento</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formControl}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibilidad</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(Number(val))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Activo (Visible)</SelectItem>
                            <SelectItem value="0">Inactivo (Oculto)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={formControl}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {safeCategories.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formControl}
                    name="brandId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {safeBrands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id.toString()}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Gestión de Imágenes */}
        <div className="space-y-6">
          {/* Imágenes Existentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" /> Galería de Imágenes
              </CardTitle>
              <CardDescription>
                Imágenes actuales del producto. Haz clic en el icono para eliminar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {displayImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {displayImages.map((img, index) => (
                    <div
                      key={img.id}
                      className={`relative aspect-square rounded-lg overflow-hidden border ${index === 0 ? "ring-2 ring-primary" : ""
                        }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                          Principal
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setImageToDelete(img)}
                        disabled={deleteImageMutation.isPending}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay imágenes para este producto
                </p>
              )}
            </CardContent>
          </Card>

          {/* Subir Nuevas Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" /> Agregar Imágenes
              </CardTitle>
              <CardDescription>Selecciona nuevas imágenes para el producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="new-image-upload"
                />
                <label
                  htmlFor="new-image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Haz clic para seleccionar imágenes
                  </span>
                </label>
              </div>

              {/* Preview de nuevas imágenes */}
              {previews.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {previews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border"
                      >
                        <img
                          src={preview}
                          alt={`Nueva imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewFile(index)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleUploadNewImages}
                    disabled={uploadImagesMutation.isPending}
                    className="w-full"
                  >
                    {uploadImagesMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    Subir {newFiles.length} imagen{newFiles.length > 1 ? "es" : ""}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de confirmación para eliminar imagen */}
      <AlertDialog open={!!imageToDelete} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Eliminar Imagen
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {imageToDelete && (
            <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden border">
              <Image
                src={imageToDelete.url}
                alt="Imagen a eliminar"
                fill
                className="object-cover"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteImage}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteImageMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
