
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Heart, MapPin, Phone } from 'lucide-react';

const LostPetsSection = () => {
  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    breed: '',
    color: '',
    location: '',
    date: '',
    description: '',
    contact: '',
    email: ''
  });

  const lostPets = [
    {
      id: 1,
      name: "Max",
      type: "Cão",
      breed: "Golden Retriever",
      color: "Dourado",
      location: "Centro da cidade",
      date: "2024-01-15",
      contact: "(11) 99999-9999",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&q=80"
    },
    {
      id: 2,
      name: "Luna",
      type: "Gato",
      breed: "SRD",
      color: "Preto e branco",
      location: "Bairro Jardim",
      date: "2024-01-20",
      contact: "(11) 88888-8888",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80"
    },
    {
      id: 3,
      name: "Bolinha",
      type: "Cão",
      breed: "Poodle",
      color: "Branco",
      location: "Vila Nova",
      date: "2024-01-18",
      contact: "(11) 77777-7777",
      image: "https://images.unsplash.com/photo-1616190264687-b7ebf7aa1015?w=300&q=80"
    }
  ];

  const foundPets = [
    {
      id: 1,
      type: "Cão",
      breed: "SRD",
      color: "Marrom",
      location: "Próximo ao parque central",
      date: "2024-01-22",
      contact: "(11) 66666-6666",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria integrado com o backend
    console.log('Dados do formulário:', formData);
    alert('Informações cadastradas com sucesso! Entraremos em contato em breve.');
  };

  return (
    <section id="lost-pets" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Pets Perdidos e Encontrados</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ajudamos a reunir pets com suas famílias. Cadastre seu pet perdido ou um pet encontrado.
          </p>
        </div>

        <Tabs defaultValue="lost" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="lost">Pets Perdidos</TabsTrigger>
            <TabsTrigger value="found">Pets Encontrados</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="lost">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lostPets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500 font-medium">PERDIDO</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{pet.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p><strong>Tipo:</strong> {pet.type}</p>
                      <p><strong>Raça:</strong> {pet.breed}</p>
                      <p><strong>Cor:</strong> {pet.color}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{pet.location}</span>
                      </div>
                      <p><strong>Desde:</strong> {new Date(pet.date).toLocaleDateString()}</p>
                    </div>
                    <Button className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      {pet.contact}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="found">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundPets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={pet.image}
                      alt="Pet encontrado"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500 font-medium">ENCONTRADO</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">Pet Encontrado</h3>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <p><strong>Tipo:</strong> {pet.type}</p>
                      <p><strong>Raça:</strong> {pet.breed}</p>
                      <p><strong>Cor:</strong> {pet.color}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{pet.location}</span>
                      </div>
                      <p><strong>Encontrado em:</strong> {new Date(pet.date).toLocaleDateString()}</p>
                    </div>
                    <Button className="w-full" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      {pet.contact}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="register">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Cadastrar Pet Perdido ou Encontrado</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="petName">Nome do Pet (se souber)</Label>
                      <Input
                        id="petName"
                        value={formData.petName}
                        onChange={(e) => handleInputChange('petName', e.target.value)}
                        placeholder="Nome do pet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="petType">Tipo de Animal</Label>
                      <Input
                        id="petType"
                        value={formData.petType}
                        onChange={(e) => handleInputChange('petType', e.target.value)}
                        placeholder="Cão, Gato, etc."
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="breed">Raça</Label>
                      <Input
                        id="breed"
                        value={formData.breed}
                        onChange={(e) => handleInputChange('breed', e.target.value)}
                        placeholder="Raça do animal"
                      />
                    </div>
                    <div>
                      <Label htmlFor="color">Cor</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        placeholder="Cor predominante"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Local</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Onde foi visto pela última vez"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descreva características especiais, comportamento, etc."
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact">Telefone para Contato</Label>
                      <Input
                        id="contact"
                        value={formData.contact}
                        onChange={(e) => handleInputChange('contact', e.target.value)}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Cadastrar Informações
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default LostPetsSection;
