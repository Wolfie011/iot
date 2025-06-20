import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Thermometer, Wifi, AlertTriangle, Plus, TrendingUp, Battery, Shield } from "lucide-react"

export default function Dashboard() {
  // Template data for the first 4 cards
  const metricsData = [
    {
      title: "Aktywne urządzenia",
      value: "127",
      description: "Urządzenia online",
      icon: Activity,
      trend: "+12% od wczoraj",
      color: "text-green-600",
    },
    {
      title: "Temperatura średnia",
      value: "22.4°C",
      description: "Wszystkie czujniki",
      icon: Thermometer,
      trend: "Stabilna",
      color: "text-blue-600",
    },
    {
      title: "Połączenia sieciowe",
      value: "98.7%",
      description: "Dostępność sieci",
      icon: Wifi,
      trend: "+0.3% w tym tygodniu",
      color: "text-emerald-600",
    },
    {
      title: "Alerty systemowe",
      value: "3",
      description: "Wymagają uwagi",
      icon: AlertTriangle,
      trend: "-2 od wczoraj",
      color: "text-amber-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Grid - 4 columns, 3 rows */}
      <div className="grid grid-cols-4 gap-4 min-h-[600px]">
        {/* First Row - Metrics Cards */}
        {metricsData.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <p className="text-xs text-muted-foreground mb-2">{metric.description}</p>
              <div className="flex items-center text-xs">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-600">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Remaining 8 Empty Grid Items */}
        {Array.from({ length: 8 }).map((_, index) => (
          <Card
            key={`empty-${index}`}
            className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors group cursor-pointer"
          >
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[140px] p-6">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/25 group-hover:border-muted-foreground/50 group-hover:bg-muted/50 transition-all"
              >
                <Plus className="h-6 w-6 text-muted-foreground group-hover:text-foreground" />
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">Dodaj widget</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base">Status baterii</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Sprawdź poziom naładowania wszystkich urządzeń</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              <CardTitle className="text-base">Bezpieczeństwo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Przegląd zabezpieczeń i certyfikatów</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-base">Raporty</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Generuj raporty wydajności systemu</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}