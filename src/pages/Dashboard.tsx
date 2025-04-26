
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Componente da página de Dashboard para clientes
const Dashboard = () => {
  // Estado para gerenciar as mensagens do chat
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Como posso te ajudar com seu projeto hoje?",
      sender: "agency",
      user: {
        name: "Atendimento",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      timestamp: "10:30"
    }
  ]);
  
  // Mock de dados do projeto atual
  const currentProject = {
    id: 1,
    name: "Campanha de Marketing Digital"
  };

  // Função para enviar mensagem
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: "client",
        user: {
          name: "Você",
          avatar: "https://i.pravatar.cc/150?img=68"
        },
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setMessages([...messages, newMessage]);
      setMessage("");
      
      // Aqui seria feita a chamada para a API: POST /api/chat/messages
      console.log("Enviando mensagem para API:", { projectId: currentProject.id, text: message });
    }
  };

  // Função para obter as iniciais do nome para o fallback do avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo ao seu painel de controle</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Card com iframe do Looker Studio */}
        <Card>
          <CardHeader>
            <CardTitle>Métricas do Projeto</CardTitle>
            <CardDescription>
              Confira o desempenho de suas campanhas em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              {/* Iframe responsivo simulado para o Looker Studio */}
              <div className="w-full min-h-[600px] bg-muted/30 flex items-center justify-center rounded-lg">
                <div className="text-center p-6">
                  <h3 className="text-xl font-bold mb-2">Looker Studio Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Este é um placeholder para o dashboard do Looker Studio.
                    <br />Em um ambiente de produção, um iframe seria carregado aqui.
                  </p>
                  {/* Nota: Em produção, substitua esta div por um iframe real do Looker Studio */}
                  {/* <iframe 
                    src="https://lookerstudio.google.com/embed/dashboard-id" 
                    width="100%" 
                    height="600" 
                    frameBorder="0"
                    allowFullScreen
                  ></iframe> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card com widget de chat */}
        <Card>
          <CardHeader>
            <CardTitle>Chat de Solicitações</CardTitle>
            <CardDescription>
              Envie mensagens para nossa equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[500px]">
              {/* Área de mensagens */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg bg-muted/30">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 ${msg.sender === 'client' ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.user.avatar} alt={msg.user.name} />
                      <AvatarFallback>{getInitials(msg.user.name)}</AvatarFallback>
                    </Avatar>
                    
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'client' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{msg.user.name}</span>
                        <span className="text-xs opacity-70">{msg.timestamp}</span>
                      </div>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Área de input */}
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="resize-none"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()} 
                  className="h-auto"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
