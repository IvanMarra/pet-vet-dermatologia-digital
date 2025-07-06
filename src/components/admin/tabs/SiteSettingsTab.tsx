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
      for (const section in settings) {
        for (const key in settings[section]) {
          await supabase
            .from('site_settings')
            .upsert({
              section,
              key,
              value: JSON.stringify(settings[section][key])
            });
        }
      }
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!",
      });
      
      // Trigger a reload of settings in other components
      window.dispatchEvent(new CustomEvent('settingsUpdated'));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
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
    return settings[section]?.[key] || defaultValue;
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
            <Label>Nome</Label>
            <Input
              value={getSetting('veterinarian', 'name')}
              onChange={(e) => updateSetting('veterinarian', 'name', e.target.value)}
            />
          </div>
          <div>
            <Label>Especialidade</Label>
            <Input
              value={getSetting('veterinarian', 'specialty')}
              onChange={(e) => updateSetting('veterinarian', 'specialty', e.target.value)}
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              value={getSetting('veterinarian', 'description')}
              onChange={(e) => updateSetting('veterinarian', 'description', e.target.value)}
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              value={getSetting('veterinarian', 'linkedin')}
              onChange={(e) => updateSetting('veterinarian', 'linkedin', e.target.value)}
            />
          </div>
          
          <ImageUpload
            bucket="veterinarian-photos"
            currentImageUrl={getSetting('veterinarian', 'photo')}
            onImageUploaded={(url) => updateSetting('veterinarian', 'photo', url)}
            onImageRemoved={() => updateSetting('veterinarian', 'photo', '')}
            label="Foto da Dra. Karine"
            recommendedSize="400x500 pixels (formato retrato)"
            maxSizeMB={2}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Endereço</Label>
            <Input
              value={getSetting('contact', 'address')}
              onChange={(e) => updateSetting('contact', 'address', e.target.value)}
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input
              value={getSetting('contact', 'phone')}
              onChange={(e) => updateSetting('contact', 'phone', e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={getSetting('contact', 'email')}
              onChange={(e) => updateSetting('contact', 'email', e.target.value)}
            />
          </div>
          <div>
            <Label>Horário de Funcionamento</Label>
            <Textarea
              value={getSetting('contact', 'hours')}
              onChange={(e) => updateSetting('contact', 'hours', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};

export default SiteSettingsTab;
