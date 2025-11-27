"use client";

import { useSyncExternalStore, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  X,
  Package,
  LayoutGrid,
  Info,
  UserCircle,
  LogIn,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const emptySubscribe = () => () => {};

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidratación segura - esto retorna true solo en cliente después del mount
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Auth store
  const { isAuthenticated, user, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Hidratar stores en el cliente
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    router.push("/");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/products", label: "Productos", icon: Package },
    { href: "/categories", label: "Categorías", icon: LayoutGrid },
    { href: "/about", label: "Acerca de", icon: Info },
  ];

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-screen-2xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              TU
            </div>
            <span className="hidden sm:inline">Tienda UCN</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-2">
            {/* Carrito */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {isClient && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Auth Section */}
            {isClient && isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {getUserInitials()}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium leading-none">{user.firstName}</span>
                      <span className="text-xs text-muted-foreground leading-none mt-0.5">
                        {user.email}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <UserCircle className="h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                    className="cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Carrito Mobile */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {isClient && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 py-4 space-y-4 animate-in slide-in-from-top-2">
            {/* Nav Links */}
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-border/40 pt-4">
              {isClient && isAuthenticated && user ? (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  {/* User Links */}
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <UserCircle className="h-5 w-5" />
                    Mi Perfil
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                  >
                    <Package className="h-5 w-5" />
                    Mis Pedidos
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <LogIn className="h-4 w-4" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start gap-2">
                      <User className="h-4 w-4" />
                      Registrarse
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
