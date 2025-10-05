
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Scissors, TestTube, Microscope, Pill, Heart } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Stethoscope,
      title: "Clínica Geral",
      description: "Consultas preventivas, vacinação, vermifugação e check-ups completos.",
      services: ["Consultas preventivas", "Vacinação", "Vermifugação", "Check-ups", "Orientações gerais"]
    },
    {
      icon: Microscope,
      title: "Dermatologia",
      description: "Especialização em problemas de pele, alergias e doenças dermatológicas.",
      services: ["Alergias cutâneas", "Dermatites", "Infecções fúngicas", "Parasitas de pele", "Biópsias"]
    },
    {
      icon: Scissors,
      title: "Cirurgias",
      description: "Procedimentos cirúrgicos com equipamentos modernos e máxima segurança.",
      services: ["Castração", "Cirurgias ortopédicas", "Remoção de tumores", "Cirurgias de emergência", "Odontologia"]
    },
    {
      icon: TestTube,
      title: "Exames Laboratoriais",
      description: "Diagnósticos precisos através de exames completos e modernos.",
      services: ["Hemograma", "Bioquímico", "Urinálise", "Parasitológico", "Citologia"]
    },
    {
      icon: Heart,
      title: "Cardiologia",
      description: "Cuidados especializados para o coração dos seus pets.",
      services: ["Ecocardiograma", "Eletrocardiograma", "Consultas cardiológicas", "Monitoramento", "Tratamentos"]
    },
    {
      icon: Pill,
      title: "Medicina Preventiva",
      description: "Prevenção é o melhor remédio para manter seu pet sempre saudável.",
      services: ["Programas de prevenção", "Orientação nutricional", "Controle de peso", "Geriatria", "Medicina felina"]
    }
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Nossos Procedimentos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos uma ampla gama de serviços veterinários com foco especial em dermatologia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  Saber Mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Destaque Especial: Dermatologia Veterinária</h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-4xl mx-auto">
            Somos a primeira clínica da região especializada em dermatologia veterinária. 
            Nossa equipe possui formação específica para tratar problemas de pele, oferecendo 
            diagnósticos precisos e tratamentos eficazes para alergias, dermatites e outras 
            condições dermatológicas.
          </p>
          <Button size="lg">
            Agendar Consulta Dermatológica
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
