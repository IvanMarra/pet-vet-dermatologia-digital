import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image_url: string | null;
  published_at: string;
  reading_time: number;
}

const BlogSection = () => {
  // Placeholder posts - replace with actual blog_posts table data later
  const placeholderPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Cuidados Essenciais com seu Pet',
      description: 'Descubra as melhores práticas para manter seu pet saudável e feliz.',
      content: '',
      category: 'Saúde',
      image_url: null,
      published_at: new Date().toISOString(),
      reading_time: 5
    }
  ];

  const [posts, setPosts] = useState<BlogPost[]>(placeholderPosts);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Notícias e Artigos</h2>
            <p className="text-muted-foreground text-lg">Carregando...</p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Notícias e Artigos</h2>
            <p className="text-muted-foreground text-lg">Fique por dentro das novidades sobre saúde e cuidados com pets</p>
          </div>
          <div className="text-center text-muted-foreground">
            <p>Em breve, novos conteúdos sobre saúde e bem-estar dos seus pets!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Notícias e Artigos</h2>
          <p className="text-muted-foreground text-lg">Fique por dentro das novidades sobre saúde e cuidados com pets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {post.image_url && (
                <div className="overflow-hidden h-48">
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{post.reading_time} min</span>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.published_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">{post.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
