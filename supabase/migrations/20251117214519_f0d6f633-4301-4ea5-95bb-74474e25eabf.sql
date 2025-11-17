-- Criar tabela de agendamentos de banho e tosa
CREATE TABLE public.grooming_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  pet_name TEXT NOT NULL,
  pet_type TEXT NOT NULL,
  pet_size TEXT NOT NULL,
  service_type TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.grooming_appointments ENABLE ROW LEVEL SECURITY;

-- Política: Permitir inserção pública
CREATE POLICY "Allow public insert to grooming_appointments"
ON public.grooming_appointments
FOR INSERT
TO public
WITH CHECK (true);

-- Política: Admins podem gerenciar todos os agendamentos
CREATE POLICY "Admins can manage grooming_appointments"
ON public.grooming_appointments
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_grooming_appointments_updated_at
BEFORE UPDATE ON public.grooming_appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();