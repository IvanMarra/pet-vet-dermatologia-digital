import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VeterinarianData {
  name: string;
  title: string;
  description: string;
  image: string;
  experience: string;
  specialties: string[];
  education: string;
  linkedin: string;
  sectionTitle: string;
  sectionSubtitle: string;
}

export const useVeterinarianData = () => {
  const [veterinarianData, setVeterinarianData] = useState<VeterinarianData>({
    name: 'Dra. Karine Silva',
    title: 'Médica Veterinária',
    description: 'Especialista em clínica geral e cirurgia de pequenos animais. Com mais de 10 anos de experiência, dedica-se ao cuidado integral dos pets com muito amor e profissionalismo.',
    image: '',
    experience: '',
    specialties: [],
    education: '',
    linkedin: '',
    sectionTitle: '',
    sectionSubtitle: ''
  });
  const [loading, setLoading] = useState(true);

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

  return { veterinarianData, loading };
};