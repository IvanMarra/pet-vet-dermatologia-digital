
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, GraduationCap, Calendar, Linkedin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VeterinarianSection = () => {
  const [veterinarianData, setVeterinarianData] = useState({
    name: 'Dra. Karine Silva',
    specialty: 'Especialista em Dermatologia Veterinária',
    description: '',
    linkedin: '',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80'
  });

  useEffect(() => {
    loadVeterinarianData();
  }, []);

  const loadVeterinarianData = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'veterinarian');
      
      if (data) {
        const settings: { [key: string]: any } = {};
        data.forEach(item => {
          try {
            settings[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          } catch {
            settings[item.key] = item.value;
          }
        });
        
        setVeterinarianData(prev => ({
          ...prev,
          name: settings.name || prev.name,
          specialty: settings.specialty || prev.specialty,
          description: settings.description || prev.description,
          linkedin: settings.linkedin || prev.linkedin,
          photo: settings.photo || prev.photo
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados da veterinária:', error);
    }
  };

  const qualifications = [
    "Graduação em Medicina Veterinária - FMVZ USP",
    "Pós-graduação em Dermatologia Veterinária - Anclivepa",
    "Especialização em Cirurgia de Pequenos Animais",
    "Curso de Aperfeiçoamento em Oncologia Veterinária",
    "Certificação Internacional em Dermatologia"
  ];

  const achievements = [
    "10+ anos de experiência clínica",
    "Primeira especialista em dermatologia da região",
    "Mais de 1000 cirurgias realizadas",
    "Palestrante em congressos veterinários",
    "Membro da Associação Brasileira de Dermatologia Veterinária"
  ];

  return (
    <section id="veterinarian" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Conheça a {veterinarianData.name}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {veterinarianData.specialty}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h3 className="text-3xl font-bold mb-6">{veterinarianData.name}</h3>
            <p className="text-lg mb-6 text-muted-foreground">
              {veterinarianData.description || `A ${veterinarianData.name} é uma veterinária apaixonada pelos animais desde criança. 
              Formada pela renomada Faculdade de Medicina Veterinária e Zootecnia da USP, 
              ela se especializou em dermatologia veterinária, tornando-se a primeira 
              especialista nesta área em nossa região.`}
            </p>
            <p className="text-lg mb-6 text-muted-foreground">
              Com mais de 10 anos de experiência, a {veterinarianData.name} combina conhecimento 
              científico avançado com muito carinho e dedicação no atendimento. Ela 
              acredita que cada animal merece o melhor cuidado possível e trabalha 
              incansavelmente para proporcionar isso.
            </p>
            <p className="text-lg mb-8 text-muted-foreground">
              Além da clínica, a {veterinarianData.name} é palestrante ativa em congressos 
              veterinários e está sempre se atualizando com as mais novas técnicas 
              e tratamentos da medicina veterinária.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>10+ anos de experiência</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="h-4 w-4" />
                <span>Especialista em Dermatologia</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>FMVZ USP</span>
              </div>
            </div>

            {veterinarianData.linkedin && (
              <Button size="lg" className="mr-4" asChild>
                <a href={veterinarianData.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn da {veterinarianData.name}
                </a>
              </Button>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src={veterinarianData.photo}
                alt={veterinarianData.name}
                className="rounded-lg shadow-lg w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Pets Atendidos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold">Formação Acadêmica</h4>
              </div>
              <ul className="space-y-3">
                {qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{qual}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold">Conquistas e Experiência</h4>
              </div>
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{achievement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-primary/5 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Mensagem da {veterinarianData.name}</h3>
          <blockquote className="text-lg text-muted-foreground max-w-4xl mx-auto italic">
            "Minha missão é proporcionar o melhor cuidado possível para cada animal que 
            atendo. Acredito que com carinho, conhecimento e dedicação, podemos fazer a 
            diferença na vida dos nossos pacientes de quatro patas e trazer tranquilidade 
            para suas famílias."
          </blockquote>
          <div className="mt-6">
            <p className="font-semibold">- {veterinarianData.name}</p>
            <p className="text-sm text-muted-foreground">{veterinarianData.specialty}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VeterinarianSection;
