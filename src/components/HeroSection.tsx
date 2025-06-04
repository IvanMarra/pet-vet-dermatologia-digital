
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Heart, Shield, Clock } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Cuidando dos seus melhores amigos",
      subtitle: "A primeira clínica veterinária especializada em dermatologia da região",
      description: "Oferecemos cuidados veterinários de excelência com equipamentos modernos e profissionais especializados.",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&q=80",
      cta: "Agendar Consulta"
    },
    {
      title: "Especialistas em Dermatologia",
      subtitle: "Tratamentos avançados para a pele dos seus pets",
      description: "Nossa equipe especializada oferece diagnósticos precisos e tratamentos eficazes para problemas dermatológicos.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
      cta: "Conhecer Tratamentos"
    },
    {
      title: "Cirurgias Seguras e Modernas",
      subtitle: "Centro cirúrgico com tecnologia avançada",
      description: "Realizamos procedimentos cirúrgicos com máxima segurança e cuidado para o bem-estar dos animais.",
      image: "https://images.unsplash.com/photo-1559666126-84f389727b9a?w=800&q=80",
      cta: "Saber Mais"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="home" className="relative h-screen overflow-hidden">
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
              className="h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-white">
                    <p className="text-lg mb-2 text-primary-foreground/90">{slide.subtitle}</p>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8 text-primary-foreground/90 animate-slide-up">
                      {slide.description}
                    </p>
                    <Button size="lg" className="animate-slide-up">
                      {slide.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Features Cards */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Cuidado Especializado</h3>
                <p className="text-sm text-muted-foreground">Dermatologia veterinária</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Equipamentos Modernos</h3>
                <p className="text-sm text-muted-foreground">Tecnologia avançada</p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Atendimento 24h</h3>
                <p className="text-sm text-muted-foreground">Emergências</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
