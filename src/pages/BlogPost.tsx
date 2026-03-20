import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { LatestArticles } from '@/components/blog/LatestArticles';
import { CommentSection } from '@/components/blog/CommentSection';
import { ShareButton } from '@/components/blog/ShareButton';
import { useBlog } from '@/context/BlogContext';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticle, loading } = useBlog();
  
  const articleId = id ? parseInt(id, 10) : null;
  const article = articleId ? getArticle(articleId) : undefined;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <p className="text-muted-foreground">Chargement de l'article...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Article introuvable</h1>
          <p className="text-muted-foreground mb-8">
            L'article que vous recherchez n'existe pas.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </Layout>
    );
  }

  // Convertir le contenu en paragraphes HTML
  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((paragraph, index) => {
      // Gérer les headers
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-semibold text-foreground mt-10 mb-4">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-foreground mt-8 mb-3">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Gérer les listes
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-foreground">
            {items.map((item, i) => (
              <li key={i}>{item.replace('- ', '')}</li>
            ))}
          </ul>
        );
      }
      // Paragraphes réguliers avec gestion du texte en gras
      const formattedParagraph = paragraph.replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-foreground">$1</strong>'
      );
      return (
        <p
          key={index}
          className="text-lg leading-relaxed text-foreground/90 mb-6"
          dangerouslySetInnerHTML={{ __html: formattedParagraph }}
        />
      );
    });
  };

  return (
    <Layout>
      {/* Hero Image */}
      {article.image_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative h-[50vh] md:h-[60vh] overflow-hidden"
        >
          <img
            src={article.image_url}
            alt={article.titre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      )}

      <div className="container mx-auto px-6">
        <div className="lg:flex lg:gap-16 -mt-20 relative z-10">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 max-w-3xl"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {article.titre}
            </h1>

            <div className="flex items-center justify-between gap-4 mb-10 pb-8 border-b border-border">
              <div className="flex items-center gap-4">
                <p className="blog-meta text-muted-foreground">
                  {format(new Date(article.created_at), 'd MMMM yyyy')}
                </p>
              </div>
              <ShareButton title={article.titre} />
            </div>

            <div className="prose-content">
              {renderContent(article.contenu)}
            </div>

            {/* Comments Section */}
            <CommentSection articleId={article.id} />
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block w-80 pt-20"
          >
            <LatestArticles excludeId={article.id} />
          </motion.aside>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
