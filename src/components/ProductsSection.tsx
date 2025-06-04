
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pill, Heart, Utensils, Gamepad2 } from 'lucide-react';

const ProductsSection = () => {
  const categories = [
    {
      icon: Pill,
      title: "Medicamentos",
      description: "Medicamentos veterinários de qualidade para tratamento e prevenção.",
      products: ["Antibióticos", "Anti-inflamatórios", "Vermífugos", "Antipulgas", "Colírios"]
    },
    {
      icon: Heart,
      title: "Suplementos",
      description: "Suplementos nutricionais para manter a saúde em dia.",
      products: ["Vitaminas", "Condrotetina", "Ômega 3", "Probióticos", "Suplementos articulares"]
    },
    {
      icon: Utensils,
      title: "Rações",
      description: "Rações premium e terapêuticas para todas as idades e necessidades.",
      products: ["Ração filhote", "Ração adulto", "Ração sênior", "Ração terapêutica", "Petiscos"]
    },
    {
      icon: Gamepad2,
      title: "Brinquedos",
      description: "Brinquedos seguros e divertidos para entreter e estimular seus pets.",
      products: ["Brinquedos educativos", "Cordas", "Bolinhas", "Arranhadores", "Interativos"]
    }
  ];

  const featuredProducts = [
    {
      name: "Ração Premium Filhote",
      price: "R$ 89,90",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300&q=80",
      description: "Ração super premium para filhotes"
    },
    {
      name: "Suplemento Articular",
      price: "R$ 45,90",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80",
      description: "Para saúde das articulações"
    },
    {
      name: "Brinquedo Interativo",
      price: "R$ 29,90",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&q=80",
      description: "Estimula a inteligência do pet"
    }
  ];

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Produtos para Pets</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Oferecemos uma linha completa de produtos para manter seu pet saudável e feliz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <category.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-center">{category.description}</p>
                <ul className="space-y-2">
                  {category.products.map((product, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {product}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Produtos em Destaque</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{product.price}</span>
                    <Button size="sm">Comprar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Precisando de algo específico?</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Entre em contato conosco! Podemos encomendar produtos específicos para as necessidades do seu pet.
          </p>
          <Button size="lg">
            Falar com Nossa Equipe
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
