import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { BlogCard } from '@/components/blog/BlogCard';
import founderImage from '@/images/eliade.jpeg';
import { useBlog } from '@/context/BlogContext';
import { cn } from '@/lib/utils';

const Index = () => {
  const { articles, categories } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  const filteredArticles = useMemo(() => {
    const sorted = [...articles].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  
    if (selectedCategory === 'all') return sorted;
  
    return sorted.filter(article => 
      article.categorie_detail?.id === selectedCategory
    );
  }, [articles, selectedCategory]);

  const randomHeroImage = useMemo(() => {
    if (articles.length === 0) return '';
    const idx = Math.floor(Math.random() * articles.length);
    return articles[idx].image_url || '';
  }, [articles]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          {randomHeroImage && (
            <img
              src={randomHeroImage}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <img
          src={founderImage}
          alt="Eliade Kibangoud Mboungou"
          className="w-48 h-48 md:w-60 md:h-60 rounded-full object-cover shadow-xl ring-4 ring-primary/20"
        />


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Forum de Pensée Critique
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Analyses économiques, sociales et financières pour la Belgique et la République du Congo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filtres catégories dynamiques */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              )}
            >
              Tous
            </button>

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille articles */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6">
          {filteredArticles.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Aucun article dans cette catégorie</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, i) => (
                <BlogCard key={article.id} article={article} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Index;