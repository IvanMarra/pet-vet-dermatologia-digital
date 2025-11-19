
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      petName: "Buddy",
      rating: 5,
      text: "A Dra. Karine salvou meu Buddy de uma dermatite grave. Profissional excepcional, muito carinhosa e competente. Recomendo de olhos fechados!",
      location: "Centro"
    },
    {
      name: "João Santos",
      petName: "Luna",
      rating: 5,
      text: "Excelente clínica! Equipamentos modernos, atendimento humanizado e preços justos. A Luna sempre fica tranquila durante as consultas.",
      location: "Jardim das Flores"
    },
    {
      name: "Ana Costa",
      petName: "Max",
      rating: 5,
      text: "Melhor veterinária da região! A Dra. Karine é muito atenciosa e explica tudo detalhadamente. O Max ficou curado rapidamente.",
      location: "Vila Nova"
    },
    {
      name: "Carlos Oliveira",
      petName: "Mimi",
      rating: 5,
      text: "Profissionais dedicados e muito cuidadosos. A cirurgia da Mimi foi um sucesso total. Gratidão eterna à equipe da VetCare!",
      location: "Centro"
    },
    {
      name: "Fernanda Lima",
      petName: "Thor",
      rating: 5,
      text: "Atendimento 24h salvou meu Thor numa emergência. Equipe preparada e muito humana. Indico para todos os tutores de pets!",
      location: "Bairro Alto"
    },
    {
      name: "Roberto Mendes",
      petName: "Princesa",
      rating: 5,
      text: "Tratamento de dermatologia da Princesa foi excepcional. A Dra. Karine é realmente especialista no que faz. Muito obrigado!",
      location: "Jardim Primavera"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Depoimentos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja o que nossos clientes dizem sobre nossos serviços
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Tutor(a) do {testimonial.petName} • {testimonial.location}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Sua Opinião é Importante!</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Atendemos seu pet? Conte para outros tutores sobre sua experiência conosco.
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            {renderStars(5)}
            <span className="text-lg font-semibold ml-2">5/5</span>
            <span className="text-muted-foreground">(250+ avaliações)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
