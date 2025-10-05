
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  client_name: string;
  pet_name: string;
  rating: number;
  comment: string;
  is_featured: boolean;
  is_active: boolean;
}

const TestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    client_name: '',
    pet_name: '',
    rating: 5,
    comment: '',
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Erro ao carregar depoimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTestimonial = async () => {
    try {
      if (editingTestimonial) {
        await supabase
          .from('testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);
      } else {
        await supabase
          .from('testimonials')
          .insert([formData]);
      }
      
      loadTestimonials();
      resetForm();
      toast({
        title: "Sucesso",
        description: "Depoimento salvo com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar depoimento",
        variant: "destructive",
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      loadTestimonials();
      toast({
        title: "Sucesso",
        description: "Depoimento excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir depoimento",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      client_name: '',
      pet_name: '',
      rating: 5,
      comment: '',
      is_featured: false,
      is_active: true
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setFormData({
      client_name: testimonial.client_name,
      pet_name: testimonial.pet_name || '',
      rating: testimonial.rating,
      comment: testimonial.comment,
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active
    });
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gerenciar Depoimentos</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Depoimento
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Nome do Cliente</Label>
                <Input
                  value={formData.client_name}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Nome do Pet</Label>
                <Input
                  value={formData.pet_name}
                  onChange={(e) => setFormData({...formData, pet_name: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label>Avaliação (1-5 estrelas)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <Label>Comentário</Label>
              <Textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                rows={4}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                />
                <Label>Destacar</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label>Ativo</Label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={saveTestimonial}>
                {editingTestimonial ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">{testimonial.client_name}</h3>
                  {testimonial.pet_name && (
                    <p className="text-sm text-gray-600">Pet: {testimonial.pet_name}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(testimonial.rating)}
                    <div className="flex gap-2">
                      {testimonial.is_featured && (
                        <Badge variant="secondary">Destacado</Badge>
                      )}
                      {!testimonial.is_active && (
                        <Badge variant="outline">Inativo</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editTestimonial(testimonial)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.comment}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsTab;
