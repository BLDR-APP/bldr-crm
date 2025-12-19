import { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  recurring?: "monthly" | "yearly";
}

const mockIncomes: Transaction[] = [
  { id: 1, description: "Assinaturas Apple", amount: 45000, date: "2024-01-15", category: "Assinaturas", type: "income" },
  { id: 2, description: "Pagamentos Stripe", amount: 32000, date: "2024-01-14", category: "Pagamentos", type: "income" },
  { id: 3, description: "Licenças Enterprise", amount: 15000, date: "2024-01-10", category: "B2B", type: "income" },
];

const mockExpenses: Transaction[] = [
  { id: 1, description: "Servidores AWS", amount: 8500, date: "2024-01-15", category: "Infraestrutura", type: "expense", recurring: "monthly" },
  { id: 2, description: "Folha de Pagamento", amount: 45000, date: "2024-01-05", category: "RH", type: "expense", recurring: "monthly" },
  { id: 3, description: "Marketing Digital", amount: 12000, date: "2024-01-12", category: "Marketing", type: "expense" },
  { id: 4, description: "Ferramentas SaaS", amount: 3200, date: "2024-01-08", category: "Software", type: "expense", recurring: "monthly" },
];

const categories = ["Infraestrutura", "RH", "Marketing", "Software", "Jurídico", "Outros"];

const Finance = () => {
  const [expenses, setExpenses] = useState<Transaction[]>(mockExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    recurring: false,
    recurringType: "monthly" as "monthly" | "yearly",
  });

  const totalIncome = mockIncomes.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.date && newExpense.category) {
      const newId = Math.max(...expenses.map((e) => e.id)) + 1;
      setExpenses([
        ...expenses,
        {
          id: newId,
          description: newExpense.description,
          amount: parseFloat(newExpense.amount),
          date: newExpense.date,
          category: newExpense.category,
          type: "expense",
          recurring: newExpense.recurring ? newExpense.recurringType : undefined,
        },
      ]);
      setNewExpense({
        description: "",
        amount: "",
        date: "",
        category: "",
        recurring: false,
        recurringType: "monthly",
      });
      setIsDialogOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground">Fluxo de caixa e gestão financeira</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="income">Receitas</TabsTrigger>
            <TabsTrigger value="expenses">Despesas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="stat-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Receitas
                  </CardTitle>
                  <ArrowUpRight className="h-5 w-5 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Despesas
                  </CardTitle>
                  <ArrowDownLeft className="h-5 w-5 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</div>
                </CardContent>
              </Card>

              <Card className="stat-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Lucro Líquido
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(netProfit)}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Receitas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Descrição</TableHead>
                      <TableHead className="text-muted-foreground">Categoria</TableHead>
                      <TableHead className="text-muted-foreground">Data</TableHead>
                      <TableHead className="text-right text-muted-foreground">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIncomes.map((income) => (
                      <TableRow key={income.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{income.description}</TableCell>
                        <TableCell className="text-muted-foreground">{income.category}</TableCell>
                        <TableCell className="text-muted-foreground">{income.date}</TableCell>
                        <TableCell className="text-right text-success font-medium">
                          {formatCurrency(income.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gold">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Despesa
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Nova Despesa</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        placeholder="Ex: Servidores AWS"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Valor (R$)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newExpense.amount}
                          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                          placeholder="0,00"
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newExpense.date}
                          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="recurring">Recorrente</Label>
                      <Switch
                        id="recurring"
                        checked={newExpense.recurring}
                        onCheckedChange={(checked) => setNewExpense({ ...newExpense, recurring: checked })}
                      />
                    </div>
                    {newExpense.recurring && (
                      <div className="space-y-2">
                        <Label>Frequência</Label>
                        <Select
                          value={newExpense.recurringType}
                          onValueChange={(value: "monthly" | "yearly") =>
                            setNewExpense({ ...newExpense, recurringType: value })
                          }
                        >
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="monthly">Mensal</SelectItem>
                            <SelectItem value="yearly">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button variant="gold" className="w-full" onClick={handleAddExpense}>
                      Adicionar Despesa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">Descrição</TableHead>
                      <TableHead className="text-muted-foreground">Categoria</TableHead>
                      <TableHead className="text-muted-foreground">Data</TableHead>
                      <TableHead className="text-muted-foreground">Recorrência</TableHead>
                      <TableHead className="text-right text-muted-foreground">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{expense.description}</TableCell>
                        <TableCell className="text-muted-foreground">{expense.category}</TableCell>
                        <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {expense.recurring === "monthly"
                            ? "Mensal"
                            : expense.recurring === "yearly"
                            ? "Anual"
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-destructive font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Finance;
