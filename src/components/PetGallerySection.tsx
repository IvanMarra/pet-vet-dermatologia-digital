import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Loader2, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type PetGallery = Tables<'pet_gallery'>;
type PetGalleryImage = Tables<'pet_gallery_images'>;

interface PetGalleryWithImages extends PetGallery {
  images: PetGalleryImage[];
}

const PetGallerySection = () => {
  const [pets, setPets] = useState<PetGalleryWithImages[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const { data: petsData, error: petsError } = await supabase
        .from('pet_gallery')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (petsError) throw petsError;

      const petsWithImages = await Promise.all(
        (petsData || []).map(async (pet) => {
          const { data: imagesData, error: imagesError } = await supabase
            .from('pet_gallery_images')
            .select('*')
            .eq('pet_gallery_id', pet.id)
            .order('display_order', { ascending: true});

          if (imagesError) throw imagesError;

          return {
            ...pet,
            images: imagesData || [],
          };
        })
      );

      setPets(petsWithImages.filter(pet => pet.images.length > 0));
    } catch (error: any) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'banho-simples': 'Banho Simples',
      'banho-tosa': 'Banho e Tosa',
      'banho-hidratacao': 'Banho e Hidratação',
      'banho-terapeutico': 'Banho Terapêuticos',
      'banho-dermatologico': 'Banho Dermatológico',
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (pets.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mural dos Pets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja os pets felizes que já passaram pelos nossos cuidados
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {pets.map((pet) => (
              <CarouselItem key={pet.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/20 h-full">
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {pet.images.map((image, index) => (
                          <CarouselItem key={image.id}>
                            <div className="relative aspect-square overflow-hidden">
                              <img
                                src={image.image_url}
                                alt={`${pet.pet_name} - ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {pet.images.length > 1 && (
                        <>
                          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </Carousel>
                    
                    {pet.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {pet.images.length} fotos
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                        <Heart className="h-5 w-5 text-primary fill-primary" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-3 space-y-2">
                    <div>
                      <h3 className="font-bold text-lg text-foreground mb-1">{pet.pet_name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                          {getCategoryLabel(pet.category)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t">
                      {pet.owner_name && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Tutor: {pet.owner_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(pet.service_date || '').toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="relative left-0 translate-y-0" />
            <CarouselNext className="relative right-0 translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default PetGallerySection;
