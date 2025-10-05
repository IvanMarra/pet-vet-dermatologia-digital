import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ShoppingBag, Pill, Heart } from 'lucide-react';

const StoreSection = () => {
  return (
    <section id="loja" className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Nossa Loja Online</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Encontre todos os produtos que seu pet precisa em nossa loja online especializada
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white text-center py-12">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 rounded-full p-4">
                  <ShoppingBag className="h-12 w-12" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-4">PetVetFarma</CardTitle>
              <p className="text-xl opacity-90">
                Sua farmácia veterinária online de confiança
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Pill className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Medicamentos</h3>
                  <p className="text-sm text-muted-foreground">
                    Medicamentos veterinários com prescrição e orientação profissional
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Suplementos</h3>
                  <p className="text-sm text-muted-foreground">
                    Vitaminas e suplementos para manter a saúde do seu pet
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Acessórios</h3>
                  <p className="text-sm text-muted-foreground">
                    Produtos para cuidado, higiene e bem-estar animal
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Vantagens da Nossa Loja Online:
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Entrega rápida e segura
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Produtos originais e certificados
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Orientação veterinária especializada
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Preços competitivos
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Atendimento personalizado
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Receitas online aceitas
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-3"
                  onClick={() => window.open('https://petvetfarma.com', '_blank')}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Visitar Nossa Loja Online
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Acesse petvetfarma.com e encontre tudo que seu pet precisa
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StoreSection;