import { useState } from "react";
import {
  FolderPlus,
  Upload,
  Folder,
  FileText,
  FileImage,
  FileSpreadsheet,
  ChevronRight,
  MoreVertical,
  Trash2,
  Download,
  Home,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MainLayout from "@/components/layout/MainLayout";

interface FileItem {
  id: number;
  name: string;
  type: "folder" | "pdf" | "doc" | "image" | "spreadsheet";
  parentId: number | null;
  size?: string;
  updatedAt: string;
}

const mockFiles: FileItem[] = [
  { id: 1, name: "Contratos", type: "folder", parentId: null, updatedAt: "2024-01-15" },
  { id: 2, name: "Financeiro", type: "folder", parentId: null, updatedAt: "2024-01-14" },
  { id: 3, name: "Marketing", type: "folder", parentId: null, updatedAt: "2024-01-12" },
  { id: 4, name: "RH", type: "folder", parentId: null, updatedAt: "2024-01-10" },
  { id: 5, name: "Contrato Apple.pdf", type: "pdf", parentId: 1, size: "2.4 MB", updatedAt: "2024-01-15" },
  { id: 6, name: "Contrato Stripe.pdf", type: "pdf", parentId: 1, size: "1.8 MB", updatedAt: "2024-01-14" },
  { id: 7, name: "NDA Template.doc", type: "doc", parentId: 1, size: "156 KB", updatedAt: "2024-01-10" },
  { id: 8, name: "Relatório Mensal", type: "folder", parentId: 2, updatedAt: "2024-01-13" },
  { id: 9, name: "Notas Fiscais", type: "folder", parentId: 2, updatedAt: "2024-01-12" },
  { id: 10, name: "Janeiro 2024.xlsx", type: "spreadsheet", parentId: 8, size: "456 KB", updatedAt: "2024-01-15" },
  { id: 11, name: "Dezembro 2023.xlsx", type: "spreadsheet", parentId: 8, size: "423 KB", updatedAt: "2024-01-01" },
  { id: 12, name: "Brand Guidelines.pdf", type: "pdf", parentId: 3, size: "8.2 MB", updatedAt: "2024-01-10" },
  { id: 13, name: "Logo Pack.zip", type: "image", parentId: 3, size: "15.4 MB", updatedAt: "2024-01-08" },
];

const Documents = () => {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null; name: string }[]>([
    { id: null, name: "Documentos" },
  ]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const currentFiles = files.filter((f) => f.parentId === currentFolderId);

  const navigateToFolder = (folderId: number | null, folderName: string) => {
    if (folderId === null) {
      setBreadcrumbs([{ id: null, name: "Documentos" }]);
    } else {
      const existingIndex = breadcrumbs.findIndex((b) => b.id === folderId);
      if (existingIndex >= 0) {
        setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
      } else {
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
      }
    }
    setCurrentFolderId(folderId);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newId = Math.max(...files.map((f) => f.id)) + 1;
      setFiles([
        ...files,
        {
          id: newId,
          name: newFolderName,
          type: "folder",
          parentId: currentFolderId,
          updatedAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewFolderName("");
      setIsNewFolderDialogOpen(false);
    }
  };

  const handleDelete = (fileId: number) => {
    // Delete the file and all children recursively
    const idsToDelete = new Set<number>();
    const collectIds = (id: number) => {
      idsToDelete.add(id);
      files.filter((f) => f.parentId === id).forEach((f) => collectIds(f.id));
    };
    collectIds(fileId);
    setFiles(files.filter((f) => !idsToDelete.has(f.id)));
  };

  const getFileIcon = (type: FileItem["type"]) => {
    switch (type) {
      case "folder":
        return <Folder className="h-12 w-12 text-primary fill-primary/20" />;
      case "pdf":
        return <FileText className="h-12 w-12 text-destructive" />;
      case "doc":
        return <FileText className="h-12 w-12 text-blue-500" />;
      case "image":
        return <FileImage className="h-12 w-12 text-green-500" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-12 w-12 text-green-600" />;
      default:
        return <FileText className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documentos</h1>
            <p className="text-muted-foreground">Gerenciador de arquivos e pastas</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Nova Pasta
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Nova Pasta</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="folderName">Nome da Pasta</Label>
                    <Input
                      id="folderName"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Nome da pasta"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <Button variant="gold" className="w-full" onClick={handleCreateFolder}>
                    Criar Pasta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="gold">
              <Upload className="h-4 w-4 mr-2" />
              Upload Arquivo
            </Button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => navigateToFolder(null, "Documentos")}
          >
            <Home className="h-4 w-4" />
          </Button>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id ?? "root"} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <button
                onClick={() => navigateToFolder(crumb.id, crumb.name)}
                className={`hover:text-primary transition-colors ${
                  index === breadcrumbs.length - 1 ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>

        {/* File Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {currentFiles.map((file) => (
            <Card
              key={file.id}
              className={`bg-card border-border hover:border-primary/30 transition-all cursor-pointer group ${
                file.type === "folder" ? "hover:bg-secondary/30" : ""
              }`}
              onClick={() => {
                if (file.type === "folder") {
                  navigateToFolder(file.id, file.name);
                }
              }}
            >
              <CardContent className="p-4 flex flex-col items-center text-center relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    {file.type !== "folder" && (
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="mb-3">{getFileIcon(file.type)}</div>
                <p className="text-sm font-medium text-foreground truncate w-full">{file.name}</p>
                {file.size && (
                  <p className="text-xs text-muted-foreground">{file.size}</p>
                )}
                <p className="text-xs text-muted-foreground">{file.updatedAt}</p>
              </CardContent>
            </Card>
          ))}

          {currentFiles.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <Folder className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Esta pasta está vazia</p>
              <p className="text-sm text-muted-foreground">
                Crie uma nova pasta ou faça upload de arquivos
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Documents;
