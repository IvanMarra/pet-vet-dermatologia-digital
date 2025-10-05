
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Target, Award, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AboutSection = () => {
  const [aboutData, setAboutData] = useState({
    title: 'Sobre Nós',
    description: 'Há mais de 10 anos cuidando da saúde e bem-estar dos seus melhores amigos',
    mission: 'Proporcionar cuidados veterinários de excelência, combinando conhecimento científico, tecnologia avançada e muito amor pelos animais.',
    vision: 'Ser referência em cuidados veterinários especializados na região.',
    values: [
      'Amor pelos animais',
      'Excelência profissional', 
      'Atendimento humanizado',
      'Inovação em tratamentos'
    ]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      console.log('🔍 Carregando dados da seção About...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'about');
      
      if (error) {
        console.error('❌ Erro ao carregar dados about:', error);
        setLoading(false);
        return;
      }

      console.log('📋 Dados about encontrados:', data);
      
      if (data && data.length > 0) {
        const settingsObj: { [key: string]: any } = {};
        
        data.forEach(item => {
          let value = item.value;
          
          // Processar arrays JSON
          if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            try {
              value = JSON.parse(value);
            } catch {
              // Manter como string se não conseguir fazer parse
            }
          }
          
          settingsObj[item.key] = value;
        });

        console.log('✅ Dados about processados:', settingsObj);

        setAboutData(prev => ({
          ...prev,
          title: settingsObj.title || prev.title,
          description: settingsObj.description || prev.description,
          mission: settingsObj.mission || prev.mission,
          vision: settingsObj.vision || prev.vision,
          values: Array.isArray(settingsObj.values) ? settingsObj.values : prev.values
        }));
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao carregar about:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultValues = [
    { icon: Heart, title: "Compaixão", description: "Tratamos cada animal com amor e dedicação." },
    { icon: Target, title: "Excelência", description: "Buscamos constantemente a melhoria de nossos serviços." },
    { icon: Award, title: "Qualidade", description: "Utilizamos equipamentos modernos e técnicas avançadas." },
    { icon: Users, title: "Compromisso", description: "Nossa missão é proporcionar saúde e bem-estar." }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{aboutData.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {aboutData.description}
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
              {aboutData.mission}
            </p>
          </div>
        </div>

        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Nossos Valores</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutData.values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {React.createElement(defaultValues[index]?.icon || Heart, { className: "h-8 w-8 text-primary" })}
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{defaultValues[index]?.title || `Valor ${index + 1}`}</h4>
                  <p className="text-muted-foreground">{value}</p>
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
