
-- Criar tabela de projetos
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  client_logo TEXT,
  start_date DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Atualizar tabela de tarefas para referenciar projetos corretamente
ALTER TABLE public.tasks DROP COLUMN IF EXISTS company_name;
ALTER TABLE public.tasks DROP COLUMN IF EXISTS company_logo;
ALTER TABLE public.tasks ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE public.tasks ADD CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;

-- Criar tabela de materiais
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  file_type TEXT NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending-approval' CHECK (status IN ('pending-approval', 'approved', 'changes-requested')),
  feedback TEXT,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  address TEXT,
  website TEXT,
  industry TEXT,
  contact_person TEXT,
  logo_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  looker_studio_embed TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de prospects para CRM
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  position TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de mensagens do chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para arquivos/uploads
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para projects
CREATE POLICY "Users can view all projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update projects" ON public.projects FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete projects they created" ON public.projects FOR DELETE USING (created_by = auth.uid());

-- Políticas RLS para materials
CREATE POLICY "Users can view all materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create materials" ON public.materials FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update materials" ON public.materials FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete materials they uploaded" ON public.materials FOR DELETE USING (uploaded_by = auth.uid());

-- Políticas RLS para clients (apenas admins)
CREATE POLICY "Admins can manage clients" ON public.clients FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Políticas RLS para prospects
CREATE POLICY "Users can view all prospects" ON public.prospects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create prospects" ON public.prospects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update prospects" ON public.prospects FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Políticas RLS para chat_messages
CREATE POLICY "Users can view project messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Políticas RLS para file_uploads
CREATE POLICY "Users can view all file uploads" ON public.file_uploads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload files" ON public.file_uploads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete files they uploaded" ON public.file_uploads FOR DELETE USING (uploaded_by = auth.uid());

-- Criar bucket para storage de arquivos
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', true);

-- Políticas para storage
CREATE POLICY "Anyone can view files" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own files" ON storage.objects FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own files" ON storage.objects FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Inserir dados de exemplo
INSERT INTO public.clients (name, email, phone, address, industry, contact_person, status) VALUES
('Empresa ABC', 'contato@empresaabc.com', '(11) 99999-9999', 'São Paulo, SP', 'Tecnologia', 'João Silva', 'active'),
('Empresa XYZ', 'contato@empresaxyz.com', '(11) 88888-8888', 'Rio de Janeiro, RJ', 'Marketing', 'Maria Santos', 'active'),
('Empresa 123', 'contato@empresa123.com', '(11) 77777-7777', 'Belo Horizonte, MG', 'Varejo', 'Pedro Costa', 'active');

-- Inserir projetos de exemplo
INSERT INTO public.projects (name, description, client_name, start_date, due_date, status, progress, created_by) VALUES
('Campanha de Lançamento', 'Campanha completa para lançamento do novo produto XYZ', 'Empresa ABC', '2025-04-01', '2025-05-28', 'active', 75, (SELECT id FROM auth.users LIMIT 1)),
('Redesign de Site', 'Redesign completo do site institucional', 'Empresa XYZ', '2025-03-15', '2025-06-15', 'active', 40, (SELECT id FROM auth.users LIMIT 1)),
('Campanha de Mídia Social', 'Gestão de mídias sociais mensal', 'Empresa 123', '2025-01-01', '2025-12-31', 'active', 90, (SELECT id FROM auth.users LIMIT 1));
