import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string | null;
  date: string;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTransactions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const addTransaction = async (transaction: {
    description: string;
    amount: number;
    type: string;
    category?: string;
    date: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category || null,
        date: transaction.date,
        status: "completed",
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro ao criar transação",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setTransactions([data, ...transactions]);
      toast({
        title: "Transação adicionada",
        description: "A transação foi registrada com sucesso.",
      });
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    const { error } = await supabase.from("transactions").delete().eq("id", transactionId);

    if (error) {
      toast({
        title: "Erro ao excluir transação",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTransactions(transactions.filter((t) => t.id !== transactionId));
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    refetch: fetchTransactions,
  };
};
