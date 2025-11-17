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
import type { Tables } from '@/integrations/supabase/types';

type Testimonial = Tables<'testimonials'>;

const TestimonialsTab = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    author_name: '',
    content: '',
    rating: 5,
    author_image: '',
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
      author_name: '',
      content: '',
      rating: 5,
      author_image: '',
      is_active: true
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const editTestimonial = (testimonial: Testimonial) => {
    setFormData({
      author_name: testimonial.author_name,
      content: testimonial.content,
      rating: testimonial.rating || 5,
      author_image: testimonial.author_image || '',
      is_active: testimonial.is_active ?? true
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
            <div className="space-y-2">
              <Label htmlFor="author_name">Nome do Cliente</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author_image">URL da Foto (opcional)</Label>
              <Input
                id="author_image"
                value={formData.author_image}
                onChange={(e) => setFormData({...formData, author_image: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Depoimento</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Escreva o depoimento aqui..."
                rows={4}
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
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  {testimonial.author_image && (
                    <img 
                      src={testimonial.author_image} 
                      alt={testimonial.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{testimonial.author_name}</h3>
                      {!testimonial.is_active && (
                        <Badge variant="secondary">Inativo</Badge>
                      )}
                    </div>
                    <div className="flex gap-1 my-1">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => editTestimonial(testimonial)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => deleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsTab;
