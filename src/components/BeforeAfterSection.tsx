import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Transformation {
  id: number;
  before: string;
  after: string;
  description: string;
}

const transformations: Transformation[] = [
  {
    id: 1,
    before: '/public/images/dr-karine.jpeg',
    after: '/public/images/dr-karine.jpeg',
    description: 'Recuperação completa de dermatite - 30 dias de tratamento'
  }
];

const BeforeAfterSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const whatsappNumber = '31995502094';

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % transformations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length);
  };

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
                    src={transformations[currentIndex].before}
                    alt="Antes do tratamento"
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
                    src={transformations[currentIndex].after}
                    alt="Depois do tratamento"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <p className="text-center text-lg text-muted-foreground mb-6">
              {transformations[currentIndex].description}
            </p>

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
