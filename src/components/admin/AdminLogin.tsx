
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import ReCAPTCHA from 'react-google-recaptcha';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI');
  const { login } = useAuth();

  useEffect(() => {
    loadRecaptchaConfig();
  }, []);

  const loadRecaptchaConfig = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('section', 'general')
        .eq('key', 'recaptcha_site_key')
        .maybeSingle();
      
      if (data?.value) {
        setRecaptchaSiteKey(String(data.value));
      }
    } catch (error) {
      console.error('Erro ao carregar configuração do reCAPTCHA:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError('Por favor, complete o reCAPTCHA');
      return;
    }

    setLoading(true);
    setError('');

    const success = await login(email, password);
    if (!success) {
      setError('Credenciais inválidas ou usuário não aprovado');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>PopularVet - Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={setCaptchaToken}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
