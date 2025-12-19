import { useState } from "react";
import { Plus, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/hooks/useAuth";

const columns = [
  { id: "pending", title: "A Fazer", color: "border-muted-foreground" },
  { id: "in_progress", title: "Em Progresso", color: "border-primary" },
  { id: "completed", title: "Concluído", color: "border-success" },
];

const Tasks = () => {
  const { tasks, loading, addTask, updateTaskStatus } = useTasks();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium",
  });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "mine") {
      return task.user_id === user?.id;
    }
    return true;
  });

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleAddTask = async () => {
    if (newTask.title) {
      await addTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        assignee: newTask.assignee || undefined,
      });
      setNewTask({ title: "", description: "", assignee: "", priority: "medium" });
      setIsDialogOpen(false);
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive";
      case "medium":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted text-muted-foreground";
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
            <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
            <p className="text-muted-foreground">Quadro Kanban colaborativo</p>
          </div>
          <div className="flex items-center gap-4">
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
                      <Label htmlFor="assignee">Responsável</Label>
                      <Input
                        id="assignee"
                        value={newTask.assignee}
                        onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                        placeholder="Nome do responsável"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
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
                  {getTasksByStatus(column.id).length}
                </span>
              </div>

              <div className="space-y-3 min-h-[400px]">
                {getTasksByStatus(column.id).map((task) => (
                  <Card
                    key={task.id}
                    className="bg-card border-border hover:border-primary/30 transition-all cursor-move"
                    draggable
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {task.assignee && (
                            <>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-secondary">
                                  {task.assignee.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {task.assignee}
                              </span>
                            </>
                          )}
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
                        {column.id !== "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleMoveTask(task.id, "pending")}
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
                        {column.id !== "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 h-7 text-xs"
                            onClick={() => handleMoveTask(task.id, "completed")}
                          >
                            Concluído
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getTasksByStatus(column.id).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhuma tarefa
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Tasks;
