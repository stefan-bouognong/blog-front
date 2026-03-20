import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { User } from 'lucide-react';
import { useBlog } from '@/context/BlogContext';

interface LatestArticlesProps {
  excludeId?: number;
}

export function LatestArticles({ excludeId }: LatestArticlesProps) {
  const { getLatestArticles } = useBlog();
  const latestArticles = getLatestArticles(5, excludeId);

  return (
    <aside className="sticky top-24">
      <h3 className="text-lg font-semibold text-foreground mb-6">Articles Récents</h3>
      <div className="space-y-4">
        {latestArticles.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun autre article disponible.</p>
        ) : (
          latestArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <RouterLink
                to={`/blog/${article.id}`}
                className="group flex gap-4 p-3 rounded-lg hover:bg-accent transition-colors duration-200"
              >
                {article.image_url ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={article.image_url}
                      alt={article.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-muted/30 flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-1">
                    {article.titre}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(article.created_at), 'd MMM yyyy')}
                  </p>
                </div>
              </RouterLink>
            </motion.article>
          ))
        )}
      </div>
    </aside>
  );
}
