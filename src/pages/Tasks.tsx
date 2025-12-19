import { useState } from "react";
import { Plus, GripVertical, User } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MainLayout from "@/components/layout/MainLayout";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  assignee: { name: string; avatar?: string };
  priority: "low" | "medium" | "high";
}

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Implementar autenticação",
    description: "Adicionar login com Google e Apple",
    status: "todo",
    assignee: { name: "João Silva" },
    priority: "high",
  },
  {
    id: 2,
    title: "Design do Dashboard",
    description: "Criar mockups para nova versão",
    status: "in_progress",
    assignee: { name: "Maria Santos" },
    priority: "medium",
  },
  {
    id: 3,
    title: "Testes de API",
    description: "Validar endpoints de pagamento",
    status: "in_progress",
    assignee: { name: "Carlos Lima" },
    priority: "high",
  },
  {
    id: 4,
    title: "Documentação",
    description: "Atualizar README do projeto",
    status: "done",
    assignee: { name: "Ana Costa" },
    priority: "low",
  },
];

const teamMembers = [
  { name: "João Silva" },
  { name: "Maria Santos" },
  { name: "Carlos Lima" },
  { name: "Ana Costa" },
];

const columns = [
  { id: "todo", title: "A Fazer", color: "border-muted-foreground" },
  { id: "in_progress", title: "Em Progresso", color: "border-primary" },
  { id: "done", title: "Concluído", color: "border-success" },
];

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium" as Task["priority"],
  });

  const currentUser = "João Silva"; // Mock current user

  const filteredTasks = tasks.filter((task) => {
    if (filter === "mine") {
      return task.assignee.name === currentUser;
    }
    return true;
  });

  const getTasksByStatus = (status: Task["status"]) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.assignee) {
      const newId = Math.max(...tasks.map((t) => t.id)) + 1;
      setTasks([
        ...tasks,
        {
          id: newId,
          title: newTask.title,
          description: newTask.description,
          status: "todo",
          assignee: { name: newTask.assignee },
          priority: newTask.priority,
        },
      ]);
      setNewTask({ title: "", description: "", assignee: "", priority: "medium" });
      setIsDialogOpen(false);
    }
  };

  const handleMoveTask = (taskId: number, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive";
      case "medium":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
            <p className="text-muted-foreground">Quadro Kanban colaborativo</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                Todas
              </Button>
              <Button
                variant={filter === "mine" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("mine")}
              >
                Minhas Tarefas
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tarefa
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Nova Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Título da tarefa"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Detalhes da tarefa..."
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Responsável</Label>
                      <Select
                        value={newTask.assignee}
                        onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {teamMembers.map((member) => (
                            <SelectItem key={member.name} value={member.name}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value: Task["priority"]) =>
                          setNewTask({ ...newTask, priority: value })
                        }
                      >
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button variant="gold" className="w-full" onClick={handleAddTask}>
                    Criar Tarefa
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.id} className="space-y-4">
              <div className={`flex items-center gap-2 pb-2 border-b-2 ${column.color}`}>
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {getTasksByStatus(column.id as Task["status"]).length}
                </span>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {getTasksByStatus(column.id as Task["status"]).map((task) => (
                  <Card
                    key={task.id}
                    className="bg-card border-border hover:border-primary/30 transition-all cursor-move"
                    draggable
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        </div>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-secondary">
                              {task.assignee.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {task.assignee.name}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority === "high"
                            ? "Alta"
                            : task.priority === "medium"
                            ? "Média"
                            : "Baixa"}
                        </span>
                      </div>

                      {/* Quick move buttons */}
                      <div className="flex gap-1 pt-2 border-t border-border">
                        {column.id !== "todo" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleMoveTask(task.id, "todo")}
                          >
                            A Fazer
                          </Button>
                        )}
                        {column.id !== "in_progress" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleMoveTask(task.id, "in_progress")}
                          >
                            Em Progresso
                          </Button>
                        )}
                        {column.id !== "done" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleMoveTask(task.id, "done")}
                          >
                            Concluído
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tasks;
