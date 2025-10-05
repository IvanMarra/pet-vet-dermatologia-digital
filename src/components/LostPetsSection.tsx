
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Heart, MapPin, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import MapComponent from './MapComponent';

interface LostPet {
  id: string;
  type: string;
  pet_name: string;
  pet_type: string;
  breed: string;
  color: string;
  size: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  image_url: string;
  description: string;
  coordinates: [number, number] | null;
  created_at: string;
}

const LostPetsSection = () => {
  const [lostPets, setLostPets] = useState<LostPet[]>([]);
  const [foundPets, setFoundPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'lost',
    petName: '',
    petType: '',
    breed: '',
    color: '',
    size: '',
    location: '',
    description: '',
    contact: '',
    email: '',
    coordinates: null as [number, number] | null
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const { data } = await supabase
        .from('lost_pets')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (data) {
        const petsWithCoordinates = data.map(pet => ({
          ...pet,
          coordinates: pet.coordinates ? 
            (Array.isArray(pet.coordinates) ? pet.coordinates as [number, number] : null) 
            : null
        }));
        
        const lost = petsWithCoordinates.filter(pet => pet.type === 'lost');
        const found = petsWithCoordinates.filter(pet => pet.type === 'found');
        setLostPets(lost);
        setFoundPets(found);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (coordinates: [number, number], address: string) => {
    setFormData(prev => ({
      ...prev,
      coordinates,
      location: address
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await supabase
        .from('lost_pets')
        .insert([{
          type: formData.type,
          pet_name: formData.petName,
          pet_type: formData.petType,
          breed: formData.breed,
          color: formData.color,
          size: formData.size,
          location: formData.location,
          description: formData.description,
          contact_name: formData.contact,
          contact_phone: formData.contact,
          contact_email: formData.email,
          coordinates: formData.coordinates
        }]);
      
      alert('Informações cadastradas com sucesso! Entraremos em contato em breve.');
      
      // Reset form
      setFormData({
        type: 'lost',
        petName: '',
        petType: '',
        breed: '',
        color: '',
        size: '',
        location: '',
        description: '',
        contact: '',
        email: '',
        coordinates: null
      });
      
      // Reload pets
      loadPets();
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar as informações. Tente novamente.');
    }
  };

  const PetCard = ({ pet, isPetLost }: { pet: LostPet; isPetLost: boolean }) => (
    <Card className="overflow-hidden">
      <div className="aspect-square bg-gray-100">
        {pet.image_url ? (
          <img
            src={pet.image_url}
            alt={pet.pet_name || 'Pet'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <MapPin className="h-12 w-12" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {isPetLost ? (
            <>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500 font-medium">PERDIDO</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500 font-medium">ENCONTRADO</span>
            </>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2">
          {pet.pet_name || (isPetLost ? 'Pet Perdido' : 'Pet Encontrado')}
        </h3>
        <div className="space-y-1 text-sm text-muted-foreground mb-4">
          <p><strong>Tipo:</strong> {pet.pet_type}</p>
          {pet.breed && <p><strong>Raça:</strong> {pet.breed}</p>}
          <p><strong>Cor:</strong> {pet.color}</p>
          {pet.size && <p><strong>Porte:</strong> {pet.size}</p>}
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{pet.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(pet.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        {pet.coordinates && (
          <div className="mb-4">
            <MapComponent
              initialCoordinates={pet.coordinates}
              height="150px"
              interactive={false}
              showSearch={false}
            />
          </div>
        )}
        
        <Button className="w-full" size="sm">
          <Phone className="h-4 w-4 mr-2" />
          {pet.contact_phone}
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <section id="lost-pets" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Carregando pets...</p>
        </div>
      </section>
    );
  }

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
                <PetCard key={pet.id} pet={pet} isPetLost={true} />
              ))}
              {lostPets.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhum pet perdido cadastrado no momento.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="found">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} isPetLost={false} />
              ))}
              {foundPets.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  Nenhum pet encontrado cadastrado no momento.
                </div>
              )}
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
                      <Label htmlFor="size">Porte</Label>
                      <Input
                        id="size"
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        placeholder="Pequeno, Médio, Grande"
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

                  <div>
                    <Label htmlFor="location-map">Localização no Mapa</Label>
                    <MapComponent
                      onLocationSelect={handleLocationSelect}
                      initialCoordinates={formData.coordinates || [-46.6333, -23.5505]}
                      initialAddress={formData.location}
                      height="300px"
                      interactive={true}
                      showSearch={true}
                    />
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
