
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCheck, Download, Edit, File, Plus, Settings, Trash, X } from "lucide-react";

const Materials = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProject, setFilterProject] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Mock materials data
  const materials = [
    {
      id: 1,
      name: "Banner Principal - Home",
      description: "Banner principal para a homepage do novo site",
      fileUrl: "https://placeholder.com/banner.jpg",
      thumbnail: "https://via.placeholder.com/400x250?text=Banner",
      project: { id: 2, name: "Redesign de Site" },
      uploadDate: "03/05/2025",
      status: "pending-approval",
      type: "image",
      uploadedBy: {
        id: 2,
        name: "João Costa",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      feedback: null
    },
    {
      id: 2,
      name: "Logotipo Final",
      description: "Versão final do logotipo após ajustes",
      fileUrl: "https://placeholder.com/logo.png",
      thumbnail: "https://via.placeholder.com/400x250?text=Logo",
      project: { id: 4, name: "Redesign de Marca" },
      uploadDate: "02/05/2025",
      status: "changes-requested",
      type: "image",
      uploadedBy: {
        id: 5,
        name: "Paula Lima",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      feedback: "A cor azul precisa ser mais escura. Prefiro a versão anterior das fontes."
    },
    {
      id: 3,
      name: "Post Instagram - Produto X",
      description: "Post para divulgação do novo produto nas redes sociais",
      fileUrl: "https://placeholder.com/post.jpg",
      thumbnail: "https://via.placeholder.com/400x250?text=Post+Instagram",
      project: { id: 3, name: "Campanha de Mídia Social" },
      uploadDate: "01/05/2025",
      status: "approved",
      type: "image",
      uploadedBy: {
        id: 1,
        name: "Ana Silva",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      feedback: "Aprovado sem alterações. Excelente trabalho!"
    },
    {
      id: 4,
      name: "Apresentação de Campanha",
      description: "Apresentação detalhada da estratégia de campanha",
      fileUrl: "https://placeholder.com/presentation.pdf",
      thumbnail: "https://via.placeholder.com/400x250?text=Apresentacao+PDF",
      project: { id: 1, name: "Campanha de Lançamento" },
      uploadDate: "30/04/2025",
      status: "pending-approval",
      type: "document",
      uploadedBy: {
        id: 3,
        name: "Maria Souza",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      feedback: null
    },
    {
      id: 5,
      name: "Wireframes - Site",
      description: "Wireframes de todas as páginas do novo site",
      fileUrl: "https://placeholder.com/wireframes.pdf",
      thumbnail: "https://via.placeholder.com/400x250?text=Wireframes+PDF",
      project: { id: 2, name: "Redesign de Site" },
      uploadDate: "28/04/2025",
      status: "approved",
      type: "document",
      uploadedBy: {
        id: 4,
        name: "Carlos Pereira",
        avatar: "https://i.pravatar.cc/150?img=4"
      },
      feedback: "Aprovado com pequenos comentários. Ver anotações no documento."
    },
    {
      id: 6,
      name: "Guia de Marca",
      description: "Manual de identidade visual completo",
      fileUrl: "https://placeholder.com/brandguide.pdf",
      thumbnail: "https://via.placeholder.com/400x250?text=Guia+de+Marca",
      project: { id: 4, name: "Redesign de Marca" },
      uploadDate: "25/04/2025",
      status: "changes-requested",
      type: "document",
      uploadedBy: {
        id: 5,
        name: "Paula Lima",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      feedback: "Faltou incluir exemplos de aplicação em uniformes e veículos."
    }
  ];

  // Mock projects for filter
  const projects = [
    { id: 1, name: "Campanha de Lançamento" },
    { id: 2, name: "Redesign de Site" },
    { id: 3, name: "Campanha de Mídia Social" },
    { id: 4, name: "Redesign de Marca" },
    { id: 5, name: "Marketing de Conteúdo" }
  ];

  // Filter materials based on search term, status and project
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || material.status === filterStatus;
    const matchesProject = filterProject === "all" || material.project.id.toString() === filterProject;
    
    return matchesSearch && matchesStatus && matchesProject;
  });

  const pendingMaterials = filteredMaterials.filter((material) => material.status === "pending-approval");
  const changesRequestedMaterials = filteredMaterials.filter((material) => material.status === "changes-requested");
  const approvedMaterials = filteredMaterials.filter((material) => material.status === "approved");

  const openPreview = (material) => {
    setSelectedMaterial(material);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setSelectedMaterial(null);
    setPreviewOpen(false);
  };

  const renderMaterialCard = (material) => (
    <Card key={material.id} className="card-hover">
      <CardHeader className="p-0 relative">
        <div 
          className="h-40 bg-gray-100 rounded-t-lg flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => openPreview(material)}
        >
          {material.type === 'image' ? (
            <img src={material.thumbnail} alt={material.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center">
              <File className="h-16 w-16 text-agency-primary" />
              <span className="text-sm text-gray-500">{material.type === 'document' ? 'Documento' : 'Arquivo'}</span>
            </div>
          )}
          <Badge 
            className={`absolute top-2 right-2
              ${material.status === 'pending-approval' ? 'status-pending' : ''}
              ${material.status === 'changes-requested' ? 'status-changes-requested' : ''}
              ${material.status === 'approved' ? 'status-approved' : ''}
            `}
          >
            {material.status === 'pending-approval' ? 'Aguardando Aprovação' : ''}
            {material.status === 'changes-requested' ? 'Alterações Solicitadas' : ''}
            {material.status === 'approved' ? 'Aprovado' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-medium">{material.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => openPreview(material)}>
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Download className="mr-2 h-4 w-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer">
                <Trash className="mr-2 h-4 w-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 border-t bg-gray-50 flex justify-between">
        <div className="flex items-center">
          <div className="h-6 w-6 rounded-full overflow-hidden">
            <img 
              src={material.uploadedBy.avatar} 
              alt={material.uploadedBy.name} 
              className="h-full w-full object-cover" 
            />
          </div>
          <span className="ml-2 text-xs text-gray-500">
            {material.uploadDate}
          </span>
        </div>
        <div className="text-xs text-agency-primary font-medium">
          {material.project.name}
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Materiais</h1>
          <p className="text-muted-foreground">Gerenciamento de materiais para aprovação</p>
        </div>
        <Button className="bg-agency-primary hover:bg-agency-secondary">
          <Plus className="mr-2 h-4 w-4" /> Enviar Material
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <Input
            placeholder="Buscar materiais..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending-approval">Aguardando Aprovação</SelectItem>
            <SelectItem value="changes-requested">Alterações Solicitadas</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Projeto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({filteredMaterials.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Aguardando ({pendingMaterials.length})
          </TabsTrigger>
          <TabsTrigger value="changes">
            Com Alterações ({changesRequestedMaterials.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Aprovados ({approvedMaterials.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(renderMaterialCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingMaterials.map(renderMaterialCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="changes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {changesRequestedMaterials.map(renderMaterialCard)}
          </div>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedMaterials.map(renderMaterialCard)}
          </div>
        </TabsContent>
      </Tabs>
      
      {filteredMaterials.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg font-medium mb-2">Nenhum material encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">Tente ajustar seus filtros ou enviar um novo material</p>
          <Button className="bg-agency-primary hover:bg-agency-secondary">
            <Plus className="mr-2 h-4 w-4" /> Enviar Material
          </Button>
        </div>
      )}

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        {selectedMaterial && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>{selectedMaterial.name}</span>
                <Button variant="ghost" size="icon" onClick={closePreview}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription>{selectedMaterial.description}</DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-gray-100 rounded-lg flex items-center justify-center min-h-[300px] overflow-hidden mb-4">
                {selectedMaterial.type === 'image' ? (
                  <img src={selectedMaterial.thumbnail} alt={selectedMaterial.name} className="max-w-full max-h-[500px]" />
                ) : (
                  <div className="flex flex-col items-center">
                    <File className="h-24 w-24 text-agency-primary" />
                    <span className="text-sm text-gray-500 mt-2">{selectedMaterial.type === 'document' ? 'Documento' : 'Arquivo'}</span>
                    <Button variant="outline" className="mt-4">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Informações</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex">
                      <span className="font-medium w-24">Projeto:</span>
                      <span>{selectedMaterial.project.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Enviado em:</span>
                      <span>{selectedMaterial.uploadDate}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Enviado por:</span>
                      <span>{selectedMaterial.uploadedBy.name}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Status:</span>
                      <Badge 
                        className={`
                          ${selectedMaterial.status === 'pending-approval' ? 'status-pending' : ''}
                          ${selectedMaterial.status === 'changes-requested' ? 'status-changes-requested' : ''}
                          ${selectedMaterial.status === 'approved' ? 'status-approved' : ''}
                        `}
                      >
                        {selectedMaterial.status === 'pending-approval' ? 'Aguardando Aprovação' : ''}
                        {selectedMaterial.status === 'changes-requested' ? 'Alterações Solicitadas' : ''}
                        {selectedMaterial.status === 'approved' ? 'Aprovado' : ''}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {selectedMaterial.feedback && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Feedback do Cliente</h3>
                    <div className="bg-gray-50 p-3 rounded-md border text-sm">
                      {selectedMaterial.feedback}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2 pt-2">
                  <Button className="bg-agency-primary hover:bg-agency-secondary">
                    <CheckCheck className="mr-2 h-4 w-4" /> Aprovar
                  </Button>
                  <Button variant="outline">
                    <X className="mr-2 h-4 w-4" /> Solicitar Alterações
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Materials;
