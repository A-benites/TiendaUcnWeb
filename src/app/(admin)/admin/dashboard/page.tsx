import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Ventas Totales",
      value: "$12.450.000",
      icon: DollarSign,
      description: "+20.1% respecto al mes anterior",
    },
    {
      title: "Pedidos",
      value: "+573",
      icon: ShoppingCart,
      description: "+180 pedidos nuevos",
    },
    {
      title: "Productos",
      value: "124",
      icon: Package,
      description: "12 con bajo stock",
    },
    {
      title: "Usuarios Activos",
      value: "2,350",
      icon: Users,
      description: "+150 nuevos usuarios",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Resumen de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de ventas (Placeholder)
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Dummy recent sales */}
              <div className="flex items-center">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none truncate">Juan Pérez</p>
                  <p className="text-sm text-muted-foreground truncate">juan@email.com</p>
                </div>
                <div className="ml-auto font-medium flex-shrink-0">+$150.000</div>
              </div>
              <div className="flex items-center">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium leading-none truncate">María González</p>
                  <p className="text-sm text-muted-foreground truncate">maria@email.com</p>
                </div>
                <div className="ml-auto font-medium flex-shrink-0">+$45.990</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
