
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Stethoscope } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const VeterinarianSection = () => {
  const [veterinarianData, setVeterinarianData] = useState({
    name: 'Dra. Karine Silva',
    title: 'Médica Veterinária',
    description: 'Especialista em clínica geral e cirurgia de pequenos animais. Com mais de 10 anos de experiência, dedica-se ao cuidado integral dos pets com muito amor e profissionalismo.',
    image: '/placeholder.svg',
    experience: '10+ anos',
    specialties: ['Clínica Geral', 'Cirurgia', 'Emergências'],
    education: 'FMVZ-USP'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVeterinarianData();
    
    // Listen for settings updates
    const handleSettingsUpdate = () => {
      loadVeterinarianData();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const loadVeterinarianData = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'veterinarian');
      
      if (data) {
        const settingsObj: { [key: string]: any } = {};
        data.forEach(item => {
          try {
            settingsObj[item.key] = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          } catch {
            settingsObj[item.key] = item.value;
          }
        });

        setVeterinarianData({
          name: settingsObj.name || 'Dra. Karine Silva',
          title: settingsObj.title || 'Médica Veterinária',
          description: settingsObj.description || 'Especialista em clínica geral e cirurgia de pequenos animais. Com mais de 10 anos de experiência, dedica-se ao cuidado integral dos pets com muito amor e profissionalismo.',
          image: settingsObj.image || '/placeholder.svg',
          experience: settingsObj.experience || '10+ anos',
          specialties: settingsObj.specialties || ['Clínica Geral', 'Cirurgia', 'Emergências'],
          education: settingsObj.education || 'FMVZ-USP'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do veterinário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="veterinaria" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Nossa Veterinária</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conheça a profissional dedicada que cuida do seu pet com carinho e expertise.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-square md:aspect-auto">
                  <img
                    src={veterinarianData.image}
                    alt={veterinarianData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold mb-2">{veterinarianData.name}</h3>
                    <p className="text-primary text-lg font-semibold mb-4">{veterinarianData.title}</p>
                    <p className="text-muted-foreground leading-relaxed">
                      {veterinarianData.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-medium">Experiência: {veterinarianData.experience}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Stethoscope className="h-5 w-5 text-primary" />
                      <span className="font-medium">Formação: {veterinarianData.education}</span>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Heart className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <span className="font-medium block mb-1">Especialidades:</span>
                        <div className="flex flex-wrap gap-2">
                          {veterinarianData.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VeterinarianSection;
