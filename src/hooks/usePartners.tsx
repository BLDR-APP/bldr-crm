import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Partner {
  id: string;
  name: string;
  type: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPartners = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast({
        title: "Erro ao carregar parceiros",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
  }, [user]);

  const addPartner = async (partner: {
    name: string;
    type: string;
    email?: string;
    phone?: string;
    company?: string;
    status: string;
    notes?: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("partners")
      .insert({
        user_id: user.id,
        name: partner.name,
        type: partner.type,
        email: partner.email || null,
        phone: partner.phone || null,
        company: partner.company || null,
        status: partner.status,
        notes: partner.notes || null,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro ao criar parceiro",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setPartners([...partners, data]);
      toast({
        title: "Parceiro adicionado",
        description: "O parceiro foi adicionado com sucesso.",
      });
    }
  };

  const updatePartner = async (partnerId: string, updates: Partial<Partner>) => {
    const { error } = await supabase
      .from("partners")
      .update(updates)
      .eq("id", partnerId);

    if (error) {
      toast({
        title: "Erro ao atualizar parceiro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPartners(partners.map((p) => (p.id === partnerId ? { ...p, ...updates } : p)));
      toast({
        title: "Parceiro atualizado",
        description: "As alterações foram salvas.",
      });
    }
  };

  const deletePartner = async (partnerId: string) => {
    const { error } = await supabase.from("partners").delete().eq("id", partnerId);

    if (error) {
      toast({
        title: "Erro ao excluir parceiro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPartners(partners.filter((p) => p.id !== partnerId));
      toast({
        title: "Parceiro excluído",
        description: "O parceiro foi removido.",
      });
    }
  };

  return { partners, loading, addPartner, updatePartner, deletePartner, refetch: fetchPartners };
};
