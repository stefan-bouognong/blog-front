// Configuration Cloudinary pour l'upload d'images
// Support pour VITE_CLOUDINARY_CLOUD_NAME (standard) ou VITE_CLOUDINARY_URL (si URL complète fournie)

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL || '';

// Si VITE_CLOUDINARY_URL est fourni, extraire le cloud_name de l'URL
const getCloudName = (): string => {
  if (CLOUDINARY_CLOUD_NAME) {
    return CLOUDINARY_CLOUD_NAME;
  }
  if (CLOUDINARY_URL) {
    // Extraire le cloud_name d'une URL Cloudinary (ex: https://res.cloudinary.com/cloud_name/image/upload/...)
    const match = CLOUDINARY_URL.match(/res\.cloudinary\.com\/([^/]+)/);
    if (match) {
      return match[1];
    }
    // Si c'est juste le cloud_name dans l'URL
    return CLOUDINARY_URL;
  }
  return '';
};

const CLOUD_NAME = getCloudName();

/**
 * Upload une image vers Cloudinary
 * @param file - Le fichier image à uploader
 * @returns L'URL de l'image uploadée
 */
export async function uploadImage(file: File): Promise<string> {
  if (!CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error(
      'Configuration Cloudinary manquante. Veuillez définir VITE_CLOUDINARY_CLOUD_NAME (ou VITE_CLOUDINARY_URL) et VITE_CLOUDINARY_UPLOAD_PRESET dans votre fichier .env'
    );
  }

  // Vérifier la taille du fichier (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Le fichier est trop volumineux. Taille maximale : 10MB');
  }

  // Vérifier le type de fichier
  if (!file.type.startsWith('image/')) {
    throw new Error('Le fichier doit être une image');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur lors de l\'upload' }));
      throw new Error(error.message || 'Erreur lors de l\'upload de l\'image');
    }

    const data = await response.json();
    return data.secure_url || data.url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erreur inconnue lors de l\'upload de l\'image');
  }
}

/**
 * Vérifie si Cloudinary est configuré
 */
export function isCloudinaryConfigured(): boolean {
  return !!(CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);
}

