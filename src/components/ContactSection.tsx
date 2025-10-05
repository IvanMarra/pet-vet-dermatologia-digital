
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status?: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [contactData, setContactData] = useState({
    address: 'Rua das Flores, 123\nCentro, São Paulo - SP\nCEP: 01234-567',
    phone: '(11) 9999-9999',
    email: 'contato@clinicaveterinaria.com',
    hours: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 12h\nEmergências: 24h'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      console.log('🔍 Carregando dados de contato...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'contact');
      
      if (error) {
        console.error('❌ Erro ao carregar dados de contato:', error);
        return;
      }

      console.log('📋 Dados de contato encontrados:', data);
      
      if (data && data.length > 0) {
        const settingsObj: { [key: string]: any } = {};
        
        data.forEach(item => {
          let value = item.value;
          
          // Processar strings com quebras de linha
          if (typeof value === 'string' && value.includes('<br>')) {
            value = value.replace(/<br>/g, '\n');
          }
          
          settingsObj[item.key] = value;
        });

        console.log('✅ Dados de contato processados:', settingsObj);

        setContactData(prev => {
          // Processar endereço completo ou campos separados
          let fullAddress = prev.address;
          if (settingsObj.address) {
            fullAddress = settingsObj.address;
          } else if (settingsObj.street || settingsObj.city_state || settingsObj.cep) {
            const addressParts = [];
            if (settingsObj.street) addressParts.push(settingsObj.street);
            if (settingsObj.city_state) addressParts.push(settingsObj.city_state);
            if (settingsObj.cep) addressParts.push(`CEP: ${settingsObj.cep}`);
            fullAddress = addressParts.join('\n');
          }

          // Processar horários
          let fullHours = prev.hours;
          if (settingsObj.hours) {
            fullHours = settingsObj.hours;
          } else if (settingsObj.hours_weekdays || settingsObj.hours_saturday || settingsObj.emergency_hours) {
            const hoursParts = [];
            if (settingsObj.hours_weekdays) hoursParts.push(settingsObj.hours_weekdays);
            if (settingsObj.hours_saturday) hoursParts.push(settingsObj.hours_saturday);
            if (settingsObj.emergency_hours) hoursParts.push(settingsObj.emergency_hours);
            fullHours = hoursParts.join('\n');
          }

          return {
            ...prev,
            address: fullAddress,
            phone: settingsObj.phone || prev.phone,
            email: settingsObj.email || prev.email,
            hours: fullHours
          };
        });
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao carregar contato:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save contact directly using insert
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message,
          status: 'new'
        }]);

      if (error) throw error;

      // Track analytics event with error handling
      try {
        await supabase
          .from('site_analytics')
          .insert([{
            event_type: 'contact_form_submit',
            page_path: window.location.pathname,
            additional_data: { form_type: 'contact' }
          }]);
      } catch (analyticsError) {
        console.log('Analytics tracking failed - this is non-critical:', analyticsError);
      }

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo seu contato. Responderemos em breve!",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Estamos aqui para cuidar do seu pet. Entre em contato conosco para agendar uma consulta ou esclarecer suas dúvidas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {contactData.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Telefone</h3>
                    <p className="text-muted-foreground">{contactData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">E-mail</h3>
                    <p className="text-muted-foreground">{contactData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {contactData.hours}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Envie sua Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
