import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import GroomingHeroSection from '@/components/GroomingHeroSection';
import GroomingGallerySection from '@/components/GroomingGallerySection';
import PetGallerySection from '@/components/PetGallerySection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import ValuesSection from '@/components/ValuesSection';
import BlogSection from '@/components/BlogSection';
import ServicesSection from '@/components/ServicesSection';
import StoreSection from '@/components/StoreSection';
import VeterinarianSection from '@/components/VeterinarianSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import EventsGallerySection from '@/components/EventsGallerySection';
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
      <BeforeAfterSection />
      <EventsGallerySection />
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