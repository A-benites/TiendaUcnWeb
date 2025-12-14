"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// Importamos tipos necesarios de react-hook-form
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminProductDetail, useAdminUpdateProduct } from "@/services/admin-products";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

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
    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

const productSchema = z.object({
  title: z.string().min(3, { message: "El título es muy corto" }),
  description: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  price: z.coerce.number().min(1, { message: "El precio debe ser mayor a 0" }),
  stock: z.coerce.number().min(0, { message: "El stock no puede ser negativo" }),
  discount: z.coerce.number().min(0).max(100, { message: "El descuento debe estar entre 0 y 100" }),
  status: z.coerce.number(),
});

// LÍNEA ELIMINADA: type ProductFormValues = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params?.id;
  const productId = Number(Array.isArray(rawId) ? rawId[0] : rawId);

  const { data: product, isLoading, isError } = useAdminProductDetail(productId);
  const updateMutation = useAdminUpdateProduct();

  // CORRECCIÓN 1: Quitamos el genérico <ProductFormValues> para evitar conflicto de tipos con el resolver
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      stock: 0,
      discount: 0,
      status: 1,
    },
  });

  // CORRECCIÓN 2: Convertimos el control a un tipo genérico compatible para evitar errores en los <FormField>
  // Usamos 'unknown' como paso intermedio seguro en lugar de 'any' directo
  const formControl = form.control as unknown as Control<FieldValues>;

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title || "",
        description: product.description || "",
        price: safeParse(product.price),
        stock: safeParse(product.stock),
        discount: safeParse(product.discount),
        status: safeParse(product.status) === 0 ? 0 : 1,
      });
    }
  }, [product, form]);

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

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Editar Producto #{productId}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Usamos formControl en todos los campos */}
                <FormField
                  control={formControl}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Título del Producto</FormLabel>
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
                    <FormItem className="col-span-2">
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detalles del producto..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      <FormLabel>Stock Disponible</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formControl}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descuento (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>Ingresa 0 para sin descuento.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formControl}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona estado" />
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

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
