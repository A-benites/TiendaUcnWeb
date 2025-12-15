"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { CartItem } from "@/models/cart.types";

// Helper para parsear precio (puede ser string "$1.500" o number)
const parsePrice = (price: string | number): number => {
    if (typeof price === "number") return price;
    return parseFloat(price.replace(/[^0-9]/g, "")) || 0;
};

interface CartItemRowProps {
    item: CartItem;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
    isUpdating?: boolean;
    isRemoving?: boolean;
}

export function CartItemRow({
    item,
    onUpdateQuantity,
    onRemove,
    isUpdating = false,
    isRemoving = false,
}: CartItemRowProps) {
    const unitPrice = parsePrice(item.finalPrice);
    const subtotal = unitPrice * item.quantity;

    return (
        <Card className={isRemoving ? "opacity-50" : ""}>
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Imagen del producto */}
                    <div className="relative w-full sm:w-24 h-32 sm:h-24 shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                            src={item.mainImageURL || "/placeholder.png"}
                            alt={item.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.id}`}>
                            <h3 className="font-semibold text-base sm:text-lg hover:underline line-clamp-2">
                                {item.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                            {item.brandName} · {item.categoryName}
                        </p>
                        {/* Precio unitario */}
                        <p className="text-sm text-muted-foreground mt-1">
                            Precio unitario: ${unitPrice.toLocaleString("es-CL")}
                        </p>
                        {/* Subtotal del ítem */}
                        <p className="text-lg font-bold text-primary mt-2">
                            Subtotal: ${subtotal.toLocaleString("es-CL")}
                        </p>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-2">
                        <div className="flex items-center border rounded-md order-1 sm:order-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating}
                                className="h-8 w-8"
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Minus className="h-3 w-3" />
                                )}
                            </Button>

                            <div className="w-10 text-center font-medium text-sm">{item.quantity}</div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock || isUpdating}
                                className="h-8 w-8"
                            >
                                {isUpdating ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <Plus className="h-3 w-3" />
                                )}
                            </Button>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemove(item.id)}
                            disabled={isRemoving}
                            className="text-destructive hover:text-destructive order-2 sm:order-1"
                        >
                            {isRemoving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
