import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import LazyImage from '@/components/LazyImage';
import type { Tables } from '@/integrations/supabase/types';

type PetPhoto = Tables<'pet_gallery'>;

const GroomingGallerySection = () => {
  const [photos, setPhotos] = useState<PetPhoto[]>([]);
  const [loading, setLoading] = useState(true);

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
    <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Galeria de <span className="text-primary">Banho & Tosa</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Confira alguns dos nossos trabalhos e veja como deixamos seu pet ainda mais bonito
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="overflow-hidden group rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <LazyImage
                src={photo.image_with_watermark || photo.image_url}
                alt={`${photo.pet_name} - Banho e Tosa`}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 bg-card">
                <p className="font-semibold text-sm">{photo.pet_name}</p>
                {photo.service_date && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(photo.service_date).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GroomingGallerySection;
