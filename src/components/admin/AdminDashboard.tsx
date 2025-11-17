
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import SiteSettingsTab from './tabs/SiteSettingsTab';
import ServicesTab from './tabs/ServicesTab';
import ProductsTab from './tabs/ProductsTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import LostPetsTab from './tabs/LostPetsTab';
import DashboardTab from './tabs/DashboardTab';
import ContactsTab from './tabs/ContactsTab';
import HeroSlidesTab from './tabs/HeroSlidesTab';
import PetGalleryTab from './tabs/PetGalleryTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Iniciando processo de logout...');
      
      // Mostrar toast de confirmação
      toast({
        title: "Fazendo logout...",
        description: "Você está sendo desconectado.",
      });
      
      // Executar logout
      logout();
      
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open('/', '_blank')}
                className="hidden sm:inline-flex"
              >
                Ver Site
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="gallery">Galeria</TabsTrigger>
              <TabsTrigger value="hero-slides" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Slides</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Contatos</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configurações</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Serviços</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Produtos</span>
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Depoimentos</span>
              </TabsTrigger>
              <TabsTrigger value="lost-pets" className="flex items-center gap-2">
                <PawPrint className="h-4 w-4" />
                <span className="hidden sm:inline">Pets</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <DashboardTab />
            </TabsContent>

            <TabsContent value="hero-slides" className="space-y-4">
              <HeroSlidesTab />
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <ContactsTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <SiteSettingsTab />
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <ServicesTab />
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-4">
              <TestimonialsTab />
            </TabsContent>

            <TabsContent value="lost-pets" className="space-y-4">
              <LostPetsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
