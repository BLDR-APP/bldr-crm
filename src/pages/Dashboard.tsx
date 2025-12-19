import { TrendingUp, TrendingDown, DollarSign, Users, Percent, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import MainLayout from "@/components/layout/MainLayout";

const chartData = [
  { month: "Jan", receita: 45000, despesas: 28000 },
  { month: "Fev", receita: 52000, despesas: 31000 },
  { month: "Mar", receita: 48000, despesas: 29000 },
  { month: "Abr", receita: 61000, despesas: 35000 },
  { month: "Mai", receita: 55000, despesas: 32000 },
  { month: "Jun", receita: 67000, despesas: 38000 },
];

const recentActivities = [
  { id: 1, action: "Nova assinatura", user: "João Silva", time: "Há 5 min", type: "success" },
  { id: 2, action: "Reunião agendada", user: "Maria Santos", time: "Há 30 min", type: "info" },
  { id: 3, action: "Pagamento recebido", user: "Apple Inc.", time: "Há 1 hora", type: "success" },
  { id: 4, action: "Tarefa concluída", user: "Carlos Lima", time: "Há 2 horas", type: "info" },
  { id: 5, action: "Cancelamento", user: "Ana Costa", time: "Há 3 horas", type: "warning" },
];

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Card className="stat-card">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="flex items-center gap-1 mt-1">
        {changeType === "up" ? (
          <TrendingUp className="h-4 w-4 text-success" />
        ) : (
          <TrendingDown className="h-4 w-4 text-destructive" />
        )}
        <span
          className={`text-sm ${changeType === "up" ? "text-success" : "text-destructive"}`}
        >
          {change}
        </span>
        <span className="text-sm text-muted-foreground">vs mês anterior</span>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Faturamento"
            value="R$ 67.400"
            change="+12.5%"
            changeType="up"
            icon={DollarSign}
          />
          <StatCard
            title="Despesas"
            value="R$ 38.200"
            change="+8.2%"
            changeType="up"
            icon={Activity}
          />
          <StatCard
            title="Lucro Líquido"
            value="R$ 29.200"
            change="+18.3%"
            changeType="up"
            icon={TrendingUp}
          />
          <StatCard
            title="Taxa de Churn"
            value="2.4%"
            change="-0.8%"
            changeType="down"
            icon={Percent}
          />
        </div>

        {/* Chart and Activities */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Receitas vs Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 18%)" />
                    <XAxis dataKey="month" stroke="hsl(0, 0%, 60%)" />
                    <YAxis stroke="hsl(0, 0%, 60%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 7%)",
                        border: "1px solid hsl(0, 0%, 18%)",
                        borderRadius: "8px",
                        color: "hsl(0, 0%, 95%)",
                      }}
                      formatter={(value: number) =>
                        `R$ ${value.toLocaleString("pt-BR")}`
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="receita"
                      name="Receita"
                      stroke="#D4AF37"
                      strokeWidth={3}
                      dot={{ fill: "#D4AF37", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: "#D4AF37" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="despesas"
                      name="Despesas"
                      stroke="hsl(0, 0%, 50%)"
                      strokeWidth={2}
                      dot={{ fill: "hsl(0, 0%, 50%)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-success"
                          : activity.type === "warning"
                          ? "bg-primary"
                          : "bg-muted-foreground"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
