"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateAdminProduct } from "@/services/admin-products";
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
import { ArrowLeft, Loader2, Save, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

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
    stock: z.coerce.number().min(1, { message: "El stock debe ser al menos 1" }),
    discount: z.coerce
        .number()
        .min(0)
        .max(100, { message: "El descuento debe estar entre 0 y 100" }),
    status: z.enum(["New", "Used"], { message: "Selecciona un estado válido" }),
    categoryId: z.coerce.number().min(1, { message: "Selecciona una categoría" }),
    brandId: z.coerce.number().min(1, { message: "Selecciona una marca" }),
});

export default function CreateProductPage() {
    const router = useRouter();
    const createMutation = useCreateAdminProduct();

    // Cargar categorías y marcas
    const { items: categories, isLoading: loadingCategories } = useAdminTaxonomy("categories");
    const { items: brands, isLoading: loadingBrands } = useAdminTaxonomy("brands");

    const safeCategories = Array.isArray(categories)
        ? [...categories].sort((a, b) => a.name.localeCompare(b.name))
        : [];
    const safeBrands = Array.isArray(brands)
        ? [...brands].sort((a, b) => a.name.localeCompare(b.name))
        : [];

    // Estado para las imágenes seleccionadas
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    // Usar useForm sin tipo genérico y castear control para evitar errores de tipos
    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
            stock: 1,
            discount: 0,
            status: "New" as const,
            categoryId: 0,
            brandId: 0,
        },
    });

    // Convertir control a tipo genérico compatible
    const formControl = form.control as unknown as Control<FieldValues>;

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

        // Limitar a 5 imágenes
        const newFiles = [...selectedFiles, ...validSizeFiles].slice(0, 5);
        setSelectedFiles(newFiles);

        // Crear previews
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        // Limpiar previews antiguos
        previews.forEach((p) => URL.revokeObjectURL(p));
        setPreviews(newPreviews);
    };

    const removeFile = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = (values: z.infer<typeof productSchema>) => {
        if (selectedFiles.length === 0) {
            toast.error("Debes agregar al menos una imagen");
            return;
        }

        createMutation.mutate(
            {
                ...values,
                images: selectedFiles,
            },
            {
                onSuccess: () => {
                    toast.success("Producto creado correctamente");
                    router.push("/admin/products");
                },
                onError: () => {
                    toast.error("Error al crear el producto");
                },
            }
        );
    };

    const isLoadingTaxonomy = loadingCategories || loadingBrands;

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
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Crear Nuevo Producto</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Formulario Principal */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Información del Producto</CardTitle>
                        <CardDescription>Completa los datos del producto</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={formControl}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Título *</FormLabel>
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
                                            <FormLabel>Descripción *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe el producto..." {...field} />
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
                                                <FormLabel>Precio ($) *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="1" placeholder="0" {...field} />
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
                                                <FormLabel>Stock *</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min="1" placeholder="1" {...field} />
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
                                                    <Input type="number" min="0" max="100" placeholder="0" {...field} />
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
                                                <FormLabel>Estado *</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="New">Nuevo</SelectItem>
                                                        <SelectItem value="Used">Usado</SelectItem>
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
                                                <FormLabel>Categoría *</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value?.toString()}
                                                    disabled={isLoadingTaxonomy}
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
                                                <FormLabel>Marca *</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value?.toString()}
                                                    disabled={isLoadingTaxonomy}
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
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || selectedFiles.length === 0}
                                    >
                                        {createMutation.isPending && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        <Save className="mr-2 h-4 w-4" /> Crear Producto
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Sección de Imágenes */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ImageIcon className="h-5 w-5" /> Imágenes del Producto
                        </CardTitle>
                        <CardDescription>
                            Sube hasta 5 imágenes. La primera será la imagen principal.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Input de archivos */}
                        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                                id="image-upload"
                                disabled={selectedFiles.length >= 5}
                            />
                            <label
                                htmlFor="image-upload"
                                className={`cursor-pointer flex flex-col items-center gap-2 ${selectedFiles.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {selectedFiles.length >= 5
                                        ? "Máximo 5 imágenes"
                                        : "Haz clic para seleccionar imágenes"}
                                </span>
                            </label>
                        </div>

                        {/* Preview de imágenes */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {previews.map((preview, index) => (
                                    <div
                                        key={index}
                                        className={`relative aspect-square rounded-lg overflow-hidden border ${index === 0 ? "ring-2 ring-primary" : ""
                                            }`}
                                    >
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {index === 0 && (
                                            <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                                                Principal
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedFiles.length === 0 && (
                            <p className="text-sm text-destructive text-center">
                                * Debes agregar al menos una imagen
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
