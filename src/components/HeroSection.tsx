import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Heart, Award, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SlideData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
}

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSlides();
    
    // Listen for settings updates
    const handleSettingsUpdate = () => {
      loadSlides();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const loadSlides = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'hero');
      
      if (data) {
        const settingsObj: { [key: string]: any } = {};
        data.forEach(item => {
          try {
            settingsObj[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          } catch {
            settingsObj[item.key] = item.value;
          }
        });

        // Create slides from settings or use defaults
        const slidesData: SlideData[] = [];
        
        // Check for slide data in settings
        let slideIndex = 1;
        while (settingsObj[`slide_${slideIndex}_title`]) {
          slidesData.push({
            title: settingsObj[`slide_${slideIndex}_title`] || '',
            subtitle: settingsObj[`slide_${slideIndex}_subtitle`] || '',
            description: settingsObj[`slide_${slideIndex}_description`] || '',
            image: settingsObj[`slide_${slideIndex}_image`] || '/placeholder.svg',
            cta: settingsObj[`slide_${slideIndex}_cta`] || 'Agendar Consulta'
          });
          slideIndex++;
        }

        // If no slides found in settings, use default data
        if (slidesData.length === 0) {
          slidesData.push(
            {
              title: settingsObj.title || "Cuidando com amor do seu melhor amigo",
              subtitle: settingsObj.subtitle || "Clínica veterinária especializada em cuidados completos para seu pet",
              description: "Atendimento humanizado, equipamentos modernos e profissionais qualificados para garantir a saúde e bem-estar do seu companheiro.",
              image: "/placeholder.svg",
              cta: "Agendar Consulta"
            },
            {
              title: "Emergências 24h",
              subtitle: "Pronto atendimento quando seu pet mais precisa",
              description: "Equipe especializada disponível 24 horas para emergências veterinárias com equipamentos de última geração.",
              image: "/placeholder.svg",
              cta: "Emergência"
            },
            {
              title: "Exames Completos",
              subtitle: "Diagnóstico preciso para seu pet",
              description: "Laboratório próprio e equipamentos modernos para exames rápidos e resultados confiáveis.",
              image: "/placeholder.svg",
              cta: "Ver Exames"
            }
          );
        }

        setSlides(slidesData);
      }
    } catch (error) {
      console.error('Erro ao carregar slides:', error);
      // Use default slides on error
      setSlides([
        {
          title: "Cuidando com amor do seu melhor amigo",
          subtitle: "Clínica veterinária especializada em cuidados completos para seu pet",
          description: "Atendimento humanizado, equipamentos modernos e profissionais qualificados para garantir a saúde e bem-estar do seu companheiro.",
          image: "/placeholder.svg",
          cta: "Agendar Consulta"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section id="inicio" className="relative h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="h-full bg-cover bg-center bg-gray-100"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`
              }}
            >
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-6 text-gray-200">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg mb-8 text-gray-300 leading-relaxed">
                    {slide.description}
                  </p>
                  <Button size="lg" className="text-lg px-8 py-6">
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows - only show if more than 1 slide */}
      {slides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Slide indicators - only show if more than 1 slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}

      {/* Features cards */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Cuidado Especializado</h3>
              <p className="text-sm text-gray-600">Atendimento personalizado para cada pet</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Profissionais Qualificados</h3>
              <p className="text-sm text-gray-600">Equipe experiente e dedicada</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-gray-800">Emergência 24h</h3>
              <p className="text-sm text-gray-600">Pronto atendimento quando precisar</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
