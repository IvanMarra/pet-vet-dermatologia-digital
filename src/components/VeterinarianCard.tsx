import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Stethoscope } from 'lucide-react';

interface VeterinarianCardProps {
  name: string;
  title: string;
  description: string;
  image: string;
  experience: string;
  specialties: string[];
  education: string;
  linkedin: string;
}

const VeterinarianCard: React.FC<VeterinarianCardProps> = ({
  name,
  title,
  description,
  image,
  experience,
  specialties,
  education,
  linkedin
}) => {
  // Debug: log da imagem recebida
  React.useEffect(() => {
    console.log('🔍 VeterinarianCard - Imagem recebida:', image);
    console.log('🔍 VeterinarianCard - Tipo da imagem:', typeof image);
    console.log('🔍 VeterinarianCard - Length da imagem:', image?.length);
  }, [image]);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square md:aspect-auto">
            {image && image.trim() !== '' && image !== '""' && image !== 'null' && image !== 'undefined' ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                key={image} // Force re-render when image changes
                onError={(e) => {
                  console.error('❌ Erro ao carregar imagem:', image);
                  (e.target as HTMLImageElement).src = '/placeholder.svg'; // Fallback para placeholder
                }}
                onLoad={() => {
                  console.log('✅ Imagem carregada com sucesso:', image);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">👩‍⚕️</span>
                  </div>
                  <p className="text-muted-foreground font-medium">Foto em breve</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="text-3xl font-bold mb-2">{name}</h3>
              <p className="text-primary text-lg font-semibold mb-4">{title}</p>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-4">
              {experience && (
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-medium">Experiência: {experience}</span>
                </div>
              )}
              
              {education && (
                <div className="flex items-center space-x-3">
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    Formação: {Array.isArray(education) 
                      ? education.join(', ') 
                      : education}
                  </span>
                </div>
              )}
              
              {specialties && specialties.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <span className="font-medium block mb-1">Especialidades:</span>
                    <div className="flex flex-wrap gap-2">
                      {specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {linkedin && (
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <a 
                    href={linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VeterinarianCard;