import { useState } from "react";
import { Plus, Edit, Trash2, Building, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { usePartners } from "@/hooks/usePartners";

const partnerTypes = ["client", "supplier", "distributor", "strategic", "investor"];
const statusOptions = ["active", "inactive", "pending"];

const typeLabels: Record<string, string> = {
  client: "Cliente",
  supplier: "Fornecedor",
  distributor: "Distribuidor",
  strategic: "Parceiro Estratégico",
  investor: "Investidor",
};

const statusLabels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  pending: "Pendente",
};

const Partners = () => {
  const { partners, loading, addPartner, updatePartner, deletePartner } = usePartners();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "",
    email: "",
    phone: "",
    company: "",
  });

  const handleOpenDialog = (partnerId?: string) => {
    if (partnerId) {
      const partner = partners.find((p) => p.id === partnerId);
      if (partner) {
        setEditingPartner(partnerId);
        setFormData({
          name: partner.name,
          type: partner.type,
          status: partner.status,
          email: partner.email || "",
          phone: partner.phone || "",
          company: partner.company || "",
        });
      }
    } else {
      setEditingPartner(null);
      setFormData({ name: "", type: "", status: "", email: "", phone: "", company: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (formData.name && formData.type && formData.status) {
      if (editingPartner) {
        await updatePartner(editingPartner, {
          name: formData.name,
          type: formData.type,
          status: formData.status,
          email: formData.email || null,
          phone: formData.phone || null,
          company: formData.company || null,
        });
      } else {
        await addPartner({
          name: formData.name,
          type: formData.type,
          status: formData.status,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
        });
      }
      setIsDialogOpen(false);
      setFormData({ name: "", type: "", status: "", email: "", phone: "", company: "" });
      setEditingPartner(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePartner(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-destructive text-destructive-foreground">Inativo</Badge>;
      default:
        return <Badge className="bg-primary text-primary-foreground">Pendente</Badge>;
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
            <h1 className="text-2xl font-bold text-foreground">Parceiros</h1>
            <p className="text-muted-foreground">Gerencie seus parceiros de negócios</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Parceiro
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingPartner ? "Editar Parceiro" : "Novo Parceiro"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do parceiro"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecionar tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {partnerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {typeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Selecionar status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@empresa.com"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="bg-secondary border-border"
                  />
                </div>
                <Button variant="gold" className="w-full" onClick={handleSave}>
                  {editingPartner ? "Salvar Alterações" : "Adicionar Parceiro"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Lista de Parceiros
            </CardTitle>
          </CardHeader>
          <CardContent>
            {partners.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Nenhum parceiro cadastrado</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Nome</TableHead>
                    <TableHead className="text-muted-foreground">Tipo</TableHead>
                    <TableHead className="text-muted-foreground">Contato</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{partner.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {typeLabels[partner.type] || partner.type}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{partner.email || "-"}</TableCell>
                      <TableCell>{getStatusBadge(partner.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(partner.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(partner.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Partners;
