import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Activity {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  user_id: string;
  created_at: string;
}

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchActivities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      toast({
        title: "Erro ao carregar atividades",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setActivities(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [user]);

  const logActivity = async (activity: {
    action: string;
    entity_type: string;
    entity_id?: string;
    entity_name?: string;
  }) => {
    if (!user) return;

    const { error } = await supabase.from("activities").insert({
      user_id: user.id,
      action: activity.action,
      entity_type: activity.entity_type,
      entity_id: activity.entity_id || null,
      entity_name: activity.entity_name || null,
    });

    if (!error) {
      fetchActivities();
    }
  };

  return { activities, loading, logActivity, refetch: fetchActivities };
};
