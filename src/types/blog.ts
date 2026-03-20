// Types correspondant exactement au backend Django
export interface Category {
  id: number;
  nom: string;   // ex: "BELGIQUE"
  label: string; 
}


export interface Article {
  id: number;
  titre: string;
  contenu: string;
  image_url: string | null;
  categorie: number;    
  categorie_detail?: Category;
  created_at: string;
  updated_at: string;
  admin: number | { id: number; username: string };
}
export interface Commentaire {
  id: number;
  nom: string;
  message: string;
  article: number; // ID de l'article
  created_at: string;
}

export interface CreateArticleData {
  titre: string;
  contenu: string;
  image_url: string | null;
  categorie: number;           // ← ID obligatoire maintenant
}

export interface UpdateArticleData {
  titre: string;
  contenu: string;
  image_url: string | null;
  categorie: number;
}

export interface CreateCommentaireData {
  nom: string;
  message: string;
  article: number;
}
