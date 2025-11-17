import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Transformation {
  id: string;
  pet_name: string;
  description: string;
  treatment_duration: string | null;
  before_image_url: string;
  after_image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const TransformationsTab = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTransformation, setEditingTransformation] = useState<Transformation | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pet_name: '',
    description: '',
    treatment_duration: '',
    display_order: 0,
    is_active: true,
  });

  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_transformations')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTransformations(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar transformações',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await supabase.functions.invoke('optimize-image', {
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data.imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let beforeImageUrl = editingTransformation?.before_image_url || '';
      let afterImageUrl = editingTransformation?.after_image_url || '';

      // Upload new images if selected
      if (beforeImage) {
        beforeImageUrl = await uploadImage(beforeImage);
      }
      if (afterImage) {
        afterImageUrl = await uploadImage(afterImage);
      }

      // Check if both images are available
      if (!beforeImageUrl || !afterImageUrl) {
        throw new Error('Ambas as imagens (antes e depois) são obrigatórias');
      }

      const transformationData = {
        ...formData,
        before_image_url: beforeImageUrl,
        after_image_url: afterImageUrl,
      };

      if (editingTransformation) {
        const { error } = await supabase
          .from('pet_transformations')
          .update(transformationData)
          .eq('id', editingTransformation.id);

        if (error) throw error;

        toast({
          title: 'Transformação atualizada!',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        const { error } = await supabase
          .from('pet_transformations')
          .insert([transformationData]);

        if (error) throw error;

        toast({
          title: 'Transformação criada!',
          description: 'A nova transformação foi adicionada com sucesso.',
        });
      }

      setShowDialog(false);
      resetForm();
      fetchTransformations();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar transformação',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      pet_name: '',
      description: '',
      treatment_duration: '',
      display_order: 0,
      is_active: true,
    });
    setBeforeImage(null);
    setAfterImage(null);
    setEditingTransformation(null);
  };

  const handleEdit = (transformation: Transformation) => {
    setEditingTransformation(transformation);
    setFormData({
      pet_name: transformation.pet_name,
      description: transformation.description,
      treatment_duration: transformation.treatment_duration || '',
      display_order: transformation.display_order,
      is_active: transformation.is_active,
    });
    setShowDialog(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('pet_transformations')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Status atualizado!',
        description: `Transformação ${!currentStatus ? 'ativada' : 'desativada'} com sucesso.`,
      });

      fetchTransformations();
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pet_transformations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Transformação excluída!',
        description: 'A transformação foi removida com sucesso.',
      });

      fetchTransformations();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir transformação',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transformações (Antes e Depois)</h2>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Transformação
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {transformations.map((transformation) => (
          <Card key={transformation.id} className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-destructive font-bold text-center mb-1">ANTES</p>
                  <img
                    src={transformation.before_image_url}
                    alt="Antes"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
                <div>
                  <p className="text-xs text-primary font-bold text-center mb-1">DEPOIS</p>
                  <img
                    src={transformation.after_image_url}
                    alt="Depois"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg">{transformation.pet_name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {transformation.description}
                </p>
                {transformation.treatment_duration && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Duração: {transformation.treatment_duration}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={transformation.is_active}
                    onCheckedChange={() =>
                      handleToggleActive(transformation.id, transformation.is_active)
                    }
                  />
                  {transformation.is_active ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(transformation)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setDeleteConfirm(transformation.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTransformation ? 'Editar Transformação' : 'Nova Transformação'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pet_name">Nome do Pet</Label>
              <Input
                id="pet_name"
                value={formData.pet_name}
                onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição da Transformação</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="treatment_duration">Duração do Tratamento (opcional)</Label>
              <Input
                id="treatment_duration"
                placeholder="Ex: 30 dias, 2 meses, etc."
                value={formData.treatment_duration}
                onChange={(e) => setFormData({ ...formData, treatment_duration: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="before_image">Imagem ANTES</Label>
                {editingTransformation?.before_image_url && !beforeImage && (
                  <img
                    src={editingTransformation.before_image_url}
                    alt="Preview antes"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <Input
                  id="before_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBeforeImage(e.target.files?.[0] || null)}
                  required={!editingTransformation}
                />
              </div>

              <div>
                <Label htmlFor="after_image">Imagem DEPOIS</Label>
                {editingTransformation?.after_image_url && !afterImage && (
                  <img
                    src={editingTransformation.after_image_url}
                    alt="Preview depois"
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <Input
                  id="after_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAfterImage(e.target.files?.[0] || null)}
                  required={!editingTransformation}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transformação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransformationsTab;
