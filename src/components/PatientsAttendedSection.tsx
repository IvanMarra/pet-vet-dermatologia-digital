import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface PatientCase {
  id: string;
  pet_name: string;
  description: string;
  before_image_url: string;
  after_image_url: string;
  treatment_duration: string | null;
}

const PatientsAttendedSection = () => {
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_transformations')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Erro ao carregar casos:', error);
    } finally {
      setLoading(false);
    }
  };

  const conditions = [
    { value: 'all', label: 'Todos os Casos' },
    { value: 'dermatite', label: 'Dermatite' },
    { value: 'alergia', label: 'Alergia' },
    { value: 'sarna', label: 'Sarna' },
    { value: 'outros', label: 'Outros' }
  ];

  const filteredCases = filter === 'all' 
    ? cases 
    : cases.filter(c => c.description.toLowerCase().includes(filter.toLowerCase()));

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="pacientes-atendidos" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Pacientes Atendidos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Casos reais de recuperação e tratamento dos nossos pacientes
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto mb-12">
            {conditions.map((condition) => (
              <TabsTrigger key={condition.value} value={condition.value}>
                {condition.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={filter} className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCases.map((patientCase) => (
                <Card key={patientCase.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-2 gap-1 relative">
                    <div className="relative aspect-square">
                      <img
                        src={patientCase.before_image_url}
                        alt={`${patientCase.pet_name} - Antes`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-semibold">
                        Antes
                      </div>
                    </div>
                    <div className="relative aspect-square">
                      <img
                        src={patientCase.after_image_url}
                        alt={`${patientCase.pet_name} - Depois`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                        Depois
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{patientCase.pet_name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {patientCase.description}
                    </p>
                    {patientCase.treatment_duration && (
                      <div className="text-sm text-primary font-semibold">
                        Duração do tratamento: {patientCase.treatment_duration}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCases.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum caso encontrado para este filtro.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PatientsAttendedSection;
