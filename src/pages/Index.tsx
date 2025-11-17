import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GroomingHeroSection from '@/components/GroomingHeroSection';
import GroomingGallerySection from '@/components/GroomingGallerySection';
import PetGallerySection from '@/components/PetGallerySection';
import DermatologySection from '@/components/DermatologySection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import StoreSection from '@/components/StoreSection';
import LostPetsSection from '@/components/LostPetsSection';
import VeterinarianSection from '@/components/VeterinarianSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

const Index = () => {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <HeroSection />
      <GroomingHeroSection />
      <GroomingGallerySection />
      <PetGallerySection />
      <DermatologySection />
      <BeforeAfterSection />
      <AboutSection />
      <ServicesSection />
      <StoreSection />
      <LostPetsSection />
      <VeterinarianSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default Index;