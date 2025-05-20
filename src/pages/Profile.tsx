
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

/**
 * Página de Perfil do Usuário
 */
const Profile = () => {
  // Obtém dados do usuário do contexto de autenticação
  const { user } = useAuth();
  
  // Estados para os formulários
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Estados para dados do perfil
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  
  // Estados para o formulário de senha
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estado para preview da imagem
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  /**
   * Obtém as iniciais do nome para o fallback do avatar
   */
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  /**
   * Manipula o envio do formulário de dados pessoais
   */
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**
   * Manipula o envio do formulário de troca de senha
   */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Limpar formulário
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      toast({
        title: "Erro ao alterar senha",
        description: "Senha atual incorreta ou erro de conexão.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  /**
   * Manipula o clique no botão de upload de avatar
   */
  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Manipula a seleção de arquivo para avatar
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem JPG ou PNG.",
        variant: "destructive",
      });
      return;
    }
    
    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Criar URL para preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setSelectedFile(file);
    
    // Limpar o input de arquivo para permitir a seleção do mesmo arquivo novamente
    e.target.value = '';
  };

  /**
   * Manipula o upload do avatar
   */
  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploadingAvatar(true);
    
    try {
      // Simulação de upload de arquivo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi alterada com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      toast({
        title: "Erro ao atualizar avatar",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  /**
   * Cancela o upload e limpa o preview
   */
  const handleCancelUpload = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
        <p className="text-muted-foreground mb-8">Gerencie suas informações pessoais e preferências</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna da esquerda - Avatar e informações básicas */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Foto de Perfil</CardTitle>
                <CardDescription>Personalize sua imagem de perfil</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt={user?.name || "Avatar"} />
                  ) : (
                    <>
                      <AvatarImage src={user?.avatar} alt={user?.name || "Avatar"} />
                      <AvatarFallback className="text-2xl">{getInitials(user?.name)}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {/* Botões de upload */}
                {avatarPreview ? (
                  <div className="flex gap-2 mt-2 w-full">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCancelUpload}
                      disabled={isUploadingAvatar}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : "Salvar"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={handleAvatarButtonClick}
                  >
                    Alterar Foto
                  </Button>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground text-center w-full">
                  JPG ou PNG. Máximo 5MB.
                </p>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Conta</p>
                    <p className="font-medium">
                      {user?.role === 'admin' ? 'Administrador' : 
                       user?.role === 'collaborator' ? 'Colaborador' : 'Cliente'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Membro desde</p>
                    <p className="font-medium">Janeiro de 2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Coluna da direita - Abas de configurações */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-medium">Configurações</h3>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal">
                    <form onSubmit={handleProfileSubmit} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)} 
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isUpdatingProfile}
                        className="w-full"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : "Salvar Alterações"}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          required
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>A senha deve conter:</p>
                        <ul className="list-disc pl-5">
                          <li>Pelo menos 6 caracteres</li>
                          <li>Letras maiúsculas e minúsculas</li>
                          <li>Pelo menos um número</li>
                        </ul>
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isChangingPassword}
                        className="w-full"
                      >
                        {isChangingPassword ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Alterando...
                          </>
                        ) : "Alterar Senha"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
