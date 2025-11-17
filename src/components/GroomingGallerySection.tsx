import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LazyImage from '@/components/LazyImage';
import type { Tables } from '@/integrations/supabase/types';

type PetPhoto = Tables<'pet_gallery'>;

const GroomingGallerySection = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    pet_name: '',
    owner_name: '',
    service_date: new Date().toISOString().split('T')[0],
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_gallery')
        .select('*')
        .eq('category', 'banho-tosa')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setPhotos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O tamanho máximo é 5MB',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);

      const response = await supabase.functions.invoke('optimize-image', {
        body: formDataToSend,
      });

      if (response.error) throw response.error;

      const photoData = {
        pet_name: formData.pet_name,
        owner_name: formData.owner_name || null,
        category: 'banho-tosa',
        service_date: formData.service_date,
        image_with_watermark: response.data.imageUrl,
        image_url: response.data.imageUrl,
        is_active: false,
      };

      const { error } = await supabase
        .from('pet_gallery')
        .insert([photoData]);

      if (error) throw error;

      toast({
        title: 'Foto enviada com sucesso!',
        description: 'Sua foto será exibida após aprovação do administrador.',
      });

      setDialogOpen(false);
      setFormData({
        pet_name: '',
        owner_name: '',
        service_date: new Date().toISOString().split('T')[0],
      });
      setSelectedFile(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao enviar foto',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Galeria de Transformações</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossos Trabalhos de Banho & Tosa
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Confira alguns dos nossos pets que já passaram por aqui e saíram ainda mais lindos!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {photos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <LazyImage
                    src={photo.image_with_watermark || photo.image_url}
                    alt={photo.pet_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="font-semibold text-lg">{photo.pet_name}</p>
                      {photo.owner_name && (
                        <p className="text-sm opacity-90">por {photo.owner_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="shadow-lg">
                <Upload className="h-5 w-5 mr-2" />
                Compartilhe a foto do seu pet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Compartilhe a foto do seu pet</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <Label htmlFor="pet_name">Nome do Pet *</Label>
                  <Input
                    id="pet_name"
                    value={formData.pet_name}
                    onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="owner_name">Seu Nome (opcional)</Label>
                  <Input
                    id="owner_name"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="service_date">Data do Serviço</Label>
                  <Input
                    id="service_date"
                    type="date"
                    value={formData.service_date}
                    onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="photo">Foto *</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo 5MB - JPG, PNG ou WEBP
                  </p>
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Foto
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default GroomingGallerySection;
