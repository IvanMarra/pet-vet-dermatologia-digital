
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  bucket: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  label?: string;
  acceptedTypes?: string;
  maxSizeMB?: number;
  recommendedSize?: string;
}

const ImageUpload = ({
  bucket,
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  label = "Imagem",
  acceptedTypes = "image/*",
  maxSizeMB = 5,
  recommendedSize
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    setUploading(true);
    
    try {
      // Validar tamanho do arquivo
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      }

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione apenas arquivos de imagem');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Obter URL pública correta
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      console.log('📸 URL da imagem gerada:', publicUrl);
      onImageUploaded(publicUrl);
      
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {recommendedSize && (
        <p className="text-sm text-muted-foreground">
          Tamanho recomendado: {recommendedSize}
        </p>
      )}
      
      {currentImageUrl ? (
        <div className="space-y-4">
          <div className="relative inline-block">
            <img
              src={currentImageUrl}
              alt="Imagem atual"
              className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm"
              onError={(e) => {
                console.error('Erro ao carregar imagem:', currentImageUrl);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 shadow-md"
              onClick={removeImage}
              title="Remover imagem"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById(`file-input-${bucket}`)?.click()}
              disabled={uploading}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Enviando...' : 'Substituir Imagem'}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-300'
          } ${uploading ? 'opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById(`file-input-${bucket}`)?.click()}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            {uploading ? 'Enviando...' : 'Clique ou arraste uma imagem aqui'}
          </p>
          <p className="text-xs text-gray-500">
            Máximo: {maxSizeMB}MB • Formatos: JPG, PNG, WebP
          </p>
        </div>
      )}
      
      <Input
        id={`file-input-${bucket}`}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        disabled={uploading}
        className="hidden"
      />
      
      {!currentImageUrl && (
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(`file-input-${bucket}`)?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Enviando...' : 'Selecionar Imagem'}
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
