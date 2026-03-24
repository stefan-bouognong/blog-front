// src/lib/api.ts
import type { Article, Commentaire, CreateArticleData, UpdateArticleData, CreateCommentaireData, Category } from '@/types/blog';

const BASE_URL = 'https://blog-back-two.vercel.app/api';

interface ApiError {
  detail?: string;
  message?: string;
  [key: string]: any;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      detail: `HTTP error! status: ${res.status}`,
    }));
    throw new Error(error.detail || error.message || 'Une erreur est survenue');
  }
  return res.json();
}

// ==================== ARTICLES ====================

export async function getArticles(): Promise<Article[]> {
  const res = await fetch(`${BASE_URL}/articles/`);
  return handleResponse<Article[]>(res);
}

export async function getArticle(id: number): Promise<Article> {
  const res = await fetch(`${BASE_URL}/articles/${id}/`);
  return handleResponse<Article>(res);
}

export async function createArticle(data: CreateArticleData, token: string | null): Promise<Article> {
  const res = await fetch(`${BASE_URL}/articles/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Article>(res);
}

export async function updateArticle(id: number, data: UpdateArticleData, token: string | null): Promise<Article> {
  const res = await fetch(`${BASE_URL}/articles/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Article>(res);
}

export async function deleteArticle(id: number, token: string | null): Promise<void> {
  const res = await fetch(`${BASE_URL}/articles/${id}/`, {
    method: 'DELETE',
    headers: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      detail: `HTTP error! status: ${res.status}`,
    }));
    throw new Error(error.detail || error.message || 'Erreur lors de la suppression');
  }
}



// ==================== CATÉGORIES ====================

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories/`);
  return handleResponse<Category[]>(res);
}

export async function createCategory(data: { nom: string; label: string }, token: string): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(res);
}

export async function updateCategory(id: number, data: { nom: string; label: string }, token: string): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Category>(res);
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: `Erreur ${res.status}` }));
    throw new Error(error.detail || 'Erreur suppression catégorie');
  }
}

// ==================== COMMENTAIRES ====================

export async function getComments(articleId: number): Promise<Commentaire[]> {
  const res = await fetch(`${BASE_URL}/commentaires/?article=${articleId}`);
  return handleResponse<Commentaire[]>(res);
}

export async function createComment(data: CreateCommentaireData): Promise<Commentaire> {
  const res = await fetch(`${BASE_URL}/commentaires/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Commentaire>(res);
}

// ==================== AUTHENTIFICATION ====================

export async function loginAdmin(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api-token-auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });

  const data = await handleResponse<{ token: string }>(res);
  return data.token;
}
