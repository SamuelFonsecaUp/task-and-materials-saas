
# Task and Materials SaaS

O **Task and Materials SaaS** é uma aplicação SaaS (Software as a Service) desenvolvida para ajudar usuários a gerenciar **tarefas** e **materiais** de forma prática e organizada.

A proposta é oferecer uma plataforma onde empresas, times de projeto ou profissionais autônomos possam:

- **Cadastrar tarefas** a serem realizadas, com informações detalhadas
- **Controlar o uso de materiais** relacionados a essas tarefas
- **Gerenciar o progresso** dos trabalhos de forma centralizada e eficiente
- **Acompanhar clientes** e seus projetos através de dashboards integrados

## Principais funcionalidades

- ✅ Criação e organização de tarefas
- ✅ Controle e registro de materiais utilizados
- ✅ Atualização de status das tarefas
- ✅ Gerenciamento de clientes
- ✅ Integração com Looker Studio para relatórios
- ✅ Interface amigável e focada na produtividade

## Tecnologias utilizadas

### Frontend
- **React 18**: Biblioteca para criação de interfaces
- **Vite**: Build tool moderna e rápida
- **TypeScript**: Para tipagem estática e melhor experiência de desenvolvimento
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva
- **Shadcn/UI**: Componentes de UI modernos e acessíveis
- **React Router**: Navegação entre páginas
- **React Query**: Gerenciamento de estado e cache de dados
- **React Hook Form**: Formulários performáticos e validação
- **Zod**: Validação de esquemas TypeScript-first

### Backend e Infraestrutura
- **Supabase**: Backend-as-a-Service com autenticação, banco de dados e APIs
- **PostgreSQL**: Banco de dados relacional (via Supabase)
- **Row Level Security (RLS)**: Segurança a nível de linha no banco de dados

### Ferramentas de Desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Lovable**: Plataforma de desenvolvimento AI-powered

## Pré-requisitos

- Node.js 18+ ou Bun
- Conta no Supabase
- Git

## Configuração do ambiente de desenvolvimento

### 1. Clone o repositório

```bash
git clone [URL_DO_REPOSITORIO]
cd task-and-materials-saas
```

### 2. Instale as dependências

```bash
# Com npm
npm install

# Com bun (recomendado)
bun install
```

### 3. Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Obtenha as credenciais do projeto (URL e chave anon)
3. Configure as variáveis de ambiente (veja seção abaixo)

### 4. Variáveis de ambiente

Este projeto utiliza a integração nativa do Lovable com Supabase. As variáveis de ambiente são gerenciadas automaticamente através da plataforma.

Se você estiver executando localmente fora do Lovable, você precisará configurar:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 5. Execute o projeto

```bash
# Com npm
npm run dev

# Com bun
bun dev
```

O projeto estará disponível em `http://localhost:8080`

## Estrutura do projeto

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── ui/             # Componentes base do Shadcn/UI
│   ├── clients/        # Componentes específicos de clientes
│   ├── tasks/          # Componentes específicos de tarefas
│   └── auth/           # Componentes de autenticação
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── lib/                # Utilitários e configurações
├── integrations/       # Integrações externas (Supabase)
├── contexts/           # Contextos React
└── services/           # Serviços de API
```

## Banco de dados

### Tabelas principais

- **users**: Usuários do sistema
- **tasks**: Tarefas e atividades
- **task_statuses**: Status customizáveis das tarefas
- **calendar_events**: Eventos de calendário
- **invitations**: Convites de usuários

### Row Level Security (RLS)

O projeto utiliza políticas de segurança a nível de linha para garantir que usuários apenas acessem dados autorizados. As políticas estão configuradas para:

- Usuários só podem ver suas próprias tarefas
- Status de tarefas são específicos por usuário/organização
- Eventos de calendário são privados por usuário

## Scripts disponíveis

- `dev`: Inicia o servidor de desenvolvimento
- `build`: Gera o build de produção
- `preview`: Visualiza o build de produção
- `lint`: Executa o ESLint

## Deploy

O projeto está configurado para deploy no Lovable, que oferece deploy automático e integração nativa com Supabase.

Para deploy em outras plataformas:

1. Execute `npm run build` ou `bun run build`
2. Faça upload da pasta `dist/` para seu provedor de hospedagem
3. Configure as variáveis de ambiente no ambiente de produção

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de código

- Use TypeScript para tipagem estática
- Siga as configurações do ESLint
- Mantenha componentes pequenos e focados
- Use hooks customizados para lógica reutilizável
- Implemente tratamento de erros adequado

## Roadmap

- [ ] Testes automatizados (unitários e de integração)
- [ ] Internacionalização (i18n)
- [ ] Notificações em tempo real
- [ ] API REST pública
- [ ] Aplicativo móvel
- [ ] Integração com mais ferramentas de BI

## Licença

Este projeto está sob a licença [MIT](LICENSE).

## Suporte

Para suporte, entre em contato através dos issues do GitHub ou [email de contato].

---

> Projeto em desenvolvimento ativo. Feedbacks e contribuições são bem-vindos!
