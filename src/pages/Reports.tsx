import { useState, useRef } from "react";
import { Download, FileText, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import MainLayout from "@/components/layout/MainLayout";

const revenueData = [
  { month: "Jan", receita: 45000, meta: 50000 },
  { month: "Fev", receita: 52000, meta: 50000 },
  { month: "Mar", receita: 48000, meta: 55000 },
  { month: "Abr", receita: 61000, meta: 55000 },
  { month: "Mai", receita: 55000, meta: 60000 },
  { month: "Jun", receita: 67000, meta: 60000 },
];

const expensesByCategory = [
  { name: "Infraestrutura", value: 25000 },
  { name: "RH", value: 45000 },
  { name: "Marketing", value: 18000 },
  { name: "Software", value: 8000 },
  { name: "Jurídico", value: 5000 },
];

const userGrowth = [
  { month: "Jan", usuarios: 12500 },
  { month: "Fev", usuarios: 14200 },
  { month: "Mar", usuarios: 15800 },
  { month: "Abr", usuarios: 18500 },
  { month: "Mai", usuarios: 21000 },
  { month: "Jun", usuarios: 24500 },
];

const COLORS = ["#D4AF37", "#8B7355", "#A08060", "#6B5B4F", "#5A4A3A"];

const Reports = () => {
  const [period, setPeriod] = useState("6m");
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    // Create a white-label printable version
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <style>
        @media print {
          body { font-family: 'Inter', sans-serif; }
          .page { page-break-after: always; padding: 40px; }
          h1 { font-size: 24px; margin-bottom: 20px; }
          h2 { font-size: 18px; margin: 20px 0 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f5f5f5; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px; }
          .stat { display: inline-block; margin-right: 40px; }
          .stat-value { font-size: 24px; font-weight: bold; }
          .stat-label { font-size: 12px; color: #666; }
        }
      </style>
      <div class="page">
        <div class="header">
          <h1>BLDR - Relatório Financeiro</h1>
          <span>${new Date().toLocaleDateString("pt-BR")}</span>
        </div>
        
        <div style="margin-bottom: 40px;">
          <div class="stat">
            <div class="stat-value">R$ 328.000</div>
            <div class="stat-label">Receita Total (6 meses)</div>
          </div>
          <div class="stat">
            <div class="stat-value">R$ 101.000</div>
            <div class="stat-label">Despesas Totais</div>
          </div>
          <div class="stat">
            <div class="stat-value">R$ 227.000</div>
            <div class="stat-label">Lucro Líquido</div>
          </div>
          <div class="stat">
            <div class="stat-value">24.500</div>
            <div class="stat-label">Usuários Ativos</div>
          </div>
        </div>

        <h2>Receitas por Mês</h2>
        <table>
          <tr><th>Mês</th><th>Receita</th><th>Meta</th><th>Atingimento</th></tr>
          <tr><td>Janeiro</td><td>R$ 45.000</td><td>R$ 50.000</td><td>90%</td></tr>
          <tr><td>Fevereiro</td><td>R$ 52.000</td><td>R$ 50.000</td><td>104%</td></tr>
          <tr><td>Março</td><td>R$ 48.000</td><td>R$ 55.000</td><td>87%</td></tr>
          <tr><td>Abril</td><td>R$ 61.000</td><td>R$ 55.000</td><td>111%</td></tr>
          <tr><td>Maio</td><td>R$ 55.000</td><td>R$ 60.000</td><td>92%</td></tr>
          <tr><td>Junho</td><td>R$ 67.000</td><td>R$ 60.000</td><td>112%</td></tr>
        </table>

        <h2>Despesas por Categoria</h2>
        <table>
          <tr><th>Categoria</th><th>Valor</th><th>Porcentagem</th></tr>
          <tr><td>RH</td><td>R$ 45.000</td><td>44.6%</td></tr>
          <tr><td>Infraestrutura</td><td>R$ 25.000</td><td>24.8%</td></tr>
          <tr><td>Marketing</td><td>R$ 18.000</td><td>17.8%</td></tr>
          <tr><td>Software</td><td>R$ 8.000</td><td>7.9%</td></tr>
          <tr><td>Jurídico</td><td>R$ 5.000</td><td>5.0%</td></tr>
        </table>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6" ref={reportRef}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Análises detalhadas do seu negócio</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="1m">Último mês</SelectItem>
                <SelectItem value="3m">3 meses</SelectItem>
                <SelectItem value="6m">6 meses</SelectItem>
                <SelectItem value="1y">1 ano</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="gold" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold text-foreground">R$ 328.000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <TrendingUp className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Despesas Totais</p>
                  <p className="text-2xl font-bold text-foreground">R$ 101.000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lucro Líquido</p>
                  <p className="text-2xl font-bold text-success">R$ 227.000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-foreground">24.500</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Receita vs Meta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
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
                      formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR")}`}
                    />
                    <Legend />
                    <Bar dataKey="receita" name="Receita" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meta" name="Meta" fill="hsl(0, 0%, 40%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Expenses Pie Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 7%)",
                        border: "1px solid hsl(0, 0%, 18%)",
                        borderRadius: "8px",
                        color: "hsl(0, 0%, 95%)",
                      }}
                      formatter={(value: number) => `R$ ${value.toLocaleString("pt-BR")}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* User Growth Chart */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Crescimento de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
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
                      formatter={(value: number) => value.toLocaleString("pt-BR")}
                    />
                    <Line
                      type="monotone"
                      dataKey="usuarios"
                      name="Usuários"
                      stroke="#D4AF37"
                      strokeWidth={3}
                      dot={{ fill: "#D4AF37", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7, fill: "#D4AF37" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
