import { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp, Loader2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import { useTransactions } from "@/hooks/useTransactions";

const categories = ["Infraestrutura", "RH", "Marketing", "Software", "Jurídico", "Vendas", "Outros"];

const Finance = () => {
  const { transactions, loading, addTransaction, totalIncome, totalExpenses } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
  });

  const netProfit = totalIncome - totalExpenses;

  const handleAddTransaction = async () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.date) {
      await addTransaction({
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        type: transactionType,
        category: newTransaction.category || undefined,
        date: newTransaction.date,
      });
      setNewTransaction({ description: "", amount: "", date: "", category: "" });
      setIsDialogOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const incomes = transactions.filter((t) => t.type === "income");
  const expenses = transactions.filter((t) => t.type === "expense");

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
                  <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-primary" : "text-destructive"}`}>
                    {formatCurrency(netProfit)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen && transactionType === "income"} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (open) setTransactionType("income");
              }}>
                <DialogTrigger asChild>
                  <Button variant="gold" onClick={() => setTransactionType("income")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Receita
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Nova Receita</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        placeholder="Ex: Venda de serviços"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Valor (R$)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                          placeholder="0,00"
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newTransaction.date}
                          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
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
                    <Button variant="gold" className="w-full" onClick={handleAddTransaction}>
                      Adicionar Receita
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Receitas</CardTitle>
              </CardHeader>
              <CardContent>
                {incomes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma receita registrada
                  </div>
                ) : (
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
                      {incomes.map((income) => (
                        <TableRow key={income.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{income.description}</TableCell>
                          <TableCell className="text-muted-foreground">{income.category || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{income.date}</TableCell>
                          <TableCell className="text-right text-success font-medium">
                            {formatCurrency(Number(income.amount))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen && transactionType === "expense"} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (open) setTransactionType("expense");
              }}>
                <DialogTrigger asChild>
                  <Button variant="gold" onClick={() => setTransactionType("expense")}>
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
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
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
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                          placeholder="0,00"
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newTransaction.date}
                          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
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
                    <Button variant="gold" className="w-full" onClick={handleAddTransaction}>
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
                {expenses.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma despesa registrada
                  </div>
                ) : (
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
                      {expenses.map((expense) => (
                        <TableRow key={expense.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{expense.description}</TableCell>
                          <TableCell className="text-muted-foreground">{expense.category || "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                          <TableCell className="text-right text-destructive font-medium">
                            {formatCurrency(Number(expense.amount))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Finance;
