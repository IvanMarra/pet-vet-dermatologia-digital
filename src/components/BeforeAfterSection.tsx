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

const MAX_DESCRIPTION_LENGTH = 850;

const BeforeAfterSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
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

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getDisplayDescription = (transformation: Transformation) => {
    const isExpanded = expandedDescriptions[transformation.id];
    const needsTruncation = transformation.description.length > MAX_DESCRIPTION_LENGTH;
    
    if (!needsTruncation || isExpanded) {
      return transformation.description;
    }
    
    return transformation.description.slice(0, MAX_DESCRIPTION_LENGTH) + '...';
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

        <div className="max-w-5xl mx-auto relative">
          <Card className="p-8 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
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

            <div className="space-y-6 mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground">
                {transformations[currentIndex].pet_name}
              </h3>
              <div className="text-base md:text-lg text-muted-foreground leading-relaxed text-justify px-2" style={{ textAlignLast: 'left', whiteSpace: 'pre-line' }}>
                {getDisplayDescription(transformations[currentIndex])}
              </div>
              {transformations[currentIndex].description.length > MAX_DESCRIPTION_LENGTH && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleDescription(transformations[currentIndex].id)}
                    className="text-primary hover:text-primary/80"
                  >
                    {expandedDescriptions[transformations[currentIndex].id] ? 'Ver Menos' : 'Continue Lendo'}
                  </Button>
                </div>
              )}
              {transformations[currentIndex].treatment_duration && (
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <p className="text-base font-medium text-foreground">
                    Duração do tratamento: <span className="text-primary font-semibold">{transformations[currentIndex].treatment_duration}</span>
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Setas de Navegação Externas */}
          {transformations.length > 1 && (
            <>
              <Button 
                variant="outline" 
                size="icon"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-16 rounded-full h-14 w-14 shadow-xl bg-background border-2 hover:scale-110 hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-10"
              >
                <ChevronLeft className="h-7 w-7" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-16 rounded-full h-14 w-14 shadow-xl bg-background border-2 hover:scale-110 hover:bg-primary hover:text-primary-foreground transition-all duration-300 z-10"
              >
                <ChevronRight className="h-7 w-7" />
              </Button>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <Button 
            size="lg"
            variant="destructive"
            className="shadow-lg text-lg px-8 py-6"
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
          >
            Agendar Consulta →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterSection;
