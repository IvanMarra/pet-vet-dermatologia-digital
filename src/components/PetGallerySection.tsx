import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Heart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LazyImage from '@/components/LazyImage';
import type { Tables } from '@/integrations/supabase/types';

type PetPhoto = Tables<'pet_gallery'>;

const PetGallerySection = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    pet_name: '',
    owner_name: '',
    category: '',
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
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

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
        category: formData.category,
        service_date: formData.service_date,
        image_with_watermark: response.data.imageUrl,
        image_url: response.data.imageUrl,
        is_active: false, // Admin precisa aprovar
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
        category: '',
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

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mural dos Pets PopularVET 🐾
          </h2>
          <p className="text-xl text-muted-foreground">
            Veja como nossos clientes ficam ainda mais lindos!
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg">
                <Upload className="mr-2 h-5 w-5" />
                Enviar foto do meu pet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enviar Foto do Pet</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpload} className="space-y-4 py-4">
                <div>
                  <Label htmlFor="petName">Nome do Pet *</Label>
                  <Input 
                    id="petName" 
                    placeholder="Ex: Rex" 
                    value={formData.pet_name}
                    onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Seu Nome (opcional)</Label>
                  <Input 
                    id="ownerName" 
                    placeholder="Ex: Maria Silva" 
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria do Serviço *</Label>
                  <Select 
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Banho & Tosa">Banho & Tosa</SelectItem>
                      <SelectItem value="Terapêutico">Terapêutico</SelectItem>
                      <SelectItem value="Dermato">Dermato</SelectItem>
                      <SelectItem value="Estética">Estética</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="photo">Foto *</Label>
                  <Input 
                    id="photo" 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp" 
                    onChange={handleFileSelect}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Máximo 5MB. A imagem será otimizada automaticamente.
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Enviar Foto'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Photo Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma foto publicada ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <Card 
                key={photo.id} 
                className="overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <LazyImage 
                    src={photo.image_with_watermark || photo.image_url} 
                    alt={photo.pet_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4 text-destructive" />
                  </div>
                </div>
                <CardContent className="p-4 bg-white">
                  <h3 className="font-bold text-lg text-foreground">{photo.pet_name}</h3>
                  {photo.owner_name && (
                    <p className="text-sm text-muted-foreground">Tutor: {photo.owner_name}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {photo.category} • {new Date(photo.service_date || '').toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PetGallerySection;
