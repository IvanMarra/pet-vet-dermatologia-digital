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
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type PetGallery = Tables<'pet_gallery'>;

const PetGalleryTab = () => {
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PetGallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PetGallery | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<PetGallery | null>(null);

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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar fotos',
        description: error.message,
        variant: 'destructive',
      });
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

  const uploadImage = async (file: File) => {
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
    return response.data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = editingPhoto?.image_with_watermark || '';

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const photoData = {
        pet_name: formData.pet_name,
        owner_name: formData.owner_name || null,
        category: formData.category,
        service_date: formData.service_date,
        image_with_watermark: imageUrl,
        image_url: imageUrl,
      };

      if (editingPhoto) {
        const { error } = await supabase
          .from('pet_gallery')
          .update(photoData)
          .eq('id', editingPhoto.id);

        if (error) throw error;

        toast({
          title: 'Foto atualizada com sucesso!',
        });
      } else {
        const { error } = await supabase
          .from('pet_gallery')
          .insert([photoData]);

        if (error) throw error;

        toast({
          title: 'Foto adicionada com sucesso!',
        });
      }

      fetchPhotos();
      resetForm();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar foto',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (photo: PetGallery) => {
    try {
      const { error } = await supabase
        .from('pet_gallery')
        .update({ is_active: !photo.is_active })
        .eq('id', photo.id);

      if (error) throw error;

      toast({
        title: photo.is_active ? 'Foto ocultada' : 'Foto publicada',
      });

      fetchPhotos();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar visibilidade',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!photoToDelete) return;

    try {
      const { error } = await supabase
        .from('pet_gallery')
        .delete()
        .eq('id', photoToDelete.id);

      if (error) throw error;

      // Try to delete from storage (optional, may fail if image doesn't exist)
      if (photoToDelete.image_with_watermark) {
        const fileName = photoToDelete.image_with_watermark.split('/').pop();
        if (fileName) {
          await supabase.storage.from('pet-gallery').remove([fileName]);
        }
      }

      toast({
        title: 'Foto deletada com sucesso!',
      });

      fetchPhotos();
      setDeleteDialogOpen(false);
      setPhotoToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Erro ao deletar foto',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (photo: PetGallery) => {
    setEditingPhoto(photo);
    setFormData({
      pet_name: photo.pet_name,
      owner_name: photo.owner_name || '',
      category: photo.category,
      service_date: photo.service_date || new Date().toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPhoto(null);
    setFormData({
      pet_name: '',
      owner_name: '',
      category: '',
      service_date: new Date().toISOString().split('T')[0],
    });
    setSelectedFile(null);
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
          <p className="text-muted-foreground">Gerencie as fotos do Mural dos Pets</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPhoto ? 'Editar Foto' : 'Adicionar Nova Foto'}</DialogTitle>
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
                    <SelectItem value="Banho & Tosa">Banho & Tosa</SelectItem>
                    <SelectItem value="Terapêutico">Terapêutico</SelectItem>
                    <SelectItem value="Dermato">Dermato</SelectItem>
                    <SelectItem value="Estética">Estética</SelectItem>
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
                <Label htmlFor="photo">Foto {!editingPhoto && '*'}</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  required={!editingPhoto}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A imagem será automaticamente otimizada para 800x800px
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingPhoto ? 'Atualizando...' : 'Processando...'}
                  </>
                ) : (
                  editingPhoto ? 'Atualizar Foto' : 'Adicionar Foto'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden group">
            <div className="relative aspect-square">
              <img
                src={photo.image_with_watermark || photo.image_url}
                alt={photo.pet_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => openEditDialog(photo)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleToggleActive(photo)}
                >
                  {photo.is_active ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    setPhotoToDelete(photo);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {!photo.is_active && (
                <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-bold">
                  OCULTO
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-bold">{photo.pet_name}</h3>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a foto de {photoToDelete?.pet_name}? Esta ação não pode ser desfeita.
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
