import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PartyPopper, Sparkles } from 'lucide-react';

const EventsGallerySection = () => {
  const [activeTab, setActiveTab] = useState('festavip');

  const events = {
    festavip: {
      title: '1ª FESTAVIP CELEBRATION',
      description: 'Nosso primeiro grande evento reunindo tutores e seus pets em uma celebração inesquecível!',
      icon: PartyPopper,
      images: [
        { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', alt: 'Festa VIP 1' },
        { url: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800', alt: 'Festa VIP 2' },
        { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', alt: 'Festa VIP 3' },
        { url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800', alt: 'Festa VIP 4' },
      ]
    }
  };

  return (
    <section id="eventos" className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Momentos Especiais</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Galeria de Eventos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Momentos inesquecíveis compartilhados com nossos clientes e seus pets
          </p>
        </div>

        <Tabs defaultValue="festavip" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto mb-12">
            <TabsTrigger value="festavip" className="flex items-center gap-2">
              <PartyPopper className="h-4 w-4" />
              1ª FESTAVIP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="festavip" className="mt-0">
            <div className="max-w-6xl mx-auto">
              <div className="bg-primary/5 rounded-2xl p-8 mb-8 text-center">
                <h3 className="text-3xl font-bold mb-3 text-primary">
                  {events.festavip.title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {events.festavip.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {events.festavip.images.map((image, index) => (
                  <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default EventsGallerySection;
