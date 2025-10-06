import React, { useState, useEffect } from 'react';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Footer = () => {
  const [footerData, setFooterData] = useState({
    company_name: 'PopularVET',
    company_subtitle: 'Aqui tem cuidados para todos os pets',
    company_description: 'A primeira clínica veterinária especializada em dermatologia da região. Cuidando dos seus melhores amigos com amor e profissionalismo.',
    copyright: '© 2024 PopularVET Clínica Veterinária. Todos os direitos reservados.',
    crmv: 'CRM-MG 26.710', // Atualizado para CRMV da Dra. Karine
    instagram_url: '',
    facebook_url: '',
  });

  const [contactData, setContactData] = useState({
    street: 'Rua Francisco Passos 645 Lj 2',
    city_state: 'Bairro Pedra Azul, CEP: 32185-090',
    cep: '32185-090', // Adicionado CEP explicitamente
    phone: '(31) 99550-2094',
    email: 'contato@popularvet.com',
    hours_weekdays: 'Terça a Sexta: 10h às 20h30',
    hours_saturday: 'Sábado: 9h às 14h30',
    emergency_hours: 'Emergências e Urgências: ligar para verificar disponibilidade',
  });

  const [logoImageUrl, setLogoImageUrl] = useState('/images/logo-popularvet-resize-min.png');

  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('section', ['footer', 'contact', 'general']); // Incluir 'general' para logo_text/subtitle
      
      if (data) {
        const footerSettings: any = {};
        const contactSettings: any = {};
        const generalSettings: any = {};
        
        data.forEach(item => {
          let value = item.value;
          if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          
          if (item.section === 'footer') {
            footerSettings[item.key] = value;
          } else if (item.section === 'contact') {
            contactSettings[item.key] = value;
          } else if (item.section === 'general') {
            generalSettings[item.key] = value;
          }
        });
        
        // Combine general settings for company name/subtitle if available
        const companyName = generalSettings.logo_text || footerSettings.company_name || 'PopularVET';
        const companySubtitle = generalSettings.logo_subtitle || footerSettings.company_subtitle || 'Aqui tem cuidados para todos os pets';
        const logoImg = generalSettings.logo_image_url || '/images/logo-popularvet-resize-min.png';

        setFooterData(prev => ({ 
          ...prev, 
          ...footerSettings,
          company_name: companyName,
          company_subtitle: companySubtitle,
          crmv: footerSettings.crmv || 'CRM-MG 26.710', // Garantir que o CRMV seja o correto
        }));
        setLogoImageUrl(logoImg);

        // Processar endereço e horários para exibir corretamente
        let fullAddress = contactSettings.address;
        if (!fullAddress && (contactSettings.street || contactSettings.city_state || contactSettings.cep)) {
          const addressParts = [];
          if (contactSettings.street) addressParts.push(contactSettings.street);
          if (contactSettings.city_state) addressParts.push(contactSettings.city_state);
          if (contactSettings.cep) addressParts.push(`CEP: ${contactSettings.cep}`);
          fullAddress = addressParts.join('\n');
        }

        let fullHours = contactSettings.hours;
        if (!fullHours && (contactSettings.hours_weekdays || contactSettings.hours_saturday || contactSettings.emergency_hours)) {
          const hoursParts = [];
          if (contactSettings.hours_weekdays) hoursParts.push(contactSettings.hours_weekdays);
          if (contactSettings.hours_saturday) hoursParts.push(contactSettings.hours_saturday);
          if (contactSettings.emergency_hours) hoursParts.push(contactSettings.emergency_hours);
          fullHours = hoursParts.join('\n');
        }

        setContactData(prev => ({ 
          ...prev, 
          ...contactSettings,
          street: contactSettings.street || prev.street,
          city_state: contactSettings.city_state || prev.city_state,
          cep: contactSettings.cep || prev.cep,
          phone: contactSettings.phone || prev.phone,
          email: contactSettings.email || prev.email,
          hours_weekdays: contactSettings.hours_weekdays || prev.hours_weekdays,
          hours_saturday: contactSettings.hours_saturday || prev.hours_saturday,
          emergency_hours: contactSettings.emergency_hours || prev.emergency_hours,
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do rodapé:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {logoImageUrl ? (
                <img 
                  src={logoImageUrl} 
                  alt={footerData.company_name} 
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
              {!logoImageUrl && (
                <div>
                  <h3 className="text-xl font-bold">{footerData.company_name}</h3>
                  <p className="text-xs text-gray-400">{footerData.company_subtitle}</p>
                </div>
              )}
            </div>
            <p className="text-gray-400 mb-4">
              {footerData.company_description}
            </p>
            <div className="flex gap-4">
              {footerData.instagram_url && (
                <a 
                  href={footerData.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 rounded-full p-2 hover:bg-primary transition-colors cursor-pointer"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {footerData.facebook_url && (
                <a 
                  href={footerData.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 rounded-full p-2 hover:bg-primary transition-colors cursor-pointer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Serviços */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nossos Serviços</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Clínica Geral</li>
              <li className="hover:text-white transition-colors cursor-pointer">Dermatologia</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cirurgias</li>
              <li className="hover:text-white transition-colors cursor-pointer">Exames Laboratoriais</li>
              <li className="hover:text-white transition-colors cursor-pointer">Produtos para Pets</li>
              <li className="hover:text-white transition-colors cursor-pointer">Emergência 24h</li>
            </ul>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Sobre Nós</li>
              <li className="hover:text-white transition-colors cursor-pointer">Dra. Karine</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pets Perdidos</li>
              <li className="hover:text-white transition-colors cursor-pointer">Depoimentos</li>
              <li className="hover:text-white transition-colors cursor-pointer">Área Administrativa</li>
              <li className="hover:text-white transition-colors cursor-pointer">Política de Privacidade</li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <span>{contactData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>{contactData.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  <p>{contactData.street}</p>
                  <p>{contactData.city_state}</p>
                  {contactData.cep && <p>CEP: {contactData.cep}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1" />
                <div>
                  <p>{contactData.hours_weekdays}</p>
                  <p>{contactData.hours_saturday}</p>
                  <p className="text-primary">{contactData.emergency_hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {footerData.copyright}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer">Termos de Uso</span>
              <span>|</span>
              <span className="hover:text-white transition-colors cursor-pointer">Política de Privacidade</span>
              <span>|</span>
              <span className="hover:text-white transition-colors cursor-pointer">{footerData.crmv}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;