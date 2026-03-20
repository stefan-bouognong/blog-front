import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Article } from "@/types/blog";

interface BlogCardProps {
  article: Article;
  index?: number;
}

export function BlogCard({ article, index = 0 }: BlogCardProps) {
  if (!article) return null; // 🔥 protection 1

  const contenu = article.contenu || ""; // 🔥 protection 2

  const excerpt =
    contenu.length > 150
      ? contenu.substring(0, 150) + "..."
      : contenu;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="blog-card group"
    >
      <Link to={`/blog/${article.id}`} className="block">
        {article.image_url && (
          <div className="relative overflow-hidden aspect-[16/10]">
            <img
              src={article.image_url}
              alt={article.titre || ""}
              className="w-full h-full object-cover image-zoom"
            />
          </div>
        )}

        <div className="p-6">
          <h2 className="blog-title text-xl mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {article.titre}
          </h2>

          <p className="blog-excerpt text-sm line-clamp-3 mb-4 text-muted-foreground">
            {excerpt}
          </p>

          <div className="flex items-center gap-3">
            <p className="blog-meta text-xs text-muted-foreground">
              {article.created_at &&
                format(new Date(article.created_at), "d MMM yyyy")}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
