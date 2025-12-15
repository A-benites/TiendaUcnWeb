"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function OrdersError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Orders Error:", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-lg mx-auto text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-destructive">Error al cargar pedidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        Ocurrió un error inesperado al cargar tus pedidos. Por favor, intenta nuevamente.
                    </p>
                    {error.message && (
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md font-mono">
                            {error.message}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Button onClick={reset} variant="default">
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Intentar de nuevo
                        </Button>
                        <Link href="/">
                            <Button variant="outline">
                                <Home className="mr-2 h-4 w-4" />
                                Ir al inicio
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
