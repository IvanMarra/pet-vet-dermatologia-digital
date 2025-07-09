
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
    experience: '',
    specialties: [] as string[],
    education: '',
    linkedin: '',
    sectionTitle: '',
    sectionSubtitle: ''
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
      console.log('🔍 Iniciando carregamento dos dados do veterinário...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'veterinarian');
      
      console.log('📋 Resposta da query:', { data, error });
      
      if (error) {
        console.error('❌ Erro ao carregar dados do veterinário:', error);
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Dados encontrados:', data.length, 'itens');
        
        const settingsObj: { [key: string]: any } = {};
        
        // Processar dados do banco
        data.forEach(item => {
          console.log('🔧 Processando item:', item.key, '=', item.value);
          
          let value = item.value;
          
          // Se o valor é uma string que parece ser JSON, tentar fazer parse
          if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
            try {
              value = JSON.parse(value);
              console.log('📝 JSON parsed para', item.key, ':', value);
            } catch {
              console.log('⚠️ Não foi possível fazer parse do JSON para', item.key);
            }
          }
          
          settingsObj[item.key] = value;
        });

        console.log('🎯 Objeto final dos dados:', settingsObj);

        // Processar URL da foto
        let photoUrl = settingsObj.photo;
        
        // Verificar se photo é uma string válida ou se precisa ser processada
        if (typeof photoUrl === 'string' && photoUrl.startsWith('"') && photoUrl.endsWith('"')) {
          photoUrl = photoUrl.slice(1, -1);
        }
        
        // Corrigir URLs antigas com domínio incorreto ou regenerar se necessário
        if (typeof photoUrl === 'string' && photoUrl && !photoUrl.includes('05ecb38f-4591-431f-9739-9a253581126e')) {
          // Se a URL tem um domínio antigo, extrair apenas o nome do arquivo
          const fileName = photoUrl.split('/').pop();
          
          if (fileName) {
            // Gerar nova URL com o domínio correto
            const { data: { publicUrl } } = supabase.storage
              .from('veterinarian-photos')
              .getPublicUrl(fileName);
            
            photoUrl = publicUrl;
            console.log('🔧 URL corrigida de:', settingsObj.photo, 'para:', photoUrl);
            
            // Atualizar a URL no banco de dados automaticamente
            try {
              await supabase
                .from('site_settings')
                .update({ value: JSON.stringify(photoUrl) })
                .eq('section', 'veterinarian')
                .eq('key', 'photo');
              console.log('💾 URL atualizada no banco de dados');
            } catch (error) {
              console.error('❌ Erro ao atualizar URL no banco:', error);
            }
          }
        }
        
        console.log('🖼️ URL da foto a ser usada:', photoUrl);

        // Atualizar os dados do veterinário com APENAS os dados do banco
        const newData = {
          name: settingsObj.name || 'Dra. Karine Silva',
          title: settingsObj.specialty || 'Médica Veterinária',
          description: settingsObj.description || 'Especialista em cuidados veterinários.',
          image: photoUrl,
          experience: settingsObj.experience || '', // Não mostrar se não foi cadastrado
          specialties: settingsObj.specialties || [], // Usar apenas se foi cadastrado
          education: settingsObj.education || '', // Usar apenas se foi cadastrado
          linkedin: settingsObj.linkedin || '', // Adicionar LinkedIn
          sectionTitle: settingsObj.section_title || '',
          sectionSubtitle: settingsObj.section_subtitle || ''
        };

        console.log('🚀 Dados finais que serão aplicados:', newData);
        
        setVeterinarianData(newData);
        
        console.log('✅ Dados do veterinário atualizados com sucesso!');
      } else {
        console.log('❌ Nenhum dado encontrado para veterinarian, usando dados padrão');
      }
    } catch (error) {
      console.error('💥 Erro inesperado ao carregar dados do veterinário:', error);
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
          <h2 className="text-4xl font-bold mb-4">
            {veterinarianData.sectionTitle || 'Nossa Veterinária'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {veterinarianData.sectionSubtitle || 'Conheça a profissional dedicada que cuida do seu pet com carinho e expertise.'}
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
                    {veterinarianData.experience && (
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="font-medium">Experiência: {veterinarianData.experience}</span>
                      </div>
                    )}
                    
                    {veterinarianData.education && (
                      <div className="flex items-center space-x-3">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          Formação: {Array.isArray(veterinarianData.education) 
                            ? veterinarianData.education.join(', ') 
                            : veterinarianData.education}
                        </span>
                      </div>
                    )}
                    
                    {veterinarianData.specialties && veterinarianData.specialties.length > 0 && (
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
                    )}

                    {veterinarianData.linkedin && (
                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-primary" />
                        <a 
                          href={veterinarianData.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
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
