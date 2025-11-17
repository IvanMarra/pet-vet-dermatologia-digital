import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Upload, X } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { ReprocessImagesButton } from '@/components/admin/ReprocessImagesButton';

type PetGallery = Tables<'pet_gallery'>;
type PetGalleryImage = Tables<'pet_gallery_images'>;

interface PetGalleryWithImages extends PetGallery {
  images: PetGalleryImage[];
}

const PetGalleryTab = () => {
  const { toast } = useToast();
  const [pets, setPets] = useState<PetGalleryWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetGalleryWithImages | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [petToDelete, setPetToDelete] = useState<PetGalleryWithImages | null>(null);

  const [formData, setFormData] = useState({
    pet_name: '',
    owner_name: '',
    category: '',
    service_date: new Date().toISOString().split('T')[0],
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const { data: petsData, error: petsError } = await supabase
        .from('pet_gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (petsError) throw petsError;

      const petsWithImages = await Promise.all(
        (petsData || []).map(async (pet) => {
          const { data: imagesData, error: imagesError } = await supabase
            .from('pet_gallery_images')
            .select('*')
            .eq('pet_gallery_id', pet.id)
            .order('display_order', { ascending: true });

          if (imagesError) throw imagesError;

          return {
            ...pet,
            images: imagesData || [],
          };
        })
      );

      setPets(petsWithImages);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar pets',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: `${file.name}: tamanho máximo é 10MB`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (petId: string, files: File[]) => {
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Não autenticado');

      const response = await supabase.functions.invoke('optimize-image', {
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      uploadedUrls.push(response.data.imageUrl);
    }

    const imageInserts = uploadedUrls.map((url, index) => ({
      pet_gallery_id: petId,
      image_url: url,
      display_order: index,
    }));

    const { error: insertError } = await supabase
      .from('pet_gallery_images')
      .insert(imageInserts);

    if (insertError) throw insertError;

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPet && selectedFiles.length === 0) {
      toast({
        title: 'Nenhuma imagem selecionada',
        description: 'Por favor, selecione pelo menos uma imagem',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const petData = {
        pet_name: formData.pet_name,
        owner_name: formData.owner_name || null,
        category: formData.category,
        service_date: formData.service_date,
        image_url: '',
        image_with_watermark: null,
      };

      if (editingPet) {
        const { error: updateError } = await supabase
          .from('pet_gallery')
          .update(petData)
          .eq('id', editingPet.id);

        if (updateError) throw updateError;

        if (selectedFiles.length > 0) {
          await uploadImages(editingPet.id, selectedFiles);
        }

        toast({
          title: 'Pet atualizado com sucesso!',
        });
      } else {
        const { data: newPet, error: insertError } = await supabase
          .from('pet_gallery')
          .insert([petData])
          .select()
          .single();

        if (insertError) throw insertError;

        await uploadImages(newPet.id, selectedFiles);

        toast({
          title: 'Pet adicionado com sucesso!',
        });
      }

      fetchPets();
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar pet',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (pet: PetGalleryWithImages) => {
    try {
      const { error } = await supabase
        .from('pet_gallery')
        .update({ is_active: !pet.is_active })
        .eq('id', pet.id);

      if (error) throw error;

      toast({
        title: pet.is_active ? 'Pet ocultado' : 'Pet publicado',
      });

      fetchPets();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar visibilidade',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteImage = async (imageId: string, petId: string) => {
    try {
      const { error } = await supabase
        .from('pet_gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      toast({
        title: 'Imagem deletada com sucesso!',
      });

      fetchPets();
    } catch (error: any) {
      toast({
        title: 'Erro ao deletar imagem',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!petToDelete) return;

    try {
      const { error: imagesError } = await supabase
        .from('pet_gallery_images')
        .delete()
        .eq('pet_gallery_id', petToDelete.id);

      if (imagesError) throw imagesError;

      const { error } = await supabase
        .from('pet_gallery')
        .delete()
        .eq('id', petToDelete.id);

      if (error) throw error;

      toast({
        title: 'Pet deletado com sucesso!',
      });

      fetchPets();
      setDeleteDialogOpen(false);
      setPetToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao deletar pet',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (pet: PetGalleryWithImages) => {
    setEditingPet(pet);
    setFormData({
      pet_name: pet.pet_name,
      owner_name: pet.owner_name || '',
      category: pet.category,
      service_date: pet.service_date || new Date().toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPet(null);
    setFormData({
      pet_name: '',
      owner_name: '',
      category: '',
      service_date: new Date().toISOString().split('T')[0],
    });
    setSelectedFiles([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Galeria de Pets</h2>
          <p className="text-muted-foreground">Gerencie as fotos do Mural dos Pets com múltiplas imagens</p>
        </div>
        <div className="flex gap-2">
          <ReprocessImagesButton />
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Pet
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPet ? 'Editar Pet' : 'Adicionar Novo Pet'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="owner_name">Nome do Tutor</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banho-simples">Banho Simples</SelectItem>
                    <SelectItem value="banho-tosa">Banho e Tosa</SelectItem>
                    <SelectItem value="banho-hidratacao">Banho e Hidratação</SelectItem>
                    <SelectItem value="banho-terapeutico">Banho Terapêuticos</SelectItem>
                    <SelectItem value="banho-dermatologico">Banho Dermatológico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="service_date">Data do Serviço</Label>
                <Input
                  id="service_date"
                  type="date"
                  value={formData.service_date}
                  onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="photos">Fotos {!editingPet && '*'}</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  multiple
                  required={!editingPet}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  As imagens serão otimizadas para 800x800px e terão marca d'água adicionada
                </p>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                        <span className="truncate">{file.name}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  editingPet ? 'Atualizar Pet' : 'Adicionar Pet'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <Card key={pet.id} className="overflow-hidden group">
            <div className="relative">
              {pet.images.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {pet.images.map((image, index) => (
                      <CarouselItem key={image.id}>
                        <div className="relative aspect-square">
                          <img
                            src={image.image_url}
                            alt={`${pet.pet_name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteImage(image.id, pet.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {pet.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 rounded">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => openEditDialog(pet)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleToggleActive(pet)}
                >
                  {pet.is_active ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    setPetToDelete(pet);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {!pet.is_active && (
                <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold">
                  OCULTO
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-bold text-lg">{pet.pet_name}</h3>
              {pet.owner_name && (
                <p className="text-sm text-muted-foreground">Tutor: {pet.owner_name}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {pet.category} • {new Date(pet.service_date || '').toLocaleDateString('pt-BR')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {pet.images.length} {pet.images.length === 1 ? 'foto' : 'fotos'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar {petToDelete?.pet_name} e todas as suas fotos? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PetGalleryTab;
