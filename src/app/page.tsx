import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, BookOpen, ShieldCheck, Zap, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 pb-32 md:pt-24 md:pb-48">
        {/* Fondo animado y decorativo */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        {/* Blobs flotantes (Luces) */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float dark:opacity-20" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float delay-1000 dark:opacity-20" />

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Badge animado */}
            <div className="animate-fade-up opacity-0 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:bg-primary/10">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Nueva Colección 2025 Disponible
            </div>

            {/* Título Principal */}
            <h1 className="animate-fade-up delay-100 opacity-0 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Tu vida universitaria <br className="hidden md:block" />
              <span className="text-gradient">con más estilo.</span>
            </h1>

            {/* Subtítulo */}
            <p className="animate-fade-up delay-200 opacity-0 text-lg md:text-xl text-muted-foreground max-w-[700px] leading-relaxed">
              Descubre polerones, accesorios y material académico oficial de la UCN. Calidad premium
              diseñada por y para estudiantes.
            </p>

            {/* Botones de Acción */}
            <div className="animate-fade-up delay-300 opacity-0 flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="h-14 px-8 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 w-full sm:w-auto group"
                >
                  Ver Catálogo
                  <ShoppingBag className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-8 text-base rounded-full border-2 hover:bg-accent hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Crear Cuenta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Stats Flotantes (Glassmorphism) */}
            <div className="animate-fade-up delay-300 opacity-0 grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 w-full max-w-3xl">
              {[
                { label: "Productos", value: "+500", icon: ShoppingBag },
                { label: "Calidad", value: "100%", icon: Star },
                { label: "Entrega", value: "24h", icon: Zap },
                { label: "Seguridad", value: "Total", icon: ShieldCheck },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-sm hover:border-primary/30 transition-colors"
                >
                  <stat.icon className="h-6 w-6 text-primary mb-2 opacity-80" />
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- CARDS SECTION (Visualmente mejorada) --- */}
      <section className="py-24 bg-muted/20 relative">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Experiencia UCN</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Más que una tienda, somos parte de tu día a día en el campus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title="Compra Segura"
              description="Tu seguridad es prioridad. Pagos encriptados y protección de datos garantizada en cada transacción."
              delay="0"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Retiro Express"
              description="Olvídate de las filas. Compra online y retira en nuestros puntos de entrega dentro del campus en minutos."
              delay="100"
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="Material Oficial"
              description="Accede a la bibliografía y materiales requeridos para tus asignaturas con descuentos exclusivos para alumnos."
              delay="200"
            />
          </div>
        </div>
      </section>

      {/* --- BANNER FINAL --- */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-purple-700 px-6 py-20 text-center sm:px-12 md:py-28 shadow-2xl">
            {/* Decoración de fondo */}
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                ¿Listo para equiparte?
              </h2>
              <p className="text-white/80 text-lg md:text-xl max-w-xl">
                Únete a la comunidad. Regístrate hoy y obtén acceso a descuentos exclusivos de
                lanzamiento.
              </p>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-14 px-10 text-lg rounded-full shadow-xl hover:scale-105 transition-transform duration-300 font-semibold"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente de Tarjeta Mejorado con animación Hover
function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div
      className={`group relative p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
