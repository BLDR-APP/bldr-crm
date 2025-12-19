import { useState } from "react";
import { Plus, Check, X, Clock, Video, Users, FileText } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: { name: string; avatar?: string }[];
  status: "pending" | "accepted" | "declined" | "suggested";
  description: string;
  notes: string;
}

const mockMeetings: Meeting[] = [
  {
    id: 1,
    title: "Review do Q1 2024",
    date: "2024-01-20",
    time: "14:00",
    participants: [
      { name: "João Silva" },
      { name: "Maria Santos" },
      { name: "Carlos Lima" },
    ],
    status: "pending",
    description: "Revisão dos resultados do primeiro trimestre",
    notes: "",
  },
  {
    id: 2,
    title: "Alinhamento de Produto",
    date: "2024-01-22",
    time: "10:00",
    participants: [{ name: "Ana Costa" }, { name: "Pedro Alves" }],
    status: "accepted",
    description: "Discussão sobre roadmap de features",
    notes: "Priorizar features de engagement",
  },
  {
    id: 3,
    title: "Reunião com Investidores",
    date: "2024-01-25",
    time: "16:00",
    participants: [{ name: "Investor Group" }],
    status: "pending",
    description: "Apresentação de métricas e próximos passos",
    notes: "",
  },
];

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
  });

  const handleStatusChange = (meetingId: number, newStatus: Meeting["status"]) => {
    setMeetings(
      meetings.map((m) => (m.id === meetingId ? { ...m, status: newStatus } : m))
    );
  };

  const handleAddMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time) {
      const newId = Math.max(...meetings.map((m) => m.id)) + 1;
      setMeetings([
        ...meetings,
        {
          id: newId,
          ...newMeeting,
          participants: [],
          status: "pending",
          notes: "",
        },
      ]);
      setNewMeeting({ title: "", date: "", time: "", description: "" });
      setIsDialogOpen(false);
    }
  };

  const handleUpdateNotes = (meetingId: number, notes: string) => {
    setMeetings(meetings.map((m) => (m.id === meetingId ? { ...m, notes } : m)));
  };

  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-success text-success-foreground">Aceito</Badge>;
      case "declined":
        return <Badge className="bg-destructive text-destructive-foreground">Recusado</Badge>;
      case "suggested":
        return <Badge className="bg-primary text-primary-foreground">Nova Data Sugerida</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

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
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
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
                    {meeting.date} às {meeting.time}
                  </div>
                </div>

                <p className="text-sm text-foreground">{meeting.description}</p>

                {/* Participants */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {meeting.participants.slice(0, 3).map((p, idx) => (
                      <Avatar key={idx} className="h-6 w-6 border-2 border-card">
                        <AvatarFallback className="text-xs bg-secondary">
                          {p.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {meeting.participants.length > 3 && (
                      <span className="text-xs text-muted-foreground ml-2">
                        +{meeting.participants.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Notes (Rich Text Area) */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Ata da Reunião
                  </Label>
                  <Textarea
                    value={meeting.notes}
                    onChange={(e) => handleUpdateNotes(meeting.id, e.target.value)}
                    placeholder="Adicionar notas..."
                    className="bg-secondary border-border text-sm min-h-[60px]"
                  />
                </div>

                {/* RSVP Actions */}
                {meeting.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(meeting.id, "accepted")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceitar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStatusChange(meeting.id, "declined")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Recusar
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStatusChange(meeting.id, "suggested")}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Meetings;
