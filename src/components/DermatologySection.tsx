import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles, Zap } from 'lucide-react';

const treatments = [
  {
    icon: Shield,
    title: 'Tratamento Dermatológico',
    description: 'Avaliação completa da pele, protocolos exclusivos, dermocosméticos e tecnologias para cicatrização, fungos, bactérias e alergias.'
  },
  {
    icon: Sparkles,
    title: 'Banho Terapêutico',
    description: 'Banho medicamentoso com princípios ativos selecionados pela Dra. Karine para controle de coceira, alergias, dermatites, fungos e bactérias.'
  },
  {
    icon: Zap,
    title: 'Tratamento Terapêutico Profundo',
    description: 'Protocolos combinados com laser, LED, dermocosméticos, ácidos e fitoterápicos exclusivos.'
  }
];

const DermatologySection = () => {
  const whatsappNumber = '31995502094';

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tratamentos Dermatológicos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cuidados especializados para a saúde da pele do seu pet
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {treatments.map((treatment, index) => {
            const Icon = treatment.icon;
            return (
              <Card 
                key={index}
                className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl group"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {treatment.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {treatment.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="shadow-lg text-lg px-8 py-6"
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
          >
            Agendar Avaliação Dermatológica →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DermatologySection;
