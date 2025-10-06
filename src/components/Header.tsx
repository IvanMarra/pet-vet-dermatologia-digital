import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X, Phone, MapPin } from 'lucide-react'; // Removido MessageCircle
import { supabase } from '@/integrations/supabase/client';
import WhatsAppIcon from './WhatsAppIcon'; // Importar o novo componente de ícone

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [contactData] = useState({
    phones: [
      { number: '31 99550-2094', whatsapp: true },
      { number: '(31) 99416-2094', whatsapp: true },
    ],
  });
  
  const [logoData, setLogoData] = useState({
    text: 'PopularVET',
    subtitle: 'Aqui tem cuidados para todos os pets',
    imageUrl: '/images/logo-popularvet-resize-min.png',
    linkUrl: '/',
    altText: 'Logo PopularVET'
  });

  useEffect(() => {
    loadLogoData();
  }, []);

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
          imageUrl: logoSettings.logo_image_url || '/images/logo-popularvet-resize-min.png',
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
    { id: 'inicio', label: 'Home' },
    { id: 'about', label: 'Sobre Nós' },
    { id: 'services', label: 'Procedimentos' },
    { id: 'loja', label: 'Loja Online' },
    { id: 'lost-pets', label: 'Pets Perdidos' },
    { id: 'veterinaria', label: 'Dra. Karine' },
    { id: 'testimonials', label: 'Depoimentos' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300">
      {/* Top Bar integrada */}
      <div className="bg-danger-red text-primary-foreground py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {contactData.phones.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a 
                  href={`tel:${phone.number.replace(/\D/g, '')}`} 
                  className="hover:underline"
                  title={`Ligar para ${phone.number}`}
                >
                  {phone.number}
                </a>
                {phone.whatsapp && (
                  <a 
                    href={`https://wa.me/${phone.number.replace(/\D/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-1 text-green-300 hover:text-green-100 transition-colors"
                    title="Enviar mensagem via WhatsApp"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> {/* Usando o componente WhatsAppIcon */}
                  </a>
                )}
              </div>
            ))}
            <div className="hidden md:flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Primeira clínica especializada em dermatologia da região!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href={logoData.linkUrl || "#"} className="flex items-center gap-2">
            {logoData.imageUrl ? (
              <img 
                src={logoData.imageUrl} 
                alt={logoData.altText} 
                className="h-12 w-auto object-contain"
                onError={(e) => {
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
  );
};

export default Header;