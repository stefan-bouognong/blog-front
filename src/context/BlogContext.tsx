import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Article, Category, CreateArticleData, UpdateArticleData } from '@/types/blog';
import * as api from '@/lib/api';

interface BlogContextType {
  articles: Article[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  token: string | null;
  setToken: (token: string | null) => void;
  
  // Articles
  addArticle: (data: CreateArticleData) => Promise<void>;
  updateArticle: (id: number, data: UpdateArticleData) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
  getArticle: (id: number) => Article | undefined;
  refreshArticles: () => Promise<void>;
  getLatestArticles: (count: number, excludeId?: number) => Article[];

  // Catégories
  addCategory: (data: { nom: string; label: string }) => Promise<void>;
  updateCategory: (id: number, data: { nom: string; label: string }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children, token: initialToken }: { children: ReactNode; token?: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(initialToken || null);

  // Chargement initial des données
  const loadData = async () => {
    try {
      setLoading(true);
      const [arts, cats] = await Promise.all([
        api.getArticles(),
        api.getCategories(),
      ]);
      setArticles(arts);
      setCategories(cats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Articles ────────────────────────────────────────────────────────────────

  const addArticle = async (data: CreateArticleData) => {
    if (!token) throw new Error('Non authentifié');
    const newArticle = await api.createArticle(data, token);
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = async (id: number, data: UpdateArticleData) => {
    if (!token) throw new Error('Non authentifié');
    const updated = await api.updateArticle(id, data, token);
    setArticles(prev => prev.map(a => (a.id === id ? updated : a)));
  };

  const deleteArticle = async (id: number) => {
    if (!token) throw new Error('Non authentifié');
    await api.deleteArticle(id, token);
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const getArticle = (id: number) => articles.find(a => a.id === id);

  const refreshArticles = async () => {
    try {
      const fresh = await api.getArticles();
      setArticles(fresh);
    } catch (err) {
      console.error('Refresh articles failed:', err);
    }
  };

  const getLatestArticles = (count: number, excludeId?: number) => {
    let filtered = articles;
    if (excludeId) filtered = filtered.filter(a => a.id !== excludeId);
    return filtered
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, count);
  };

  // ── Catégories ──────────────────────────────────────────────────────────────

  const addCategory = async (data: { nom: string; label: string }) => {
    if (!token) throw new Error('Non authentifié');
    const newCat = await api.createCategory(data, token);
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = async (id: number, data: { nom: string; label: string }) => {
    if (!token) throw new Error('Non authentifié');
    const updated = await api.updateCategory(id, data, token);
    setCategories(prev => prev.map(c => (c.id === id ? updated : c)));
  };

  const deleteCategory = async (id: number) => {
    if (!token) throw new Error('Non authentifié');
    await api.deleteCategory(id, token);
    setCategories(prev => prev.filter(c => c.id !== id));
    // Cascade : recharger les articles car ils ont pu être supprimés
    await refreshArticles();
  };

  const refreshCategories = async () => {
    try {
      const fresh = await api.getCategories();
      setCategories(fresh);
    } catch (err) {
      console.error('Refresh categories failed:', err);
    }
  };

  return (
    <BlogContext.Provider
      value={{
        articles,
        categories,
        loading,
        error,
        token,
        setToken,

        addArticle,
        updateArticle,
        deleteArticle,
        getArticle,
        refreshArticles,
        getLatestArticles,

        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog doit être utilisé à l’intérieur de BlogProvider');
  }
  return context;
}