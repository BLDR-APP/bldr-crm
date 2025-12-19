import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  all_day: boolean;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchEvents = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      toast({
        title: "Erro ao carregar eventos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const addEvent = async (event: {
    title: string;
    description?: string;
    start_date: string;
    end_date?: string;
    all_day?: boolean;
    color?: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id: user.id,
        title: event.title,
        description: event.description || null,
        start_date: event.start_date,
        end_date: event.end_date || null,
        all_day: event.all_day || false,
        color: event.color || "#3B82F6",
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro ao criar evento",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setEvents([...events, data]);
      toast({
        title: "Evento adicionado",
        description: "O evento foi adicionado ao calendário.",
      });
    }
  };

  const deleteEvent = async (eventId: string) => {
    const { error } = await supabase.from("calendar_events").delete().eq("id", eventId);

    if (error) {
      toast({
        title: "Erro ao excluir evento",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEvents(events.filter((e) => e.id !== eventId));
    }
  };

  return { events, loading, addEvent, deleteEvent, refetch: fetchEvents };
};
