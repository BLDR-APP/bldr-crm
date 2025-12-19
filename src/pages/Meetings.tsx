import { useState } from "react";
import { Plus, Check, X, Clock, Users, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { useMeetings } from "@/hooks/useMeetings";

const Meetings = () => {
  const { meetings, loading, addMeeting, updateMeetingStatus } = useMeetings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    start_time: "",
    description: "",
    location: "",
  });

  const handleAddMeeting = async () => {
    if (newMeeting.title && newMeeting.date && newMeeting.start_time) {
      await addMeeting({
        title: newMeeting.title,
        date: newMeeting.date,
        start_time: newMeeting.start_time,
        description: newMeeting.description || undefined,
        location: newMeeting.location || undefined,
      });
      setNewMeeting({ title: "", date: "", start_time: "", description: "", location: "" });
      setIsDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-success text-success-foreground">Aceito</Badge>;
      case "declined":
        return <Badge className="bg-destructive text-destructive-foreground">Recusado</Badge>;
      case "suggested":
        return <Badge className="bg-primary text-primary-foreground">Nova Data Sugerida</Badge>;
      default:
        return <Badge variant="secondary">Agendado</Badge>;
    }
  };

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
            <h1 className="text-2xl font-bold text-foreground">Reuniões</h1>
            <p className="text-muted-foreground">Gerencie suas reuniões e RSVPs</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Plus className="h-4 w-4 mr-2" />
                Nova Reunião
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Nova Reunião</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    placeholder="Título da reunião"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMeeting.start_time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, start_time: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                    placeholder="Local ou link da reunião"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                    placeholder="Detalhes da reunião..."
                    className="bg-secondary border-border"
                  />
                </div>
                <Button variant="gold" className="w-full" onClick={handleAddMeeting}>
                  Criar Reunião
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Meetings List */}
        {meetings.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nenhuma reunião agendada</p>
            <p className="text-sm text-muted-foreground">
              Clique em "Nova Reunião" para agendar
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="bg-card border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-foreground">{meeting.title}</CardTitle>
                    {getStatusBadge(meeting.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {meeting.date} às {meeting.start_time}
                    </div>
                  </div>

                  {meeting.location && (
                    <p className="text-sm text-muted-foreground">📍 {meeting.location}</p>
                  )}

                  {meeting.description && (
                    <p className="text-sm text-foreground">{meeting.description}</p>
                  )}

                  {/* RSVP Actions */}
                  {meeting.status === "scheduled" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="success"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateMeetingStatus(meeting.id, "accepted")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aceitar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => updateMeetingStatus(meeting.id, "declined")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Recusar
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => updateMeetingStatus(meeting.id, "suggested")}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Meetings;
