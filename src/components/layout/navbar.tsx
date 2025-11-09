import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">Tienda UCN</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/productos"
            >
              Productos
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/categorias"
            >
              Categorías
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/about"
            >
              Acerca de
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-2">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/carrito"
            >
              Carrito
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/login"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  );
}
