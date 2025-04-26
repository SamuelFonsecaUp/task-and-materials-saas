
import { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/App";
import { Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estado para o preview da imagem
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Função para obter as iniciais do nome para o fallback do avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Função para abrir o seletor de arquivo ao clicar no botão
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Função para cancelar o upload
  const handleCancelUpload = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Função para lidar com a seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar o tipo de arquivo
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem JPEG ou PNG.",
        variant: "destructive"
      });
      return;
    }

    // Validar o tamanho do arquivo (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione uma imagem com menos de 5MB.",
        variant: "destructive"
      });
      return;
    }

    // Criar URL para preview da imagem
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setSelectedFile(file);
  };

  // Função para salvar a imagem
  const handleSaveAvatar = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Simular upload para API
      // Em um app real, aqui seria feita uma chamada para a API PUT /api/users/{id}/avatar
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulando delay de rede
      
      toast({
        title: "Foto de perfil atualizada",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
      
      // Limpar estados
      setSelectedFile(null);
      
      // Em um app real, aqui atualizaríamos o estado do usuário com a nova URL do avatar
    } catch (error) {
      toast({
        title: "Erro ao atualizar foto",
        description: "Ocorreu um erro ao tentar atualizar sua foto de perfil.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid gap-6">
        {/* Card de foto de perfil */}
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Atualize sua foto de perfil. Recomendamos uma imagem de rosto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Preview de avatar atual ou novo */}
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage 
                    src={avatarPreview || user?.avatar} 
                    alt={user?.name || "Usuário"} 
                  />
                  <AvatarFallback className="text-3xl">
                    {user?.name ? getInitials(user.name) : "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {/* Input de arquivo oculto */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg, image/png"
                  className="hidden"
                />

                {/* Instruções e botões */}
                <div className="text-sm text-muted-foreground">
                  <p>Formatos aceitos: JPG, PNG</p>
                  <p>Tamanho máximo: 5MB</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {!avatarPreview ? (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={handleUploadClick}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Selecionar Imagem
                    </Button>
                  ) : (
                    <>
                      <Button 
                        type="button" 
                        variant="default"
                        onClick={handleSaveAvatar}
                        disabled={isUploading}
                      >
                        {isUploading ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleCancelUpload}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de informações pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
