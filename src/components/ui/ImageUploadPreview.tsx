/* eslint-disable @next/next/no-img-element */
import React from "react";
import { FaStar } from "react-icons/fa"; // Importamos el ícono de estrella para el badge

interface ImageUploadPreviewProps {
  /** URL de la imagen (blob URL para archivos nuevos, o URL pública para existentes) */
  url: string;
  /** Indica si esta imagen está marcada como la imagen principal del producto. */
  isMain: boolean;
}

/**
 * Componente simple para mostrar la previsualización de una imagen en el formulario
 * de producto, incluyendo un indicador si es la imagen principal.
 */
const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ url, isMain }) => {
  return (
    <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
      {/* Imagen de previsualización */}
      <img
        src={url}
        alt="Product Preview"
        className="w-full h-full object-cover rounded-md"
        // Evitamos el error de Next.js/React si la URL es null o undefined, aunque Zod lo evita
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-error.png"; // Ruta de imagen de error local
        }}
      />

      {/* Badge de Imagen Principal */}
      {isMain && (
        <div
          className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full shadow-md flex items-center"
          title="Main Product Image"
        >
          <FaStar className="w-3 h-3 mr-1" />
          Main
        </div>
      )}
    </div>
  );
};

export default ImageUploadPreview;
