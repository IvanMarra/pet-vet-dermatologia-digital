import React from 'react';
import { Button } from '@/components/ui/button';
import WhatsAppIcon from './WhatsAppIcon'; // Importar o novo componente de ícone

const WhatsAppFloatingButton = () => {
  const whatsappNumbers = ['31995502094', '31994162094']; // (31) 99550-2094 e (31) 99416-2094

  return (
    <Button
      onClick={() => window.open(`https://wa.me/${whatsappNumbers[0]}`, '_blank')}
      size="lg"
      className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg hover:shadow-xl transition-shadow bg-green-500 hover:bg-green-600 text-white p-4"
      aria-label="Fale conosco pelo WhatsApp - (31) 99550-2094"
      title="WhatsApp: (31) 99550-2094"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </Button>
  );
};

export default WhatsAppFloatingButton;