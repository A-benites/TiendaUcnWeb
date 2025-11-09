import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            &copy; {new Date().getFullYear()} Tienda UCN. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            className="text-sm text-foreground/60 transition-colors hover:text-foreground/80"
            href="/privacidad"
          >
            Privacidad
          </Link>
          <Link
            className="text-sm text-foreground/60 transition-colors hover:text-foreground/80"
            href="/terminos"
          >
            Términos
          </Link>
          <Link
            className="text-sm text-foreground/60 transition-colors hover:text-foreground/80"
            href="/contacto"
          >
            Contacto
          </Link>
        </div>
      </div>
    </footer>
  );
}
