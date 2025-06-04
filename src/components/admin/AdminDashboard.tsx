
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Settings, FileText, Users, Package, Heart } from 'lucide-react';
import SiteSettingsTab from './tabs/SiteSettingsTab';
import LostPetsTab from './tabs/LostPetsTab';
import TestimonialsTab from './tabs/TestimonialsTab';
import ProductsTab from './tabs/ProductsTab';
import ServicesTab from './tabs/ServicesTab';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                PopularVet - Painel Administrativo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="lost-pets" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Pets Perdidos
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Depoimentos
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Serviços
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SiteSettingsTab />
          </TabsContent>

          <TabsContent value="lost-pets">
            <LostPetsTab />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
