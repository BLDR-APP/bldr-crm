import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
import MainLayout from "@/components/layout/MainLayout";

interface Event {
  id: number;
  title: string;
  date: string;
  type: "meeting" | "deadline" | "payment";
}

const mockEvents: Event[] = [
  { id: 1, title: "Reunião com investidores", date: "2024-01-15", type: "meeting" },
  { id: 2, title: "Entrega do projeto Alpha", date: "2024-01-18", type: "deadline" },
  { id: 3, title: "Pagamento fornecedor", date: "2024-01-20", type: "payment" },
  { id: 4, title: "Review trimestral", date: "2024-01-25", type: "meeting" },
];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", description: "" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getEventsForDay = (day: number) => {
    const dateStr = formatDate(day);
    return events.filter((event) => event.date === dateStr);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const handleAddEvent = () => {
    if (selectedDate && newEvent.title) {
      const newId = Math.max(...events.map((e) => e.id)) + 1;
      setEvents([
        ...events,
        {
          id: newId,
          title: newEvent.title,
          date: selectedDate,
          type: "meeting",
        },
      ]);
      setNewEvent({ title: "", description: "" });
      setIsDialogOpen(false);
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows x 7 columns

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDay + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
      const dateStr = isValidDay ? formatDate(dayNumber) : "";
      const dayEvents = isValidDay ? getEventsForDay(dayNumber) : [];
      const isTodayDay = isValidDay && isToday(dayNumber);
      const isSelected = dateStr === selectedDate;

      days.push(
        <div
          key={i}
          onClick={() => {
            if (isValidDay) {
              setSelectedDate(dateStr);
              setIsDialogOpen(true);
            }
          }}
          className={`
            min-h-[80px] p-2 border border-border rounded-lg cursor-pointer transition-all duration-200
            ${isValidDay ? "hover:border-primary/50 hover:bg-secondary/30" : "opacity-30 cursor-default"}
            ${isTodayDay ? "border-primary bg-primary/10" : ""}
            ${isSelected ? "ring-2 ring-primary" : ""}
          `}
        >
          {isValidDay && (
            <>
              <span
                className={`text-sm font-medium ${
                  isTodayDay ? "text-primary" : "text-foreground"
                }`}
              >
                {dayNumber}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate ${
                      event.type === "meeting"
                        ? "bg-primary/20 text-primary"
                        : event.type === "deadline"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-success/20 text-success"
                    }`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{dayEvents.length - 2} mais
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Calendário</h1>
            <p className="text-muted-foreground">Gerencie sua agenda e eventos</p>
          </div>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">
                {monthNames[month]} {year}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
          </CardContent>
        </Card>

        {/* Add Event Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Adicionar Lembrete - {selectedDate}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Ex: Reunião com cliente"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Detalhes do evento..."
                  className="bg-secondary border-border"
                />
              </div>
              <Button variant="gold" className="w-full" onClick={handleAddEvent}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Evento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Calendar;
