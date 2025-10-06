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
    name: 'Karine M. F. Marra',
    title: 'Clínica Geral, Pós graduada em Dermatológia, Pós graduada em Fitoterápicos e Homeopáticos',
    description: 'CRM-MG 26.710. MBA em Gestão de clínicas. CEO da POPULARVET e da petvetfarma.com',
    image: '/images/dr-karine.jpeg', // Caminho da nova imagem
    experience: '',
    specialties: ['Clínica Geral', 'Dermatologia', 'Fitoterápicos', 'Homeopáticos'],
    education: 'MBA em Gestão de clínicas.',
    linkedin: '',
    sectionTitle: 'Nossa Veterinária',
    sectionSubtitle: 'Conheça a profissional dedicada que cuida do seu pet com carinho e expertise.'
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

        // Processar URL da foto - garantir que seja uma string limpa
        let photoUrl = settingsObj.photo || '';
        
        console.log('🔍 Valor bruto da foto:', photoUrl, 'Tipo:', typeof photoUrl);
        
        // Limpar completamente qualquer formatação de JSON
        if (typeof photoUrl === 'string') {
          // Remove aspas duplas do início e fim
          photoUrl = photoUrl.replace(/^"/, '').replace(/"$/, '');
          // Remove escape characters se houver
          photoUrl = photoUrl.replace(/\\"/g, '"');
          // Trim para remover espaços
          photoUrl = photoUrl.trim();
        }
        
        // Garantir que a URL é válida e não está vazia
        if (!photoUrl || photoUrl === '""' || photoUrl === 'null' || photoUrl === 'undefined' || photoUrl === '' || photoUrl === '{}') {
          photoUrl = '/images/dr-karine.jpeg'; // Usar a imagem padrão se não houver uma válida
          console.log('🚫 URL da foto está vazia ou inválida, usando placeholder');
        } else if (!photoUrl.startsWith('http') && !photoUrl.startsWith('/images/')) { // Permitir caminhos locais
          photoUrl = '/images/dr-karine.jpeg'; // Usar a imagem padrão se não for uma URL ou caminho local válido
          console.log('🚫 URL da foto não é válida (não começa com http ou /images/), usando placeholder');
        } else {
          console.log('✅ URL da foto válida encontrada:', photoUrl);
        }

        // Atualizar os dados do veterinário com APENAS os dados do banco
        const newData = {
          name: settingsObj.name || 'Karine M. F. Marra',
          title: settingsObj.specialty || 'Clínica Geral, Pós graduada em Dermatológia, Pós graduada em Fitoterápicos e Homeopáticos',
          description: settingsObj.description || 'CRM-MG 26.710. MBA em Gestão de clínicas. CEO da POPULARVET e da petvetfarma.com',
          image: photoUrl,
          experience: settingsObj.experience || '', // Não mostrar se não foi cadastrado
          specialties: Array.isArray(settingsObj.specialties) ? settingsObj.specialties : (typeof settingsObj.specialty === 'string' ? settingsObj.specialty.split(',').map((s: string) => s.trim()) : ['Clínica Geral', 'Dermatologia', 'Fitoterápicos', 'Homeopáticos']), // Usar apenas se foi cadastrado
          education: settingsObj.education || 'MBA em Gestão de clínicas.', // Usar apenas se foi cadastrado
          linkedin: settingsObj.linkedin || '', // Adicionar LinkedIn
          sectionTitle: settingsObj.section_title || 'Nossa Veterinária',
          sectionSubtitle: settingsObj.section_subtitle || 'Conheça a profissional dedicada que cuida do seu pet com carinho e expertise.'
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
      console.log('🔄 Configurações atualizadas, recarregando dados do veterinário...');
      loadVeterinarianData();
    };
    
    // Listen for manual refresh
    const handleManualRefresh = () => {
      console.log('🔄 Refresh manual solicitado, recarregando dados...');
      loadVeterinarianData();
    };
    
    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('forceRefresh', handleManualRefresh);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('forceRefresh', handleManualRefresh);
    };
  }, []);

  return { veterinarianData, loading };
};