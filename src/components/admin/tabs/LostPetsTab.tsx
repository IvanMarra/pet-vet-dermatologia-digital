import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, CheckCircle, XCircle, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import MapComponent from '../../MapComponent';
import type { Json } from '@/integrations/supabase/types';

interface LostPet {
  id: string;
  type: string;
  pet_name: string | null;
  pet_type: string;
  breed: string | null;
  color: string | null;
  location: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  status: string | null;
  image_url: string | null;
  description: string | null;
  size: string | null;
  coordinates: [number, number] | null;
  created_at: string;
}

const LostPetsTab = () => {
  const [pets, setPets] = useState<LostPet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<LostPet | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: 'lost',
    pet_name: '',
    pet_type: '',
    breed: '',
    color: '',
    size: '',
    location: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    description: '',
    image_url: '',
    coordinates: null as [number, number] | null
  });

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('lost_pets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Transform data to match our interface
        const transformedPets: LostPet[] = data.map(pet => ({
          ...pet,
          coordinates: pet.coordinates ? 
            (Array.isArray(pet.coordinates) && pet.coordinates.length === 2 ? 
              pet.coordinates as [number, number] : null) 
            : null
        }));
        setPets(transformedPets);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePet = async () => {
    try {
      const petData = {
        ...formData,
        coordinates: formData.coordinates as Json
      };

      if (editingPet) {
        const { error } = await supabase
          .from('lost_pets')
          .update(petData)
          .eq('id', editingPet.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lost_pets')
          .insert([petData]);
        
        if (error) throw error;
      }
      
      loadPets();
      resetForm();
      toast({
        title: "Sucesso",
        description: "Pet salvo com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar pet",
        variant: "destructive",
      });
    }
  };

  const updatePetStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('lost_pets')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      loadPets();
      toast({
        title: "Sucesso",
        description: "Status atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive",
      });
    }
  };

  const deletePet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lost_pets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      loadPets();
      toast({
        title: "Sucesso",
        description: "Pet excluído com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir pet:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir pet",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'lost',
      pet_name: '',
      pet_type: '',
      breed: '',
      color: '',
      size: '',
      location: '',
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      description: '',
      image_url: '',
      coordinates: null
    });
    setEditingPet(null);
    setShowForm(false);
  };

  const editPet = (pet: LostPet) => {
    setFormData({
      type: pet.type,
      pet_name: pet.pet_name || '',
      pet_type: pet.pet_type,
      breed: pet.breed || '',
      color: pet.color || '',
      size: pet.size || '',
      location: pet.location,
      contact_name: pet.contact_name,
      contact_phone: pet.contact_phone,
      contact_email: pet.contact_email || '',
      description: pet.description || '',
      image_url: pet.image_url || '',
      coordinates: pet.coordinates
    });
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleLocationSelect = (coordinates: [number, number], address: string) => {
    setFormData({
      ...formData,
      coordinates,
      location: address
    });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pets Perdidos/Encontrados</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPet ? 'Editar Pet' : 'Novo Registro de Pet'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Tipo de Registro</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Pet Perdido</SelectItem>
                    <SelectItem value="found">Pet Encontrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nome do Pet</Label>
                <Input
                  value={formData.pet_name}
                  onChange={(e) => setFormData({...formData, pet_name: e.target.value})}
                  placeholder="Nome do pet (se conhecido)"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Tipo de Animal</Label>
                <Select
                  value={formData.pet_type}
                  onValueChange={(value) => setFormData({...formData, pet_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cão">Cão</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="pássaro">Pássaro</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Raça</Label>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  placeholder="Ex: SRD, Golden, Persa..."
                />
              </div>
              <div>
                <Label>Porte</Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => setFormData({...formData, size: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pequeno">Pequeno</SelectItem>
                    <SelectItem value="médio">Médio</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Cor</Label>
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  placeholder="Cor predominante"
                />
              </div>
              <div>
                <Label>Local (será atualizado automaticamente pelo mapa)</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Bairro, rua, ponto de referência"
                />
              </div>
            </div>

            <div>
              <Label>Localização no Mapa</Label>
              <MapComponent
                onLocationSelect={handleLocationSelect}
                initialCoordinates={formData.coordinates || [-46.6333, -23.5505]}
                initialAddress={formData.location}
                height="400px"
                interactive={true}
                showSearch={true}
              />
            </div>

            <div>
              <Label>Descrição Adicional</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Características especiais, comportamento, etc."
                rows={3}
              />
            </div>

            <ImageUpload
              bucket="pet-images"
              currentImageUrl={formData.image_url}
              onImageUploaded={(url) => setFormData({...formData, image_url: url})}
              onImageRemoved={() => setFormData({...formData, image_url: ''})}
              label="Foto do Pet"
              recommendedSize="600x400 pixels"
              maxSizeMB={3}
            />

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Nome do Contato</Label>
                <Input
                  value={formData.contact_name}
                  onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                />
              </div>
              <div>
                <Label>Telefone</Label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                />
              </div>
              <div>
                <Label>Email (opcional)</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={savePet}>
                {editingPet ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {pets.map((pet) => (
          <Card key={pet.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant={pet.type === 'lost' ? 'destructive' : 'default'}>
                    {pet.type === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
                  </Badge>
                  {pet.pet_name || 'Sem nome'}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant={pet.status === 'active' ? 'default' : 'secondary'}>
                    {pet.status === 'active' ? 'Ativo' : 'Resolvido'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editPet(pet)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deletePet(pet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {pet.image_url && (
                  <div>
                    <img
                      src={pet.image_url}
                      alt={pet.pet_name || 'Pet'}
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
                <div className={pet.image_url ? "md:col-span-2" : "md:col-span-3"}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Tipo:</strong> {pet.pet_type}</p>
                      <p><strong>Raça:</strong> {pet.breed || 'Não informado'}</p>
                      <p><strong>Cor:</strong> {pet.color}</p>
                      <p><strong>Porte:</strong> {pet.size || 'Não informado'}</p>
                    </div>
                    <div>
                      <p><strong>Local:</strong> {pet.location}</p>
                      <p><strong>Contato:</strong> {pet.contact_name}</p>
                      <p><strong>Telefone:</strong> {pet.contact_phone}</p>
                      <p><strong>Data:</strong> {new Date(pet.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {pet.description && (
                    <div className="mt-4">
                      <p><strong>Descrição:</strong> {pet.description}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                {pet.status === 'active' ? (
                  <Button
                    size="sm"
                    onClick={() => updatePetStatus(pet.id, 'resolved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar como Resolvido
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updatePetStatus(pet.id, 'active')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reativar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LostPetsTab;
