
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Settings {
  [key: string]: any;
}

const SiteSettingsTab = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*');
      
      if (data) {
        const settingsObj: Settings = {};
        data.forEach(item => {
          if (!settingsObj[item.section]) {
            settingsObj[item.section] = {};
          }
          // Handle different types of JSON values
          let parsedValue;
          try {
            parsedValue = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
          } catch {
            parsedValue = item.value;
          }
          settingsObj[item.section][item.key] = parsedValue;
        });
        setSettings(settingsObj);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seção Hero (Principal)</CardTitle>
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
