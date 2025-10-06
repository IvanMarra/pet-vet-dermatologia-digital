import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import ImageUpload from '../ImageUpload';

interface Settings {
  [key: string]: any;
}

const SiteSettingsTab = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(false);
  const [slideCount, setSlideCount] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('🔧 Carregando configurações do painel administrativo...');
      
      const { data } = await supabase
        .from('site_settings')
        .select('*');
      
      console.log('📋 Dados brutos recebidos:', data);
      
      if (data) {
        const settingsObj: Settings = {};
        data.forEach(item => {
          if (!settingsObj[item.section]) {
            settingsObj[item.section] = {};
          }
          let parsedValue;
          try {
            // Para strings JSON, fazer parse
            if (typeof item.value === 'string' && (item.value.startsWith('[') || item.value.startsWith('{'))) {
              parsedValue = JSON.parse(item.value);
            } else if (typeof item.value === 'string' && item.value.startsWith('"') && item.value.endsWith('"')) {
              // Para strings com aspas duplas, remover as aspas
              parsedValue = item.value.slice(1, -1);
            } else {
              parsedValue = item.value;
            }
          } catch {
            parsedValue = item.value;
          }
          settingsObj[item.section][item.key] = parsedValue;
          
          console.log(`🏷️ ${item.section}.${item.key} = ${parsedValue}`);
        });
        
        console.log('✅ Configurações processadas:', settingsObj);
        setSettings(settingsObj);
        
        // Count existing slides
        let count = 0;
        while (settingsObj.hero?.[`slide_${count + 1}_title`]) {
          count++;
        }
        setSlideCount(Math.max(1, count));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      console.log('💾 Iniciando salvamento das configurações...');
      
      for (const section in settings) {
        for (const key in settings[section]) {
          console.log(`💾 Salvando ${section}.${key}:`, settings[section][key]);
          
          // Preparar o valor para salvamento
          let valueToSave = settings[section][key];
          
          // Se for string simples, adicionar aspas duplas
          if (typeof valueToSave === 'string' && 
              !valueToSave.startsWith('"') && 
              !valueToSave.startsWith('[') && 
              !valueToSave.startsWith('{')) {
            valueToSave = `"${valueToSave}"`;
          } else if (typeof valueToSave === 'object') {
            valueToSave = JSON.stringify(valueToSave);
          }
          
          console.log(`💾 Valor final para ${section}.${key}:`, valueToSave);
          
          // Verificar se o registro já existe
          const { data: existing } = await supabase
            .from('site_settings')
            .select('id')
            .eq('section', section)
            .eq('key', key)
            .single();
          
          if (existing) {
            // Atualizar registro existente
            const { error } = await supabase
              .from('site_settings')
              .update({ 
                value: valueToSave,
                updated_at: new Date().toISOString()
              })
              .eq('section', section)
              .eq('key', key);
              
            if (error) {
              console.error(`❌ Erro ao atualizar ${section}.${key}:`, error);
              throw error;
            }
            console.log(`✅ Atualizado ${section}.${key}`);
          } else {
            // Inserir novo registro
            const { error } = await supabase
              .from('site_settings')
              .insert({
                section,
                key,
                value: valueToSave
              });
              
            if (error) {
              console.error(`❌ Erro ao inserir ${section}.${key}:`, error);
              throw error;
            }
            console.log(`✅ Inserido ${section}.${key}`);
          }
        }
      }
      
      console.log('✅ Todas as configurações foram salvas!');
      
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
      
      // Trigger a reload of settings in other components
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
      window.dispatchEvent(new CustomEvent('forceRefresh'));
      
      // Force reload of this component's data
      setTimeout(() => {
        loadSettings();
      }, 500);
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const getSetting = (section: string, key: string, defaultValue: string = '') => {
    let value = settings[section]?.[key] || defaultValue;
    
    console.log(`🔍 getSetting(${section}, ${key}):`, value, 'Tipo:', typeof value);
    
    // Se é a URL da foto, processar corretamente
    if (key === 'photo' && typeof value === 'string') {
      // Remove aspas duplas se existirem
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // Se está vazio ou é inválido, retornar string vazia
      if (!value || value === '""' || value === 'null' || !value.startsWith('http')) {
        value = '';
      }
      console.log(`📸 Foto processada:`, value);
    }
    
    return value;
  };

  const addSlide = () => {
    setSlideCount(prev => prev + 1);
  };

  const removeSlide = (slideIndex: number) => {
    if (slideCount > 1) {
      // Remove slide settings
      const updatedSettings = { ...settings };
      if (updatedSettings.hero) {
        delete updatedSettings.hero[`slide_${slideIndex}_title`];
        delete updatedSettings.hero[`slide_${slideIndex}_subtitle`];
        delete updatedSettings.hero[`slide_${slideIndex}_description`];
        delete updatedSettings.hero[`slide_${slideIndex}_image`];
        delete updatedSettings.hero[`slide_${slideIndex}_cta`];
      }
      setSettings(updatedSettings);
      setSlideCount(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Principal (Slides)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: slideCount }, (_, index) => {
            const slideNum = index + 1;
            return (
              <div key={slideNum} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Slide {slideNum}</h4>
                  {slideCount > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSlide(slideNum)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={getSetting('hero', `slide_${slideNum}_title`)}
                      onChange={(e) => updateSetting('hero', `slide_${slideNum}_title`, e.target.value)}
                      placeholder="Título do slide"
                    />
                  </div>
                  <div>
                    <Label>Botão CTA</Label>
                    <Input
                      value={getSetting('hero', `slide_${slideNum}_cta`)}
                      onChange={(e) => updateSetting('hero', `slide_${slideNum}_cta`, e.target.value)}
                      placeholder="Texto do botão"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Subtítulo</Label>
                  <Input
                    value={getSetting('hero', `slide_${slideNum}_subtitle`)}
                    onChange={(e) => updateSetting('hero', `slide_${slideNum}_subtitle`, e.target.value)}
                    placeholder="Subtítulo do slide"
                  />
                </div>
                
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={getSetting('hero', `slide_${slideNum}_description`)}
                    onChange={(e) => updateSetting('hero', `slide_${slideNum}_description`, e.target.value)}
                    placeholder="Descrição detalhada"
                    rows={3}
                  />
                </div>
                
                <ImageUpload
                  bucket="site-images"
                  currentImageUrl={getSetting('hero', `slide_${slideNum}_image`)}
                  onImageUploaded={(url) => updateSetting('hero', `slide_${slideNum}_image`, url)}
                  onImageRemoved={() => updateSetting('hero', `slide_${slideNum}_image`, '')}
                  label={`Imagem do Slide ${slideNum}`}
                  recommendedSize="1920x1080 pixels (formato paisagem)"
                  maxSizeMB={5}
                />
              </div>
            );
          })}
          
          <Button onClick={addSlide} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Slide
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seção Hero (Dados Gerais)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título Principal</Label>
            <Input
              value={getSetting('hero', 'title')}
              onChange={(e) => updateSetting('hero', 'title', e.target.value)}
            />
          </div>
          <div>
            <Label>Subtítulo</Label>
            <Textarea
              value={getSetting('hero', 'subtitle')}
              onChange={(e) => updateSetting('hero', 'subtitle', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre Nós</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input
              value={getSetting('about', 'title')}
              onChange={(e) => updateSetting('about', 'title', e.target.value)}
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={getSetting('about', 'description')}
              onChange={(e) => updateSetting('about', 'description', e.target.value)}
            />
          </div>
          <div>
            <Label>Missão</Label>
            <Textarea
              value={getSetting('about', 'mission')}
              onChange={(e) => updateSetting('about', 'mission', e.target.value)}
            />
          </div>
          <div>
            <Label>Visão</Label>
            <Textarea
              value={getSetting('about', 'vision')}
              onChange={(e) => updateSetting('about', 'vision', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dra. Karine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título da Seção</Label>
            <div className="relative">
              <Input
                value={getSetting('veterinarian', 'section_title')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 50) {
                    updateSetting('veterinarian', 'section_title', value);
                  } else {
                    toast({
                      title: "Limite atingido",
                      description: "Título da seção deve ter no máximo 50 caracteres",
                      variant: "destructive",
                    });
                  }
                }}
                placeholder="Ex: Nossa Veterinária"
                maxLength={50}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {getSetting('veterinarian', 'section_title').length}/50
              </div>
            </div>
          </div>
          
          <div>
            <Label>Subtítulo da Seção</Label>
            <div className="relative">
              <Textarea
                value={getSetting('veterinarian', 'section_subtitle')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    updateSetting('veterinarian', 'section_subtitle', value);
                  } else {
                    toast({
                      title: "Limite atingido",
                      description: "Subtítulo deve ter no máximo 200 caracteres",
                      variant: "destructive",
                    });
                  }
                }}
                placeholder="Descrição breve sobre a seção"
                rows={2}
                maxLength={200}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {getSetting('veterinarian', 'section_subtitle').length}/200
              </div>
            </div>
          </div>

          <div>
            <Label>Nome</Label>
            <div className="relative">
              <Input
                value={getSetting('veterinarian', 'name')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    updateSetting('veterinarian', 'name', value);
                  } else {
                    toast({
                      title: "Limite atingido",
                      description: "Nome deve ter no máximo 100 caracteres",
                      variant: "destructive",
                    });
                  }
                }}
                maxLength={100}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {getSetting('veterinarian', 'name').length}/100
              </div>
            </div>
          </div>
          
          <div>
            <Label>Especialidade</Label>
            <div className="relative">
              <Input
                value={getSetting('veterinarian', 'specialty')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 150) {
                    updateSetting('veterinarian', 'specialty', value);
                  } else {
                    toast({
                      title: "Limite atingido",
                      description: "Especialidade deve ter no máximo 150 caracteres",
                      variant: "destructive",
                    });
                  }
                }}
                placeholder="Formação acadêmica e profissional"
                maxLength={150}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {getSetting('veterinarian', 'specialty').length}/150
              </div>
            </div>
          </div>
          
          <div>
            <Label>Formação</Label>
            <div className="relative">
              <Textarea
                value={getSetting('veterinarian', 'education')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    updateSetting('veterinarian', 'education', value);
                  } else {
                    toast({
                      title: "Limite atingido",
                      description: "Formação deve ter no máximo 500 caracteres",
                      variant: "destructive",
                    });
                  }
                }}
                placeholder="Formação acadêmica e profissional"
                rows={3}
                maxLength={500}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {getSetting('veterinarian', 'education').length}/500
              </div>
            </div>
          </div>
          
          <div>
            <Label>Descrição</Label>
            <div className="relative">
              <Textarea
                value={getSetting('veterinarian', 'description')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 800) {
                    updateSetting('veterinarian', 'description', value);
                  } else {
                    toast({
                      title: "Limite atingido",
                      description: "Descrição deve ter no máximo 800 caracteres",
                      variant: "destructive",
                    });
                  }
                }}
                rows={4}
                maxLength={800}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {getSetting('veterinarian', 'description').length}/800
              </div>
            </div>
          </div>
          
          <div>
            <Label>LinkedIn</Label>
            <div className="relative">
              <Input
                value={getSetting('veterinarian', 'linkedin')}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    updateSetting('veterinarian', 'linkedin', value);
                  } else {
                    toast({
                      title: "Limite atingido",
                      description: "LinkedIn deve ter no máximo 200 caracteres",
                      variant: "destructive",
                    });
                  }
                }}
                placeholder="https://linkedin.com/in/..."
                maxLength={200}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {getSetting('veterinarian', 'linkedin').length}/200
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <ImageUpload
              bucket="veterinarian-photos"
              currentImageUrl={getSetting('veterinarian', 'photo')}
              onImageUploaded={(url) => {
                console.log('📸 Foto da Dra. Karine enviada:', url);
                updateSetting('veterinarian', 'photo', url);
              }}
              onImageRemoved={() => {
                console.log('🗑️ Foto da Dra. Karine removida');
                updateSetting('veterinarian', 'photo', '');
              }}
              label="Foto da Dra. Karine"
              recommendedSize="400x500 pixels (formato retrato)"
              maxSizeMB={2}
            />
            {getSetting('veterinarian', 'photo') && (
              <div className="text-xs text-muted-foreground">
                Foto atual: {getSetting('veterinarian', 'photo').substring(0, 50)}...
              </div>
            )}
            {!getSetting('veterinarian', 'photo') && (
              <div className="text-xs text-orange-600">
                Nenhuma foto cadastrada ainda
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rodapé - Informações da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seção Logo */}
          <div className="border-b pb-4 mb-4">
            <h4 className="font-semibold mb-3">Configurações da Logo</h4>
            <div className="space-y-4">
              <div>
                <Label>Nome/Texto da Logo</Label>
                <Input
                  value={getSetting('general', 'logo_text', 'PopularVET')}
                  onChange={(e) => updateSetting('general', 'logo_text', e.target.value)}
                  placeholder="PopularVET"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Texto que aparecerá como logo principal
                </p>
              </div>
              <div>
                <Label>Subtítulo da Logo</Label>
                <Input
                  value={getSetting('general', 'logo_subtitle', 'Aqui tem cuidados para todos os pets')}
                  onChange={(e) => updateSetting('general', 'logo_subtitle', e.target.value)}
                  placeholder="Aqui tem cuidados para todos os pets"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Texto que aparecerá abaixo da logo
                </p>
              </div>
              <div>
                <Label>URL da Imagem da Logo (opcional)</Label>
                <Input
                  value={getSetting('general', 'logo_image_url', '/images/logo-popularvet-resize-min.png')}
                  onChange={(e) => updateSetting('general', 'logo_image_url', e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Se preenchida, será usada no lugar do ícone padrão
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <Label>Nome da Empresa</Label>
            <Input
              value={getSetting('footer', 'company_name')}
              onChange={(e) => updateSetting('footer', 'company_name', e.target.value)}
              placeholder="PopularVET"
            />
          </div>
          <div>
            <Label>Subtítulo da Empresa</Label>
            <Input
              value={getSetting('footer', 'company_subtitle')}
              onChange={(e) => updateSetting('footer', 'company_subtitle', e.target.value)}
              placeholder="Clínica Veterinária"
            />
          </div>
          <div>
            <Label>Descrição da Empresa</Label>
            <Textarea
              value={getSetting('footer', 'company_description')}
              onChange={(e) => updateSetting('footer', 'company_description', e.target.value)}
              placeholder="A primeira clínica veterinária especializada em dermatologia da região."
              rows={3}
            />
          </div>
          <div>
            <Label>Copyright</Label>
            <Input
              value={getSetting('footer', 'copyright')}
              onChange={(e) => updateSetting('footer', 'copyright', e.target.value)}
              placeholder="© 2024 PopularVET Clínica Veterinária. Todos os direitos reservados."
            />
          </div>
          <div>
            <Label>CRMV</Label>
            <Input
              value={getSetting('footer', 'crmv')}
              onChange={(e) => updateSetting('footer', 'crmv', e.target.value)}
              placeholder="CRMV-SP: 12345"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rodapé - Redes Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Instagram</Label>
            <Input
              value={getSetting('footer', 'instagram_url')}
              onChange={(e) => updateSetting('footer', 'instagram_url', e.target.value)}
              placeholder="https://instagram.com/popularvet"
            />
          </div>
          <div>
            <Label>Facebook</Label>
            <Input
              value={getSetting('footer', 'facebook_url')}
              onChange={(e) => updateSetting('footer', 'facebook_url', e.target.value)}
              placeholder="https://facebook.com/popularvet"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Endereço - Rua</Label>
            <Input
              value={getSetting('contact', 'street')}
              onChange={(e) => updateSetting('contact', 'street', e.target.value)}
              placeholder="Rua das Flores, 123"
            />
          </div>
          <div>
            <Label>Endereço - Cidade/Estado</Label>
            <Input
              value={getSetting('contact', 'city_state')}
              onChange={(e) => updateSetting('contact', 'city_state', e.target.value)}
              placeholder="Centro - São Paulo - SP"
            />
          </div>
          <div>
            <Label>CEP</Label>
            <Input
              value={getSetting('contact', 'cep')}
              onChange={(e) => updateSetting('contact', 'cep', e.target.value)}
              placeholder="01234-567"
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={getSetting('contact', 'phone')}
              onChange={(e) => updateSetting('contact', 'phone', e.target.value)}
              placeholder="(11) 9999-9999"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={getSetting('contact', 'email')}
              onChange={(e) => updateSetting('contact', 'email', e.target.value)}
              placeholder="contato@popularvet.com.br"
            />
          </div>
          <div>
            <Label>Horário - Segunda a Sexta</Label>
            <Input
              value={getSetting('contact', 'hours_weekdays')}
              onChange={(e) => updateSetting('contact', 'hours_weekdays', e.target.value)}
              placeholder="Seg-Sex: 8h às 18h"
            />
          </div>
          <div>
            <Label>Horário - Sábado</Label>
            <Input
              value={getSetting('contact', 'hours_saturday')}
              onChange={(e) => updateSetting('contact', 'hours_saturday', e.target.value)}
              placeholder="Sábado: 8h às 14h"
            />
          </div>
          <div>
            <Label>Emergências</Label>
            <Input
              value={getSetting('contact', 'emergency_hours')}
              onChange={(e) => updateSetting('contact', 'emergency_hours', e.target.value)}
              placeholder="Emergências 24h"
            />
          </div>
        </CardContent>
      </Card>

      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Logo e Identidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo_text">Texto da Logo</Label>
            <Input
              id="logo_text"
              value={getSetting('general', 'logo_text', 'PopularVET')}
              onChange={(e) => updateSetting('general', 'logo_text', e.target.value)}
              placeholder="PopularVET"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Texto principal que aparecerá como logo (usado quando não há imagem)
            </p>
          </div>
          
          <div>
            <Label htmlFor="logo_subtitle">Subtítulo da Logo</Label>
            <Input
              id="logo_subtitle"
              value={getSetting('general', 'logo_subtitle', 'Aqui tem cuidados para todos os pets')}
              onChange={(e) => updateSetting('general', 'logo_subtitle', e.target.value)}
              placeholder="Aqui tem cuidados para todos os pets"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Texto secundário que aparece abaixo do logo
            </p>
          </div>
          
          <div>
            <Label htmlFor="logo_image_url">URL da Imagem da Logo (opcional)</Label>
            <Input
              id="logo_image_url"
              value={getSetting('general', 'logo_image_url', '/images/logo-popularvet-resize-min.png')}
              onChange={(e) => updateSetting('general', 'logo_image_url', e.target.value)}
              placeholder="https://exemplo.com/logo.png"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Se fornecida, a imagem será usada no lugar do texto. Recomendado: PNG com fundo transparente
            </p>
          </div>

          <div>
            <Label htmlFor="logo_link_url">Link da Logo (opcional)</Label>
            <Input
              id="logo_link_url"
              value={getSetting('general', 'logo_link_url')}
              onChange={(e) => updateSetting('general', 'logo_link_url', e.target.value)}
              placeholder="https://meusite.com"
            />
            <p className="text-sm text-muted-foreground mt-1">
              URL para onde a logo deve direcionar quando clicada (deixe vazio para página inicial)
            </p>
          </div>

          <div>
            <Label htmlFor="logo_alt_text">Texto Alternativo da Logo</Label>
            <Input
              id="logo_alt_text"
              value={getSetting('general', 'logo_alt_text', 'Logo PopularVET')}
              onChange={(e) => updateSetting('general', 'logo_alt_text', e.target.value)}
              placeholder="Logo da Clínica Veterinária"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Texto que aparece para leitores de tela e quando a imagem não carrega
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ReCAPTCHA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do reCAPTCHA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recaptcha_site_key">Site Key do reCAPTCHA</Label>
            <Input
              id="recaptcha_site_key"
              value={getSetting('general', 'recaptcha_site_key')}
              onChange={(e) => updateSetting('general', 'recaptcha_site_key', e.target.value)}
              placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Chave pública do Google reCAPTCHA v2 para proteção contra spam
            </p>
          </div>
          
          <div>
            <Label htmlFor="recaptcha_secret_key">Secret Key do reCAPTCHA</Label>
            <Input
              id="recaptcha_secret_key"
              type="password"
              value={getSetting('general', 'recaptcha_secret_key')}
              onChange={(e) => updateSetting('general', 'recaptcha_secret_key', e.target.value)}
              placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Chave secreta do Google reCAPTCHA v2 (mantida em segurança no servidor)
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Como configurar o reCAPTCHA:</h4>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Acesse <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="underline">Google reCAPTCHA Console</a></li>
              <li>Crie um novo site ou use um existente</li>
              <li>Selecione "reCAPTCHA v2" → "Caixa de seleção 'Não sou um robô'"</li>
              <li>Adicione o domínio do seu site</li>
              <li>Copie as chaves geradas para os campos acima</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          onClick={() => {
            console.log('🔄 Forçando atualização manual...');
            window.dispatchEvent(new CustomEvent('forceRefresh'));
            loadSettings();
          }} 
          variant="outline"
        >
          Atualizar Dados
        </Button>
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default SiteSettingsTab;