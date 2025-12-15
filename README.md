
# 🛍️ Tienda UCN Web

Aplicación web de comercio electrónico desarrollada con Next.js 16, React 19, TypeScript y TailwindCSS.

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación](#-instalación)
- [Configuración (Crítico)](#%EF%B8%8F-configuración-crítico)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Características](#-características)
- [Seguridad y Middleware](#-seguridad-y-middleware)
- [Solución de Problemas](#-solución-de-problemas)
- [Scripts Disponibles](#-scripts-disponibles)
- [Equipo](#-equipo)

## 🔧 Requisitos Previos

Asegúrate de tener instalado en tu sistema:

- **Node.js** >= 18.17.0 (se recomienda la última versión LTS)
- **npm** >= 9.0.0
- **Git** para clonar el repositorio
- **Backend API**: Debes clonar y ejecutar el repositorio del backend: [TiendaUcnApi](https://github.com/A-benites/TiendaUcnApi)

> ⚠️ **Importante:** Esta aplicación frontend requiere que la API backend esté corriendo. Asegúrate de clonar ambos repositorios y levantar el backend antes de iniciar esta aplicación.

## 🚀 Tecnologías Utilizadas

- **Core:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [TailwindCSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Estado Global:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Estado Servidor:** [TanStack Query](https://tanstack.com/query/latest)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Formularios:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Autenticación:** [NextAuth.js](https://next-auth.js.org/)
- **PDF:** [@react-pdf/renderer](https://react-pdf.org/)
- **Calidad de Código:** [ESLint](https://eslint.org/), [Husky](https://typicode.github.io/husky/) + [Commitlint](https://commitlint.js.org/)

## 📦 Instalación

### 1. Clonar ambos repositorios

**Primero el Backend (Requerido):**

```bash
git clone https://github.com/A-benites/TiendaUcnApi.git
cd TiendaUcnApi
# Sigue las instrucciones del README del backend para configurarlo
```

Luego este Frontend:

```bash
git clone https://github.com/A-benites/TiendaUcnWeb.git
cd TiendaUcnWeb
```

2. Instalar dependencias del frontend:

```bash
npm install
```

## ⚙️ Configuración (Crítico)

El sistema de seguridad fallará si esto no está configurado correctamente.

### 1. Crear archivo de variables de entorno

Copia el archivo de plantilla .env.local a .env:

```bash
cp .env.local .env
```

### 2. Configurar variables en .env

Edita el archivo .env con los siguientes valores. Es fundamental para que la autenticación y el middleware funcionen.

```env
# --------------------------------------------------------
# 1. CONEXIÓN CON BACKEND
# --------------------------------------------------------
# URL donde está corriendo tu API .NET (sin barra al final)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# --------------------------------------------------------
# 2. SEGURIDAD NEXTAUTH (OBLIGATORIO)
# --------------------------------------------------------
# URL base de tu frontend (http://localhost:3000 en desarrollo)
# Requerido para que los callbacks de autenticación funcionen correctamente.
NEXTAUTH_URL=http://localhost:3000

# CLAVE MAESTRA DE ENCRIPTACIÓN
# Debe ser una cadena aleatoria de al menos 32 caracteres.
# Esta clave encripta las cookies de sesión del usuario.
# Genera una ejecutando en tu terminal: openssl rand -base64 32
NEXTAUTH_SECRET=pega_aqui_tu_codigo_generado_de_32_caracteres_o_mas

# (Opcional) Activa logs detallados de autenticación en la consola si tienes errores
NEXTAUTH_DEBUG=true
```

🛑 **Nota sobre NEXTAUTH_SECRET:** No uses contraseñas simples como "123456". Si la clave es débil o no coincide con la configuración esperada, las sesiones podrían invalidarse o fallar en producción.

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

### Modo Producción

Para probar el rendimiento real (sin hot-reload):

```bash
npm run build
npm run start
```

### Linting (Revisión de código)

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
TiendaUcnWeb/
├── public/                 # Archivos estáticos (imágenes, favicon)
├── src/
│   ├── app/                # Next.js App Router (Rutas y Páginas)
│   │   ├── (admin)/        # Rutas protegidas de administrador
│   │   ├── (protected)/    # Rutas protegidas de cliente (perfil, pedidos)
│   │   └── api/            # Endpoints internos (NextAuth)
│   ├── components/         # Componentes reutilizables
│   │   ├── admin/          # Tablas y formularios de admin
│   │   ├── cart/           # Componentes del carrito
│   │   ├── common/         # Componentes compartidos (ProductCard, etc.)
│   │   ├── layout/         # Navbar, Footer
│   │   ├── orders/         # Historial de pedidos y PDF
│   │   ├── products/       # Catálogo y detalles
│   │   └── ui/             # Componentes base (shadcn/ui)
│   ├── hooks/              # Hooks personalizados (Lógica de negocio)
│   ├── lib/                # Utilidades (Instancia Axios, formatters)
│   ├── middleware.ts       # 🔒 GUARDIÁN DE SEGURIDAD (Protección de rutas)
│   ├── models/             # Tipos e Interfaces TypeScript
│   ├── providers/          # Proveedores de Contexto (Auth, Query)
│   ├── services/           # Llamadas a la API Backend
│   └── stores/             # Estado Global (Zustand)
├── .env                    # Variables de entorno
├── next.config.ts          # Configuración de Next.js
├── package.json            # Dependencias y scripts
└── tsconfig.json           # Configuración de TypeScript
```

## ✨ Características

### ✅ Funcionalidades Implementadas

- **Catálogo de Productos:** Grilla responsiva con paginación y filtrado desde el servidor (/products).
- **Búsqueda Avanzada:** Búsqueda en tiempo real por nombre, categoría, marca y precio usando Deep Linking en la URL.
- **Detalle de Producto:** Galería de imágenes, validación de stock y cálculo de descuentos.
- **Autenticación Segura:** Flujos de Login/Registro usando JWT vía NextAuth.js.
- **Verificación de Email:** Flujo OTP (código de un solo uso) para activación de cuentas (/auth/verify-email).
- **Recuperación de Contraseña:** Flujo seguro para restablecer credenciales.
- **Carrito de Compras:** Estado persistente vía Zustand + LocalStorage con validación de stock en tiempo real.
- **Proceso de Checkout:** Validación integrada con el backend y reserva de stock.
- **Historial de Pedidos:** Visualización de pedidos pasados, seguimiento de estado y Generación de recibos PDF.
- **Panel Administrativo:**
  - Dashboard con métricas clave.
  - CRUD completo de Productos (con subida de múltiples imágenes).
  - Gestión de Categorías y Marcas.
  - Gestión de Pedidos (actualización de estados).
- **UX/UI:** Estados de carga (Skeletons) y notificaciones (Toasts) para una experiencia fluida.
- **Validación de Commits:** Uso de Conventional Commits con Husky.

## 🔒 Seguridad y Middleware

El proyecto implementa una arquitectura de seguridad robusta en tres capas:

- **Middleware de Borde** (`src/middleware.ts`):
  - Intercepta cada petición a /admin/*, /checkout, /profile y /orders antes de que se renderice la página.
  - Desencripta el token de sesión usando NEXTAUTH_SECRET.
  - Verifica el Rol del usuario.
  - **Acción:** Si el usuario no es administrador e intenta entrar a /admin, es redirigido inmediatamente al inicio.
- **Protección de Cliente (ProtectedLayout):**
  - Verifica la sesión en el navegador para mejorar la experiencia de usuario y evitar destellos de contenido no autorizado.
- **Control de Acceso Basado en Roles (RBAC):**
  - Elementos de la interfaz (como botones de "Editar" o enlaces al "Panel Admin") se ocultan automáticamente para usuarios sin privilegios.

## ❓ Solución de Problemas

- **Error: "Server error / Configuration" al iniciar sesión:**
  - *Causa:* Falta NEXTAUTH_SECRET o NEXTAUTH_URL en el archivo .env.
  - *Solución:* Revisa la sección de configuración, asegúrate de que las variables existan y reinicia la terminal.
- **Error: Redirección infinita o Login fallido:**
  - *Causa:* El backend no está corriendo, o la hora del sistema es incorrecta (lo que invalida el JWT).
  - *Solución:* Verifica que http://localhost:5000/api responda correctamente a peticiones.
- **Error: Imágenes no cargan:**
  - *Causa:* Dominios externos no configurados.
  - *Solución:* Si usas Cloudinary u otro servicio, asegúrate de que el dominio esté permitido en next.config.ts.

## 📜 Scripts Disponibles

| Comando           | Descripción                                 |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Inicia el servidor de desarrollo            |
| `npm run build`   | Compila la aplicación para producción       |
| `npm run start`   | Inicia el servidor de producción            |
| `npm run lint`    | Ejecuta ESLint para revisar código          |
| `npm run prepare` | Configura Husky (se ejecuta automáticamente)|

## 👥 Equipo

- Amir Benites (amir.benites@alumnos.ucn.cl)

- Álvaro Zapana (alvaro.zapana@alumnos.ucn.cl)

- Sebastian Campodónico (sebastian.campodonico@alumnos.ucn.cl)
