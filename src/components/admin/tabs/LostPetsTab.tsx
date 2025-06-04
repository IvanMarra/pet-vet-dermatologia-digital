
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface LostPet {
  id: string;
  type: string;
  pet_name: string;
  pet_type: string;
  breed: string;
  color: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: string;
  created_at: string;
}

const LostPetsTab = () => {
  const [pets, setPets] = useState<LostPet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const { data } = await supabase
        .from('lost_pets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setPets(data);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePetStatus = async (id: string, status: string) => {
    try {
      await supabase
        .from('lost_pets')
        .update({ status })
        .eq('id', id);
      
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

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
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
                <Badge variant={pet.status === 'active' ? 'default' : 'secondary'}>
                  {pet.status === 'active' ? 'Ativo' : 'Resolvido'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Tipo:</strong> {pet.pet_type}</p>
                  <p><strong>Raça:</strong> {pet.breed || 'Não informado'}</p>
                  <p><strong>Cor:</strong> {pet.color}</p>
                  <p><strong>Local:</strong> {pet.location}</p>
                </div>
                <div>
                  <p><strong>Contato:</strong> {pet.contact_name}</p>
                  <p><strong>Telefone:</strong> {pet.contact_phone}</p>
                  <p><strong>Email:</strong> {pet.contact_email || 'Não informado'}</p>
                  <p><strong>Data:</strong> {new Date(pet.created_at).toLocaleDateString()}</p>
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
