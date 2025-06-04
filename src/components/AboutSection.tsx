
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Target, Award, Users } from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Compaixão",
      description: "Tratamos cada animal com amor e dedicação, como se fossem nossos próprios pets."
    },
    {
      icon: Target,
      title: "Excelência",
      description: "Buscamos constantemente a melhoria de nossos serviços e conhecimentos."
    },
    {
      icon: Award,
      title: "Qualidade",
      description: "Utilizamos equipamentos modernos e técnicas avançadas para os melhores resultados."
    },
    {
      icon: Users,
      title: "Compromisso",
      description: "Nossa missão é proporcionar saúde e bem-estar para todos os animais."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Sobre Nós</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Há mais de 10 anos cuidando da saúde e bem-estar dos seus melhores amigos
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6">Nossa História</h3>
            <p className="text-lg mb-6 text-muted-foreground">
              A VetCare nasceu da paixão pelo cuidado animal e da necessidade de oferecer 
              serviços veterinários especializados em nossa região. Somos pioneiros em 
              dermatologia veterinária, trazendo tratamentos inovadores e cuidados 
              especializados para pets com problemas de pele.
            </p>
            <p className="text-lg mb-6 text-muted-foreground">
              Nossa equipe é formada por profissionais altamente qualificados e 
              apaixonados pelo que fazem. Investimos constantemente em tecnologia e 
              capacitação para oferecer o melhor atendimento possível.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Pets Atendidos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&q=80"
              alt="Clínica Veterinária"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Nossa Missão</h3>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Proporcionar cuidados veterinários de excelência, combinando conhecimento 
              científico, tecnologia avançada e muito amor pelos animais, contribuindo 
              para a saúde e felicidade dos pets e tranquilidade de suas famílias.
            </p>
          </div>
        </div>

        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Nossos Valores</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
