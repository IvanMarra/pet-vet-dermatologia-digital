
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, MoveUp, MoveDown } from 'lucide-react';
import ImageUpload from '../ImageUpload';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  cta_text: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const HeroSlidesTab = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    cta_text: 'Agendar Consulta',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      const { data } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (data) {
        setSlides(data);
      }
    } catch (error) {
      console.error('Erro ao carregar slides:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSlide = async () => {
    try {
      if (editingSlide) {
        await supabase
          .from('hero_slides')
          .update(formData)
          .eq('id', editingSlide.id);
      } else {
        const maxOrder = Math.max(...slides.map(s => s.display_order), 0);
        await supabase
          .from('hero_slides')
          .insert([{ ...formData, display_order: maxOrder + 1 }]);
      }
      
      loadSlides();
      resetForm();
      toast({
        title: "Sucesso",
        description: "Slide salvo com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar slide",
        variant: "destructive",
      });
    }
  };

  const deleteSlide = async (id: string) => {
    try {
      await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id);
      
      loadSlides();
      toast({
        title: "Sucesso",
        description: "Slide excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir slide:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir slide",
        variant: "destructive",
      });
    }
  };

  const updateSlideOrder = async (id: string, newOrder: number) => {
    try {
      await supabase
        .from('hero_slides')
        .update({ display_order: newOrder })
        .eq('id', id);
      
      loadSlides();
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
    }
  };

  const moveSlide = (slide: HeroSlide, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === slide.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < slides.length) {
      const targetSlide = slides[targetIndex];
      updateSlideOrder(slide.id, targetSlide.display_order);
      updateSlideOrder(targetSlide.id, slide.display_order);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image_url: '',
      cta_text: 'Agendar Consulta',
      display_order: 0,
      is_active: true
    });
    setEditingSlide(null);
    setShowForm(false);
  };

  const editSlide = (slide: HeroSlide) => {
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image_url: slide.image_url || '',
      cta_text: slide.cta_text || 'Agendar Consulta',
      display_order: slide.display_order,
      is_active: slide.is_active
    });
    setEditingSlide(slide);
    setShowForm(true);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Slides do Hero</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Slide
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSlide ? 'Editar Slide' : 'Novo Slide'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Título principal do slide"
                required
              />
            </div>

            <div>
              <Label>Subtítulo</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                placeholder="Subtítulo opcional"
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição detalhada do slide"
                rows={3}
              />
            </div>

            <div>
              <Label>Texto do Botão</Label>
              <Input
                value={formData.cta_text}
                onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                placeholder="Ex: Agendar Consulta"
              />
            </div>

            <ImageUpload
              bucket="hero-images"
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({...formData, image_url: url})}
              onImageRemoved={() => setFormData({...formData, image_url: ''})}
              label="Imagem do Slide"
              recommendedSize="1920x1080 pixels"
              maxSizeMB={5}
            />

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
              />
              <Label>Slide ativo</Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveSlide}>
                {editingSlide ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {slides.map((slide, index) => (
          <Card key={slide.id} className={slide.is_active ? '' : 'opacity-50'}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{slide.title}</h3>
                    {!slide.is_active && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        Inativo
                      </span>
                    )}
                  </div>
                  {slide.subtitle && (
                    <p className="text-primary font-medium mb-1">{slide.subtitle}</p>
                  )}
                  {slide.description && (
                    <p className="text-gray-600 mb-2">{slide.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Botão: {slide.cta_text} | Ordem: {slide.display_order}
                  </p>
                </div>
                
                {slide.image_url && (
                  <div className="ml-4">
                    <img
                      src={slide.image_url}
                      alt={slide.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  </div>
                )}
                
                <div className="flex flex-col gap-1 ml-4">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSlide(slide, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => moveSlide(slide, 'down')}
                      disabled={index === slides.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => editSlide(slide)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteSlide(slide.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HeroSlidesTab;
