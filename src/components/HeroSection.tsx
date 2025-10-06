import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Clock } from 'lucide-react';
// A importação do supabase não é mais necessária para esta seção

const HeroSection = () => {
  const youtubeVideoId = 'N7TX7mp871M';
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?controls=0&autoplay=1&mute=1&loop=1&playlist=${youtubeVideoId}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`;

  return (
    <section id="inicio" className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Vídeo do YouTube como Background */}
      <iframe
        className="absolute inset-0 w-full h-full z-0"
        src={embedUrl}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="PopularVet Background Video"
      ></iframe>

      {/* Overlay para escurecer o vídeo e melhorar a legibilidade do texto */}
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* Conteúdo principal da seção Hero */}
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-center relative z-20">
        <div className="max-w-2xl text-white mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Cuidando com amor do seu melhor amigo
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-gray-200">
            Clínica veterinária especializada em cuidados completos para seu pet
          </p>
          <p className="text-lg mb-8 text-gray-300 leading-relaxed">
            Atendimento humanizado, equipamentos modernos e profissionais qualificados para garantir a saúde e bem-estar do seu companheiro.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Agendar Consulta
          </Button>
        </div>

        {/* Cartões de recursos */}
        <div className="w-full max-w-4xl px-4 absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-4 text-center">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">Cuidado Especializado</h3>
                <p className="text-sm text-gray-600">Atendimento personalizado para cada pet</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-4 text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">Profissionais Qualificados</h3>
                <p className="text-sm text-gray-600">Equipe experiente e dedicada</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-800">Emergência 24h</h3>
                <p className="text-sm text-gray-600">Pronto atendimento quando precisar</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;