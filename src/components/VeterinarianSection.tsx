
import React from 'react';
import { useVeterinarianData } from '@/hooks/useVeterinarianData';
import VeterinarianCard from '@/components/VeterinarianCard';

const VeterinarianSection = () => {
  const { veterinarianData, loading } = useVeterinarianData();

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="veterinaria" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            {veterinarianData.sectionTitle || 'Nossa Veterinária'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {veterinarianData.sectionSubtitle || 'Conheça a profissional dedicada que cuida do seu pet com carinho e expertise.'}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <VeterinarianCard
            name={veterinarianData.name}
            title={veterinarianData.title}
            description={veterinarianData.description}
            image={veterinarianData.image}
            experience={veterinarianData.experience}
            specialties={veterinarianData.specialties}
            education={veterinarianData.education}
            linkedin={veterinarianData.linkedin}
          />
        </div>
      </div>
    </section>
  );
};

export default VeterinarianSection;
