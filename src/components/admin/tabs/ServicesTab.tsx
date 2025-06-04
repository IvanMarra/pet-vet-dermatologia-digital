
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  services_list: string[];
  is_active: boolean;
  display_order: number;
}

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
    category: '',
    services_list: [''],
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      
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
      const serviceData = {
        ...formData,
        services_list: formData.services_list.filter(item => item.trim() !== '')
      };

      if (editingService) {
        await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
      } else {
        await supabase
          .from('services')
          .insert([serviceData]);
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
      category: '',
      services_list: [''],
      is_active: true,
      display_order: 0
    });
    setEditingService(null);
    setShowForm(false);
  };

  const editService = (service: Service) => {
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || '',
      category: service.category,
      services_list: service.services_list || [''],
      is_active: service.is_active,
      display_order: service.display_order
    });
    setEditingService(service);
    setShowForm(true);
  };

  const addServiceItem = () => {
    setFormData({
      ...formData,
      services_list: [...formData.services_list, '']
    });
  };

  const removeServiceItem = (index: number) => {
    const newList = formData.services_list.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      services_list: newList
    });
  };

  const updateServiceItem = (index: number, value: string) => {
    const newList = [...formData.services_list];
    newList[index] = value;
    setFormData({
      ...formData,
      services_list: newList
    });
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Ícone (nome do Lucide)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="ex: Stethoscope"
                />
              </div>
              <div>
                <Label>Ordem de Exibição</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <Label>Lista de Serviços</Label>
              {formData.services_list.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={item}
                    onChange={(e) => updateServiceItem(index, e.target.value)}
                    placeholder="Digite um serviço"
                  />
                  {formData.services_list.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeServiceItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addServiceItem}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label>Serviço Ativo</Label>
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

      <div className="grid md:grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.category}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editService(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{service.description}</p>
              
              {service.services_list && (
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Serviços inclusos:</h4>
                  <ul className="space-y-1">
                    {service.services_list.map((item, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Ordem: {service.display_order}
                </span>
                {!service.is_active && (
                  <span className="text-xs text-red-500">Inativo</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
