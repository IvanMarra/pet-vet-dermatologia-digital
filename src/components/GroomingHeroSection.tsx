import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import banhoTosaImage from '@/assets/pet-bath-bubbles.jpg';

const GroomingHeroSection = () => {
  const whatsappNumbers = ['31995502094', '31994162094'];
  
  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumbers[0]}`, '_blank');
  };

  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Serviço Premium</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              BANHO & TOSA
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-primary">
              O cuidado que o seu pet merece
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Serviços completos e seguros para a higiene do seu melhor amigo. 
              Profissionais especializados e produtos de alta qualidade.
            </p>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
              onClick={handleWhatsAppClick}
            >
              Agendar agora →
            </Button>
          </div>

          {/* Right Content - Decorative */}
          <div className="relative hidden md:block">
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"></div>
              <img 
                src={banhoTosaImage} 
                alt="Pet grooming service" 
                className="w-full h-full object-cover"
              />
              {/* Decorative Shapes */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-blue-300 rounded-full opacity-30 blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
    </section>
  );
};

export default GroomingHeroSection;
