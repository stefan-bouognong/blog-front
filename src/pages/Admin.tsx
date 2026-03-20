import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Save, Eye, Loader2, List } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { useBlog } from '@/context/BlogContext';
import { Article, CreateArticleData, UpdateArticleData, Category } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

const emptyArticle: CreateArticleData = {
  titre: '',
  contenu: '',
  image_url: null,
  categorie: 0, // sera initialisé avec la première catégorie disponible
};

const Admin = () => {
  const { articles, categories, loading, addArticle, updateArticle, deleteArticle, addCategory, updateCategory, deleteCategory } = useBlog();
  const { toast } = useToast();

  // ── Article edition ────────────────────────────────────────────────────────
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<CreateArticleData | (UpdateArticleData & { id?: number })>(emptyArticle);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);

  // ── Category management ────────────────────────────────────────────────────
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catNom, setCatNom] = useState('');
  const [catLabel, setCatLabel] = useState('');
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  // ── Delete article confirmation ────────────────────────────────────────────
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);

  // Initialiser la catégorie par défaut quand les catégories sont chargées
  useEffect(() => {
    if (categories.length > 0 && editingArticle.categorie === 0) {
      setEditingArticle(prev => ({ ...prev, categorie: categories[0].id }));
    }
  }, [categories]);

  const handleOpenCreateArticle = () => {
    setEditingArticle({ ...emptyArticle, categorie: categories[0]?.id || 0 });
    setImageFile(null);
    setImagePreview(null);
    setIsArticleDialogOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle({
      id: article.id,
      titre: article.titre,
      contenu: article.contenu,
      image_url: article.image_url,
      categorie: article.categorie,
    });
    setImageFile(null);
    setImagePreview(article.image_url || null);
    setIsArticleDialogOpen(true);
  };

  const handleDeleteArticle = (id: number) => {
    setArticleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      await deleteArticle(articleToDelete);
      toast({ title: 'Succès', description: 'Article supprimé' });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer l’article', variant: 'destructive' });
    } finally {
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleSaveArticle = async () => {
    if (!editingArticle.titre.trim() || !editingArticle.contenu.trim() || editingArticle.categorie === 0) {
      toast({ title: 'Champs obligatoires', description: 'Titre, contenu et catégorie sont requis', variant: 'destructive' });
      return;
    }

    setIsSubmittingArticle(true);

    try {
      let imageUrl = editingArticle.image_url || null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        titre: editingArticle.titre.trim(),
        contenu: editingArticle.contenu.trim(),
        image_url: imageUrl,
        categorie: editingArticle.categorie,
      };

      if ('id' in editingArticle && editingArticle.id) {
        await updateArticle(editingArticle.id, payload);
        toast({ title: 'Article modifié' });
      } else {
        await addArticle(payload);
        toast({ title: 'Article publié' });
      }

      setIsArticleDialogOpen(false);
      setEditingArticle(emptyArticle);
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      toast({ title: 'Erreur', description: err instanceof Error ? err.message : 'Échec sauvegarde', variant: 'destructive' });
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  // ── Gestion catégories ─────────────────────────────────────────────────────

  const handleSaveCategory = async () => {
    const nom = catNom.trim().toUpperCase();
    const label = catLabel.trim();

    if (!nom || !label) {
      toast({ title: 'Champs requis', description: 'Code et libellé obligatoires', variant: 'destructive' });
      return;
    }

    setIsSubmittingCategory(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { nom, label });
        toast({ title: 'Catégorie modifiée' });
      } else {
        await addCategory({ nom, label });
        toast({ title: 'Catégorie créée' });
      }

      setEditingCategory(null);
      setCatNom('');
      setCatLabel('');
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de sauvegarder la catégorie', variant: 'destructive' });
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Supprimer cette catégorie ?\n\nTous les articles associés seront PERDUS définitivement.')) return;

    try {
      await deleteCategory(id);
      toast({ title: 'Catégorie supprimée' });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer (articles liés ?)', variant: 'destructive' });
    }
  };

  // ── Upload Cloudinary (inchangé) ───────────────────────────────────────────
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!CLOUDINARY_URL || !UPLOAD_PRESET) {
      throw new Error('Configuration Cloudinary incomplète');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ||
      CLOUDINARY_URL.match(/res\.cloudinary\.com\/([^/]+)/)?.[1] ||
      CLOUDINARY_URL;

    if (cloudName) formData.append('cloud_name', cloudName);

    const res = await fetch(`${CLOUDINARY_URL}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Échec upload Cloudinary');

    const data = await res.json();
    return data.secure_url;
  };

  const sortedArticles = [...articles].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 md:px-6 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Administration</h1>
              <p className="text-muted-foreground mt-1">Articles & catégories</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setIsCategoriesDialogOpen(true)} className="gap-2">
                <List size={16} /> Catégories
              </Button>
              <Button onClick={handleOpenCreateArticle} className="gap-2">
                <Plus size={16} /> Nouvel article
              </Button>
            </div>
          </div>

          {/* Liste des articles */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 text-center text-muted-foreground">
                <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                Chargement...
              </div>
            ) : sortedArticles.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <p className="mb-4">Aucun article pour le moment</p>
                <Button onClick={handleOpenCreateArticle} variant="outline">
                  Créer le premier article
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Article</th>
                      <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedArticles.map((article, idx) => (
                      <motion.tr
                        key={article.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            {article.image_url && (
                              <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 hidden sm:block">
                                <img src={article.image_url} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium line-clamp-1">{article.titre}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {article.contenu.substring(0, 90)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
                          {format(new Date(article.created_at), 'dd MMM yyyy')}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link to={`/blog/${article.id}`} className="p-2 hover:text-primary transition-colors">
                              <Eye size={18} />
                            </Link>
                            <button onClick={() => handleEditArticle(article)} className="p-2 hover:text-primary transition-colors">
                              <Pencil size={18} />
                            </button>
                            <button onClick={() => handleDeleteArticle(article.id)} className="p-2 hover:text-destructive transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Dialog Article */}
      <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle.id ? 'Modifier l’article' : 'Nouvel article'}</DialogTitle>
            <DialogDescription>Remplissez les informations ci-dessous</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={editingArticle.titre}
                onChange={e => setEditingArticle({ ...editingArticle, titre: e.target.value })}
                placeholder="Titre de l'article"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <select
                id="categorie"
                value={editingArticle.categorie}
                onChange={e => setEditingArticle({ ...editingArticle, categorie: Number(e.target.value) })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value={0}>— Choisir une catégorie —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Aperçu" className="max-h-48 rounded-md object-cover border" />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contenu">Contenu *</Label>
              <Textarea
                id="contenu"
                value={editingArticle.contenu}
                onChange={e => setEditingArticle({ ...editingArticle, contenu: e.target.value })}
                placeholder="Écrivez ici... (Markdown supporté)"
                rows={14}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArticleDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveArticle} disabled={isSubmittingArticle}>
              {isSubmittingArticle && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingArticle.id ? 'Mettre à jour' : 'Publier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Gestion Catégories */}
      <Dialog open={isCategoriesDialogOpen} onOpenChange={setIsCategoriesDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gestion des catégories</DialogTitle>
            <DialogDescription>Ajouter, modifier ou supprimer (suppression = articles supprimés)</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Formulaire */}
            <div className="border rounded-lg p-5 bg-muted/30">
              <h3 className="font-medium mb-4">
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Code court (ex: BELGIQUE)</Label>
                  <Input
                    value={catNom}
                    onChange={e => setCatNom(e.target.value.toUpperCase())}
                    placeholder="BELGIQUE"
                  />
                </div>
                <div>
                  <Label>Libellé complet</Label>
                  <Input
                    value={catLabel}
                    onChange={e => setCatLabel(e.target.value)}
                    placeholder="Économie et Société – Belgique"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                {editingCategory && (
                  <Button variant="ghost" onClick={() => {
                    setEditingCategory(null);
                    setCatNom('');
                    setCatLabel('');
                  }}>
                    Annuler
                  </Button>
                )}
                <Button
                  onClick={handleSaveCategory}
                  disabled={isSubmittingCategory || !catNom.trim() || !catLabel.trim()}
                >
                  {isSubmittingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCategory ? 'Modifier' : 'Créer'}
                </Button>
              </div>
            </div>

            {/* Liste */}
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Aucune catégorie</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium">Code</th>
                      <th className="text-left p-3 font-medium">Libellé</th>
                      <th className="w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id} className="border-t hover:bg-muted/50">
                        <td className="p-3 font-medium">{cat.nom}</td>
                        <td className="p-3">{cat.label}</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditingCategory(cat);
                            setCatNom(cat.nom);
                            setCatLabel(cat.label);
                          }}>
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/90"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoriesDialogOpen(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation suppression article */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              L’article sera supprimé définitivement. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteArticle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Admin;