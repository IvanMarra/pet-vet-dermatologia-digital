import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PetPhoto {
  id: string;
  petName: string;
  ownerName?: string;
  serviceDate: string;
  category: string;
  imageUrl: string;
}

const PetGallerySection = () => {
  const { toast } = useToast();
  const [photos] = useState<PetPhoto[]>([
    {
      id: '1',
      petName: 'Rex',
      ownerName: 'Maria Silva',
      serviceDate: '15/01/2025',
      category: 'Banho & Tosa',
      imageUrl: '/public/images/dr-karine.jpeg'
    }
  ]);

  const handleUpload = () => {
    toast({
      title: "Upload em breve!",
      description: "Funcionalidade de upload será implementada com banco de dados.",
    });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Mural dos Pets PopularVET 🐾
          </h2>
          <p className="text-xl text-muted-foreground">
            Veja como nossos clientes ficam ainda mais lindos!
          </p>
        </div>

        {/* Upload Button */}
        <div className="flex justify-center mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-lg">
                <Upload className="mr-2 h-5 w-5" />
                Enviar foto do meu pet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enviar Foto do Pet</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="petName">Nome do Pet</Label>
                  <Input id="petName" placeholder="Ex: Rex" />
                </div>
                <div>
                  <Label htmlFor="ownerName">Seu Nome (opcional)</Label>
                  <Input id="ownerName" placeholder="Ex: Maria Silva" />
                </div>
                <div>
                  <Label htmlFor="category">Categoria do Serviço</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banho-tosa">Banho & Tosa</SelectItem>
                      <SelectItem value="terapeutico">Terapêutico</SelectItem>
                      <SelectItem value="dermato">Dermato</SelectItem>
                      <SelectItem value="estetica">Estética</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="photo">Foto</Label>
                  <Input id="photo" type="file" accept="image/*" />
                </div>
                <Button onClick={handleUpload} className="w-full">
                  Enviar Foto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <Card 
              key={photo.id} 
              className="overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.petName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Watermark */}
                <div className="absolute bottom-2 right-2 bg-white/40 backdrop-blur-sm px-3 py-1 rounded shadow-lg">
                  <span className="text-xs font-semibold text-white drop-shadow-md">
                    popularVET
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <h3 className="font-bold text-lg text-foreground">{photo.petName}</h3>
                {photo.ownerName && (
                  <p className="text-sm text-muted-foreground">Tutor: {photo.ownerName}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {photo.category} • {photo.serviceDate}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetGallerySection;
