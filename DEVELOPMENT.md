
# Guia de Desenvolvimento

Este documento fornece informações detalhadas sobre o desenvolvimento do Task and Materials SaaS.

## Arquitetura do Projeto

### Frontend (React)

- **Componentes**: Organizados por funcionalidade em `src/components/`
- **Páginas**: Rotas principais em `src/pages/`
- **Estado**: Gerenciado com React Query + Context API
- **Roteamento**: React Router DOM
- **Estilização**: Tailwind CSS + Shadcn/UI

### Backend (Supabase)

- **Autenticação**: Supabase Auth com RLS
- **Banco de dados**: PostgreSQL com políticas de segurança
- **API**: Auto-gerada pelo Supabase
- **Tempo real**: Supabase Realtime para atualizações live

## Fluxo de dados

1. **Interface** → Componentes React
2. **Estado** → React Query (cache) + Supabase Client
3. **Autenticação** → Supabase Auth
4. **Persistência** → PostgreSQL via Supabase

## Padrões de desenvolvimento

### Componentes

```tsx
// ✅ Bom: Componente focado e reutilizável
export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  return (
    <Card>
      <CardHeader>
        <h3>{task.title}</h3>
      </CardHeader>
      {/* ... */}
    </Card>
  );
};

// ❌ Evite: Componentes muito grandes
export const TaskManagement = () => {
  // 200+ linhas de código
  // Múltiplas responsabilidades
};
```

### Hooks customizados

```tsx
// ✅ Bom: Hook específico para lógica de negócio
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => supabase.from('tasks').select('*'),
  });
};

// ✅ Bom: Hook para formulários
export const useTaskForm = (taskId?: string) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });
  
  // Lógica de submit, validação, etc.
  
  return { form, handleSubmit, isLoading };
};
```

### Gerenciamento de estado

```tsx
// ✅ React Query para dados do servidor
const { data: tasks } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
});

// ✅ useState para estado local do componente
const [isOpen, setIsOpen] = useState(false);

// ✅ Context para estado global da aplicação
const { user } = useAuth();
```

## Integração com Supabase

### Configuração do cliente

```tsx
import { supabase } from '@/integrations/supabase/client';

// ✅ Operações básicas
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', userId);

// ✅ Com RLS automático
const { data } = await supabase
  .from('tasks')
  .insert([{ title, description }]);
```

### Políticas RLS

```sql
-- ✅ Usuários só veem suas próprias tarefas
CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- ✅ Usuários só editam suas próprias tarefas  
CREATE POLICY "Users can edit own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);
```

## Tratamento de erros

### Padrão para APIs

```tsx
// ✅ Com React Query
const { data, error, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  onError: (error) => {
    toast.error('Erro ao carregar tarefas');
    console.error('Tasks fetch error:', error);
  },
});

// ✅ Tratamento manual
const handleSubmit = async (data: TaskFormData) => {
  try {
    await createTask(data);
    toast.success('Tarefa criada com sucesso!');
  } catch (error) {
    console.error('Create task error:', error);
    toast.error('Erro ao criar tarefa');
  }
};
```

### Error Boundaries

```tsx
// ✅ Para capturar erros de componentes
export const TaskErrorBoundary = ({ children }: PropsWithChildren) => {
  return (
    <ErrorBoundary
      FallbackComponent={TaskErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Task boundary error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## Performance

### Code Splitting

```tsx
// ✅ Lazy loading de páginas
const TasksPage = lazy(() => import('@/pages/Tasks'));
const ClientsPage = lazy(() => import('@/pages/Clients'));

// ✅ Suspense para fallback
<Suspense fallback={<LoadingScreen />}>
  <Routes>
    <Route path="/tasks" element={<TasksPage />} />
    <Route path="/clients" element={<ClientsPage />} />
  </Routes>
</Suspense>
```

### Otimizações React Query

```tsx
// ✅ Stale time para reduzir refetches
const { data } = useQuery({
  queryKey: ['tasks'],
  queryFn: fetchTasks,
  staleTime: 5 * 60 * 1000, // 5 minutos
});

// ✅ Invalidação específica
const queryClient = useQueryClient();
await createTask(data);
queryClient.invalidateQueries(['tasks']);
```

## Debugging

### Console logs estruturados

```tsx
// ✅ Logs informativos
console.log('Task created:', { taskId, userId, timestamp: Date.now() });

// ✅ Logs de erro com contexto
console.error('Failed to create task:', {
  error,
  formData,
  userId,
  timestamp: Date.now(),
});
```

### Ferramentas úteis

- **React Developer Tools**: Para debug de componentes
- **React Query DevTools**: Para debug de cache
- **Supabase Dashboard**: Para debug de dados e políticas

## Segurança

### Validação de dados

```tsx
// ✅ Schema Zod para validação
const taskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  due_date: z.date(),
});

// ✅ Validação no frontend e backend
const { data, error } = taskSchema.safeParse(formData);
```

### Autenticação

```tsx
// ✅ Proteção de rotas
const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};
```

## Deploy e CI/CD

### Build do projeto

```bash
# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Variáveis de ambiente

```env
# ✅ Desenvolvimento
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# ✅ Produção (configurado automaticamente no Lovable)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
```

## Próximos passos

1. **Testes**: Implementar Jest + React Testing Library
2. **Monitoring**: Adicionar Sentry ou similar
3. **Analytics**: Implementar tracking de eventos
4. **PWA**: Transformar em Progressive Web App
5. **Mobile**: Considerar React Native ou Capacitor

---

Para dúvidas específicas sobre desenvolvimento, consulte o [guia de contribuição](CONTRIBUTING.md) ou abra uma discussão no GitHub.
