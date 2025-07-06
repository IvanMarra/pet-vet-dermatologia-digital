
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
      console.log('Configurações atualizadas, recarregando dados do veterinário...');
      loadVeterinarianData();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const loadVeterinarianData = async () => {
    try {
      console.log('Carregando dados do veterinário...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'veterinarian');
      
      if (error) {
        console.error('Erro ao carregar dados do veterinário:', error);
        return;
      }

      console.log('Dados do veterinário encontrados:', data);
      
      if (data && data.length > 0) {
        const settingsObj: { [key: string]: any } = {};
        
        // Processar dados do banco
        data.forEach(item => {
          let value = item.value;
          
          // Se o valor é uma string que parece ser JSON, tentar fazer parse
          if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            try {
              value = JSON.parse(value);
            } catch {
              // Se não conseguir fazer parse, manter como string
            }
          }
          
          settingsObj[item.key] = value;
        });

        console.log('Dados processados do veterinário:', settingsObj);

        // Atualizar os dados do veterinário
        setVeterinarianData(prev => ({
          ...prev,
          name: settingsObj.name || prev.name,
          title: settingsObj.specialty || settingsObj.title || prev.title,
          description: settingsObj.description || prev.description,
          image: settingsObj.photo || 
                 'https://goopwdwyvhpoqqerrqbg.supabase.co/storage/v1/object/public/veterinarian-photos/1751336736810-7g5hjycx6f2.jpeg',
          experience: settingsObj.experience || prev.experience,
          specialties: Array.isArray(settingsObj.specialties) ? settingsObj.specialties : 
                      (settingsObj.education && Array.isArray(settingsObj.education) ? settingsObj.education : prev.specialties),
          education: typeof settingsObj.education === 'string' ? settingsObj.education : 
                    (Array.isArray(settingsObj.education) ? settingsObj.education.join(', ') : prev.education)
        }));
        
        console.log('Dados do veterinário atualizados com sucesso');
      } else {
        console.log('Nenhum dado encontrado para veterinarian, usando dados padrão');
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
                    onError={(e) => {
                      console.log('Erro ao carregar imagem:', veterinarianData.image);
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                    onLoad={() => {
                      console.log('Imagem carregada com sucesso:', veterinarianData.image);
                    }}
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
