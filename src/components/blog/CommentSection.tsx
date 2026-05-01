import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { MessageCircle, User, Send, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Commentaire } from '@/types/blog';
import * as api from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@radix-ui/react-label';

interface CommentSectionProps {
  articleId: number;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Commentaire[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Charger les commentaires
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getComments(articleId);
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur chargement commentaires');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [articleId]);

  // Détection simple de lien
  const containsLink = (text: string): boolean => {
    const linkRegex = /(https?:\/\/|www\.)[^\s<>{}()[\]]+/gi;
    return linkRegex.test(text);
  };

  // Ajout commentaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    if (containsLink(trimmedMessage)) {
      setError('Les liens ne sont pas autorisés dans les commentaires.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newComment = await api.createComment({
        nom: name.trim() || 'Anonymous',
        message: trimmedMessage,
        article: articleId,
      });

      setComments(prev => [newComment, ...prev]);
      setName('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ❌ Suppression commentaire
  const handleDeleteComment = async (commentId: number) => {
    const confirmDelete = window.confirm('Voulez-vous vraiment supprimer ce commentaire ?');
    if (!confirmDelete) return;

    try {
      setDeletingId(commentId);

      await api.deleteComment(commentId); // 👈 API suppression par ID

      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur suppression commentaire');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        Commentaires ({comments.length})
      </h2>

      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-5">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          <Label htmlFor="name">Votre nom (optionnel)</Label>
          <Input
            id="name"
            placeholder="Anonymous"
            value={name}
            onChange={e => setName(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Votre commentaire *</Label>
          <Textarea
            id="message"
            placeholder="Partagez vos réflexions... (pas de liens autorisés)"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            className="min-h-[120px] resize-y"
          />
        </div>

        <Button type="submit" disabled={isSubmitting || !message.trim()} className="gap-2">
          <Send className="h-4 w-4" />
          {isSubmitting ? 'Envoi en cours...' : 'Publier'}
        </Button>
      </form>

      {/* LISTE COMMENTAIRES */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Chargement des commentaires...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Soyez le premier à commenter !
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-secondary/40 rounded-xl p-5 border border-border/50"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1">
                  {/* header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-medium">{comment.nom || 'Anonymous'}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), 'dd MMM yyyy · HH:mm')}
                      </span>
                    </div>

                    {/* delete */}
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deletingId === comment.id}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* message */}
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
                    {comment.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}