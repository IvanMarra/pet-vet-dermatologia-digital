import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AVAILABLE_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const SERVICES = [
  { value: 'banho-simples', label: 'Banho Simples' },
  { value: 'banho-tosa', label: 'Banho e Tosa' },
  { value: 'tosa-higienica', label: 'Tosa Higiênica' },
  { value: 'hidratacao', label: 'Hidratação' },
  { value: 'escovacao', label: 'Escovação' },
];

const PET_SIZES = [
  { value: 'pequeno', label: 'Pequeno (até 10kg)' },
  { value: 'medio', label: 'Médio (10-25kg)' },
  { value: 'grande', label: 'Grande (acima de 25kg)' },
];

const GroomingAppointmentForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    pet_name: '',
    pet_type: '',
    pet_size: '',
    service_type: '',
    appointment_time: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: 'Data obrigatória',
        description: 'Por favor, selecione uma data para o agendamento.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('grooming_appointments')
        .insert([{
          ...formData,
          appointment_date: format(date, 'yyyy-MM-dd'),
        }]);

      if (error) throw error;

      toast({
        title: 'Agendamento solicitado!',
        description: 'Em breve entraremos em contato para confirmar o horário.',
      });

      // Reset form
      setFormData({
        client_name: '',
        client_phone: '',
        client_email: '',
        pet_name: '',
        pet_type: '',
        pet_size: '',
        service_type: '',
        appointment_time: '',
        notes: '',
      });
      setDate(undefined);
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: 'Erro ao agendar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Agende seu Banho & Tosa</CardTitle>
              <CardDescription className="text-center">
                Preencha o formulário abaixo e entraremos em contato para confirmar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações do Cliente */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Seus Dados</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="client_name">Nome Completo *</Label>
                      <Input
                        id="client_name"
                        required
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="client_phone">Telefone/WhatsApp *</Label>
                      <Input
                        id="client_phone"
                        required
                        type="tel"
                        value={formData.client_phone}
                        onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client_email">E-mail</Label>
                    <Input
                      id="client_email"
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Informações do Pet */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Dados do Pet</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pet_name">Nome do Pet *</Label>
                      <Input
                        id="pet_name"
                        required
                        value={formData.pet_name}
                        onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
                        placeholder="Nome do seu pet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pet_type">Tipo *</Label>
                      <Input
                        id="pet_type"
                        required
                        value={formData.pet_type}
                        onChange={(e) => setFormData({ ...formData, pet_type: e.target.value })}
                        placeholder="Ex: Cachorro, Gato"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pet_size">Porte do Pet *</Label>
                    <Select
                      required
                      value={formData.pet_size}
                      onValueChange={(value) => setFormData({ ...formData, pet_size: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        {PET_SIZES.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Serviço e Agendamento */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Serviço e Data</h3>
                  <div className="space-y-2">
                    <Label htmlFor="service_type">Serviço Desejado *</Label>
                    <Select
                      required
                      value={formData.service_type}
                      onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICES.map((service) => (
                          <SelectItem key={service.value} value={service.value}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Data Preferencial *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP', { locale: ptBR }) : 'Selecione uma data'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="appointment_time">Horário Preferencial *</Label>
                      <Select
                        required
                        value={formData.appointment_time}
                        onValueChange={(value) => setFormData({ ...formData, appointment_time: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {AVAILABLE_TIMES.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Alguma observação importante sobre seu pet?"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Solicitar Agendamento'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GroomingAppointmentForm;
