import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Aquí verificamos el rol si el usuario ya está logueado
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    // Si intenta entrar a admin y no es admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const role = token?.user?.role?.toLowerCase();
      if (role !== "admin" && role !== "administrador") {
        // Si está logueado pero no es admin, lo mandamos al home o productos
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  },
  {
    callbacks: {
      // Esta función DEBE devolver true para permitir el acceso, o false para redirigir al login
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login", // Redirección automática si authorized devuelve false
    },
  }
);

// Aquí definimos qué rutas protege el middleware
export const config = {
  matcher: [
    "/admin/:path*", 
    "/checkout/:path*", 
    "/orders/:path*", 
    "/profile/:path*"
  ],
};