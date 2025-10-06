import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import StoreSection from '@/components/StoreSection';
import LostPetsSection from '@/components/LostPetsSection';
import VeterinarianSection from '@/components/VeterinarianSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'; // Importar o novo componente

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <StoreSection />
      <LostPetsSection />
      <VeterinarianSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <WhatsAppFloatingButton /> {/* Adicionar o botão flutuante */}
    </div>
  );
};

export default Index;