import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Transformation {
  id: string;
  pet_name: string;
  before_image_url: string;
  after_image_url: string;
  description: string;
  treatment_duration: string | null;
}

const BeforeAfterSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const whatsappNumber = '31995502094';

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_transformations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTransformations(data || []);
    } catch (error) {
      console.error('Error fetching transformations:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % transformations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (transformations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Transformações Reais
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Resultados visíveis que devolvem conforto, saúde e autoestima ao seu pet
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Before */}
              <div className="space-y-4">
                <div className="bg-destructive/10 text-destructive font-bold text-center py-2 rounded-lg">
                  ANTES
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={transformations[currentIndex].before_image_url}
                    alt={`Antes - ${transformations[currentIndex].pet_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* After */}
              <div className="space-y-4">
                <div className="bg-primary/10 text-primary font-bold text-center py-2 rounded-lg">
                  DEPOIS
                </div>
                <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={transformations[currentIndex].after_image_url}
                    alt={`Depois - ${transformations[currentIndex].pet_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{transformations[currentIndex].pet_name}</h3>
              <p className="text-lg text-muted-foreground">
                {transformations[currentIndex].description}
              </p>
              {transformations[currentIndex].treatment_duration && (
                <p className="text-sm text-muted-foreground mt-2">
                  {transformations[currentIndex].treatment_duration}
                </p>
              )}
            </div>

            {/* Navigation */}
            {transformations.length > 1 && (
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={prevSlide}
                  className="rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={nextSlide}
                  className="rounded-full"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </Card>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              className="shadow-lg text-lg px-8 py-6"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
            >
              Agendar Avaliação Dermatológica →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
