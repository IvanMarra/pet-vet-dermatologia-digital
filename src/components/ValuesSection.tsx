import React from 'react';
import { Heart, Award, Shield, Sparkles } from 'lucide-react';

const ValuesSection = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compaixão',
      description: 'Tratamos cada pet com amor e dedicação, como se fosse nosso próprio.',
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-500/10 to-rose-500/10'
    },
    {
      icon: Award,
      title: 'Excelência',
      description: 'Compromisso com os mais altos padrões de qualidade no atendimento veterinário.',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10'
    },
    {
      icon: Shield,
      title: 'Qualidade',
      description: 'Equipamentos modernos e técnicas atualizadas para o melhor diagnóstico e tratamento.',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10'
    },
    {
      icon: Sparkles,
      title: 'Compromisso',
      description: 'Dedicação total à saúde e bem-estar dos nossos pacientes e tranquilidade dos tutores.',
      gradient: 'from-purple-500 to-violet-500',
      bgGradient: 'from-purple-500/10 to-violet-500/10'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Nossos Valores</h2>
          <p className="text-muted-foreground text-lg">Os pilares que guiam nosso trabalho</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative bg-card border border-border rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.gradient} p-3 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {value.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>

                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.gradient} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
