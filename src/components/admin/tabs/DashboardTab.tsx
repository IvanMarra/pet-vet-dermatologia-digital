
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Users, MessageSquare, PawPrint, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalVisitors: number;
  totalContacts: number;
  totalLostPets: number;
  totalFoundPets: number;
  recentActivity: any[];
}

const DashboardTab = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVisitors: 0,
    totalContacts: 0,
    totalLostPets: 0,
    totalFoundPets: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load contacts count
      const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

      // Load lost pets count
      const { count: lostPetsCount } = await supabase
        .from('lost_pets')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'lost')
        .eq('status', 'active');

      // Load found pets count
      const { count: foundPetsCount } = await supabase
        .from('lost_pets')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'found')
        .eq('status', 'active');

      // Load analytics count
      const { count: visitorsCount } = await supabase
        .from('site_analytics')
        .select('*', { count: 'exact', head: true });

      // Load recent activity
      const { data: recentContacts } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalVisitors: visitorsCount || 0,
        totalContacts: contactsCount || 0,
        totalLostPets: lostPetsCount || 0,
        totalFoundPets: foundPetsCount || 0,
        recentActivity: recentContacts || []
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async () => {
    try {
      await supabase
        .from('site_analytics')
        .insert([{
          event_type: 'page_view',
          page_path: window.location.pathname,
          user_agent: navigator.userAgent,
          session_id: Math.random().toString(36).substring(7)
        }]);
      
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <Button onClick={trackPageView} variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Atualizar Dados
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visitantes</p>
                <p className="text-2xl font-bold">{stats.totalVisitors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contatos</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pets Perdidos</p>
                <p className="text-2xl font-bold">{stats.totalLostPets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pets Encontrados</p>
                <p className="text-2xl font-bold">{stats.totalFoundPets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((contact, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab;
