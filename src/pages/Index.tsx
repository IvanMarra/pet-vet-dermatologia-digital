import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import ValuesSection from '@/components/ValuesSection';
import BlogSection from '@/components/BlogSection';
import ServicesSection from '@/components/ServicesSection';
import StoreSection from '@/components/StoreSection';
import VeterinarianSection from '@/components/VeterinarianSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <HeroSection />
      <BeforeAfterSection />
      <ValuesSection />
      <BlogSection />
      <ServicesSection />
      <StoreSection />
      <VeterinarianSection />
      <TestimonialsSection />
      <Footer />
      <ScrollToTop />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default Index;