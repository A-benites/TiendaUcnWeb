"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  // Asegurar que siempre haya al menos una imagen (o placeholder)
  const safeImages = images.length > 0 ? images : ["/placeholder.png"];
  const currentImage = safeImages[selectedIndex];

  // Funciones de navegación
  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
    setImgError(false); // Reset error on change
  }, [safeImages.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
    setImgError(false);
  }, [safeImages.length]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setImgError(false);
  };

  // Navegación por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <div className="space-y-4">
      {/* Imagen Principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100 dark:bg-gray-800 group">
        {!imgError ? (
          <Image
            src={currentImage}
            alt={`${title} - Vista ${selectedIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400">
            <span className="text-4xl">📷</span>
            <span className="text-sm mt-2">Imagen no disponible</span>
          </div>
        )}

        {/* Botones de navegación (solo si hay más de 1 imagen) */}
        {safeImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {safeImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border transition ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedIndex === index
                  ? "ring-2 ring-primary border-transparent opacity-100"
                  : "opacity-70 hover:opacity-100"
              )}
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={selectedIndex === index}
            >
              <Image
                src={img}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
