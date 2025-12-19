import { TrendingUp, TrendingDown, DollarSign, Activity, Percent, Loader2 } from "lucide-react";
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
import { useTransactions } from "@/hooks/useTransactions";
import { useActivities } from "@/hooks/useActivities";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const StatCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Card className="stat-card">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {change && changeType && (
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
      )}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { transactions, loading: loadingTransactions, totalIncome, totalExpenses } = useTransactions();
  const { activities, loading: loadingActivities } = useActivities();

  const loading = loadingTransactions || loadingActivities;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const netProfit = totalIncome - totalExpenses;

  // Group transactions by month for chart
  const chartData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString("pt-BR", { month: "short" });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      if (t.type === "income") {
        existing.receita += Number(t.amount);
      } else {
        existing.despesas += Number(t.amount);
      }
    } else {
      acc.push({
        month,
        receita: t.type === "income" ? Number(t.amount) : 0,
        despesas: t.type === "expense" ? Number(t.amount) : 0,
      });
    }
    return acc;
  }, [] as { month: string; receita: number; despesas: number }[]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

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
            value={formatCurrency(totalIncome)}
            icon={DollarSign}
          />
          <StatCard
            title="Despesas"
            value={formatCurrency(totalExpenses)}
            icon={Activity}
          />
          <StatCard
            title="Lucro Líquido"
            value={formatCurrency(netProfit)}
            icon={TrendingUp}
          />
          <StatCard
            title="Transações"
            value={transactions.length.toString()}
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
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Nenhuma transação para exibir
                  </div>
                ) : (
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
                )}
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
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma atividade recente
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        {activity.entity_name && (
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.entity_name}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
