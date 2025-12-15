import Image from "next/image";
import Link from "next/link";
import { ProductForAdminDTO, useToggleProductStatusMutation } from "@/services/admin-products";
import { Edit, Power, PowerOff, Loader2, Package } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: ProductForAdminDTO[];
}

export const ProductTable = ({ products }: ProductTableProps) => {
  const toggleMutation = useToggleProductStatusMutation();

  const handleToggleStatus = (id: number, title: string) => {
    toggleMutation.mutate(id, {
      onSuccess: () => toast.success(`Estado de "${title}" actualizado`),
    });
  };

  const cn = (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/10">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No se encontraron productos.</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista Desktop - Tabla */}
      <div className="hidden md:block rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Precio / Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden lg:table-cell">Última Edición</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const isMutating = toggleMutation.isPending && toggleMutation.variables === product.id;

              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-muted-foreground">#{product.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                        <Image
                          src={product.mainImageURL || "/placeholder.png"}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate max-w-[200px]">{product.title}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {product.brandName} - {product.categoryName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold">{product.price}</span>
                      <span
                        className={cn(
                          "text-xs",
                          product.stock < 10 ? "text-red-500" : "text-green-600"
                        )}
                      >
                        {product.stock} unids.
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.isAvailable ? "default" : "secondary"}>
                      {product.isAvailable ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs hidden lg:table-cell">
                    {format(new Date(product.updatedAt), "dd/MM/yy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(product.id, product.title)}
                        disabled={isMutating}
                      >
                        {isMutating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : product.isAvailable ? (
                          <Power className="h-4 w-4 text-green-600" />
                        ) : (
                          <PowerOff className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Vista Mobile - Cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => {
          const isMutating = toggleMutation.isPending && toggleMutation.variables === product.id;

          return (
            <div key={product.id} className="border rounded-lg p-4 bg-background space-y-3">
              <div className="flex gap-3">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted flex-shrink-0">
                  <Image
                    src={product.mainImageURL || "/placeholder.png"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {product.brandName} - {product.categoryName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={product.isAvailable ? "default" : "secondary"} className="text-xs">
                      {product.isAvailable ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Precio</p>
                    <p className="font-semibold">{product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className={cn(
                      "font-medium",
                      product.stock < 10 ? "text-red-500" : "text-green-600"
                    )}>
                      {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleToggleStatus(product.id, product.title)}
                    disabled={isMutating}
                  >
                    {isMutating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : product.isAvailable ? (
                      <Power className="h-4 w-4 text-green-600" />
                    ) : (
                      <PowerOff className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
