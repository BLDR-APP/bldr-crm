import { useState } from "react";
import { Plus, Edit, Trash2, Building, CheckCircle, XCircle } from "lucide-react";
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

interface Partner {
  id: number;
  name: string;
  type: "Fornecedor" | "Distribuidor" | "Parceiro Estratégico" | "Investidor";
  status: "Ativo" | "Inativo" | "Pendente";
  contact: string;
}

const mockPartners: Partner[] = [
  { id: 1, name: "Apple Inc.", type: "Distribuidor", status: "Ativo", contact: "partners@apple.com" },
  { id: 2, name: "Stripe", type: "Fornecedor", status: "Ativo", contact: "enterprise@stripe.com" },
  { id: 3, name: "AWS", type: "Fornecedor", status: "Ativo", contact: "support@aws.com" },
  { id: 4, name: "Gympass", type: "Parceiro Estratégico", status: "Pendente", contact: "parcerias@gympass.com" },
  { id: 5, name: "Sequoia Capital", type: "Investidor", status: "Ativo", contact: "deals@sequoiacap.com" },
];

const partnerTypes = ["Fornecedor", "Distribuidor", "Parceiro Estratégico", "Investidor"];
const statusOptions = ["Ativo", "Inativo", "Pendente"];

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "",
    contact: "",
  });

  const handleOpenDialog = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner);
      setFormData({
        name: partner.name,
        type: partner.type,
        status: partner.status,
        contact: partner.contact,
      });
    } else {
      setEditingPartner(null);
      setFormData({ name: "", type: "", status: "", contact: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (formData.name && formData.type && formData.status) {
      if (editingPartner) {
        setPartners(
          partners.map((p) =>
            p.id === editingPartner.id
              ? { ...p, ...formData, type: formData.type as Partner["type"], status: formData.status as Partner["status"] }
              : p
          )
        );
      } else {
        const newId = Math.max(...partners.map((p) => p.id)) + 1;
        setPartners([
          ...partners,
          {
            id: newId,
            ...formData,
            type: formData.type as Partner["type"],
            status: formData.status as Partner["status"],
          },
        ]);
      }
      setIsDialogOpen(false);
      setFormData({ name: "", type: "", status: "", contact: "" });
      setEditingPartner(null);
    }
  };

  const handleDelete = (id: number) => {
    setPartners(partners.filter((p) => p.id !== id));
  };

  const getStatusBadge = (status: Partner["status"]) => {
    switch (status) {
      case "Ativo":
        return <Badge className="bg-success text-success-foreground">Ativo</Badge>;
      case "Inativo":
        return <Badge className="bg-destructive text-destructive-foreground">Inativo</Badge>;
      default:
        return <Badge className="bg-primary text-primary-foreground">Pendente</Badge>;
    }
  };

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
                          {type}
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
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Contato</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="email@empresa.com"
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
                    <TableCell className="text-muted-foreground">{partner.type}</TableCell>
                    <TableCell className="text-muted-foreground">{partner.contact}</TableCell>
                    <TableCell>{getStatusBadge(partner.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(partner)}
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
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Partners;
