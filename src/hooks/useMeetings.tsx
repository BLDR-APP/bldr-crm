import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  meeting_type: string;
  attendees: string[] | null;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMeetings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      toast({
        title: "Erro ao carregar reuniões",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMeetings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeetings();
  }, [user]);

  const addMeeting = async (meeting: {
    title: string;
    description?: string;
    date: string;
    start_time: string;
    end_time?: string;
    location?: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("meetings")
      .insert({
        user_id: user.id,
        title: meeting.title,
        description: meeting.description || null,
        date: meeting.date,
        start_time: meeting.start_time,
        end_time: meeting.end_time || null,
        location: meeting.location || null,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro ao criar reunião",
        description: error.message,
        variant: "destructive",
      });
    } else if (data) {
      setMeetings([...meetings, data]);
      toast({
        title: "Reunião criada",
        description: "A reunião foi agendada com sucesso.",
      });
    }
  };

  const updateMeetingStatus = async (meetingId: string, status: string) => {
    const { error } = await supabase
      .from("meetings")
      .update({ status })
      .eq("id", meetingId);

    if (error) {
      toast({
        title: "Erro ao atualizar reunião",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMeetings(meetings.map((m) => (m.id === meetingId ? { ...m, status } : m)));
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    const { error } = await supabase.from("meetings").delete().eq("id", meetingId);

    if (error) {
      toast({
        title: "Erro ao excluir reunião",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMeetings(meetings.filter((m) => m.id !== meetingId));
    }
  };

  return { meetings, loading, addMeeting, updateMeetingStatus, deleteMeeting, refetch: fetchMeetings };
};
