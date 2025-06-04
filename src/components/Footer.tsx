
import React from 'react';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-full p-2">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold">VetCare</h3>
                <p className="text-xs text-gray-400">Clínica Veterinária</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              A primeira clínica veterinária especializada em dermatologia da região. 
              Cuidando dos seus melhores amigos com amor e profissionalismo.
            </p>
            <div className="flex gap-4">
              <div className="bg-gray-800 rounded-full p-2 hover:bg-primary transition-colors cursor-pointer">
                <Instagram className="h-4 w-4" />
              </div>
              <div className="bg-gray-800 rounded-full p-2 hover:bg-primary transition-colors cursor-pointer">
                <Facebook className="h-4 w-4" />
              </div>
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
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>contato@vetcare.com.br</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1" />
                <div>
                  <p>Rua das Flores, 123</p>
                  <p>Centro - São Paulo - SP</p>
                  <p>CEP: 01234-567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-1" />
                <div>
                  <p>Seg-Sex: 8h às 18h</p>
                  <p>Sábado: 8h às 14h</p>
                  <p className="text-primary">Emergências 24h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 VetCare Clínica Veterinária. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer">Termos de Uso</span>
              <span>|</span>
              <span className="hover:text-white transition-colors cursor-pointer">Política de Privacidade</span>
              <span>|</span>
              <span className="hover:text-white transition-colors cursor-pointer">CRMV-SP: 12345</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
