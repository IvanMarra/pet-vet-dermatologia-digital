import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactData, setContactData] = useState({
    phone: '(11) 9999-9999'
  });
  
  const [logoData, setLogoData] = useState({
    text: 'PopularVET',
    subtitle: 'Aqui tem cuidados para todos os pets',
    imageUrl: '/images/logo-popularvet.jpeg', // Nova URL da imagem
    linkUrl: '/',
    altText: 'Logo PopularVET'
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Carregar dados de contato e logo
    loadContactData();
    loadLogoData();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadContactData = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'contact')
        .eq('key', 'phone')
        .single();
      
      if (!error && data) {
        setContactData({ phone: String(data.value) });
      }
    } catch (error) {
      console.log('Erro ao carregar telefone do header:', error);
    }
  };

  const loadLogoData = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('section', 'general');
      
      if (!error && data) {
        const logoSettings = data.reduce((acc, item) => {
          acc[item.key] = typeof item.value === 'string' ? 
            item.value.replace(/^"|"$/g, '') : item.value;
          return acc;
        }, {} as Record<string, any>);
        
        setLogoData({
          text: logoSettings.logo_text || 'PopularVET',
          subtitle: logoSettings.logo_subtitle || 'Aqui tem cuidados para todos os pets',
          imageUrl: logoSettings.logo_image_url || '/images/logo-popularvet.jpeg', // Fallback para a nova logo
          linkUrl: logoSettings.logo_link_url || '/',
          altText: logoSettings.logo_alt_text || 'Logo PopularVET'
        });
      }
    } catch (error) {
      console.log('Erro ao carregar dados da logo:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Sobre Nós' },
    { id: 'services', label: 'Procedimentos' },
    { id: 'loja', label: 'Loja Online' },
    { id: 'lost-pets', label: 'Pets Perdidos' },
    { id: 'veterinaria', label: 'Dra. Karine' },
    { id: 'testimonials', label: 'Depoimentos' },
    { id: 'contact', label: 'Contato' },
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{contactData.phone}</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Primeira clínica especializada em dermatologia da região!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href={logoData.linkUrl || "#"} className="flex items-center gap-2">
              {logoData.imageUrl ? (
                <img 
                  src={logoData.imageUrl} 
                  alt={logoData.altText} 
                  className="h-12 w-auto object-contain" // Ajustado para altura fixa e largura automática
                  onError={(e) => {
                    // Fallback para o ícone padrão se a imagem falhar
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'block';
                    }
                  }}
                />
              ) : (
                <div className="bg-primary rounded-full p-2">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
              )}
              {/* O texto da logo só aparece se não houver imagem ou se a imagem falhar */}
              {!logoData.imageUrl && (
                <div>
                  <h1 className="text-xl font-bold text-primary">{logoData.text}</h1>
                  <p className="text-xs text-muted-foreground">{logoData.subtitle}</p>
                </div>
              )}
            </a>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;