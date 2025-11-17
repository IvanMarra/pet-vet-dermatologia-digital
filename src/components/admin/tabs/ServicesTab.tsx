import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Service = Tables<'services'>;

const ServicesTab = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Erro ao carregar serviços:', error);
        return;
      }
      
      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveService = async () => {
    try {
      if (editingService) {
        await supabase
          .from('services')
          .update(formData)
          .eq('id', editingService.id);
      } else {
        await supabase
          .from('services')
          .insert([formData]);
      }
      
      loadServices();
      resetForm();
      toast({
        title: "Sucesso",
        description: "Serviço salvo com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar serviço",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string) => {
    try {
      await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      loadServices();
      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir serviço",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      icon: '',
      is_active: true,
      display_order: 0
    });
    setEditingService(null);
    setShowForm(false);
  };

  const editService = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description || '',
      icon: service.icon || '',
      is_active: service.is_active ?? true,
      display_order: service.display_order ?? 0
    });
    setEditingService(service);
    setShowForm(true);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Serviços</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? 'Editar Serviço' : 'Novo Serviço'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Nome do serviço"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição do serviço"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Ícone (opcional)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                placeholder="Nome do ícone (ex: Scissors)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Ordem de Exibição</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label>Ativo</Label>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={saveService}>
                {editingService ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{service.title}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Ordem: {service.display_order}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => editService(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => deleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
