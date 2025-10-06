import React from 'react';
import { Button } from '@/components/ui/button';
import WhatsAppIcon from './WhatsAppIcon'; // Importar o novo componente de ícone

const WhatsAppFloatingButton = () => {
  const whatsappNumber = '31995502094'; // Número de WhatsApp da clínica

  return (
    <Button
      onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
      size="lg"
      className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-green-500 hover:bg-green-600 text-white p-4"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </Button>
  );
};

export default WhatsAppFloatingButton;