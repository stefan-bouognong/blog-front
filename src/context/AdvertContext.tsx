import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AdvertImage {
  imageUrl: string;
  link: string;
  alt: string;
}

interface AdvertContextType {
  advertImage: AdvertImage | null;
  updateAdvertImage: (advert: AdvertImage) => void;
}

const AdvertContext = createContext<AdvertContextType | undefined>(undefined);

const defaultAdvert: AdvertImage = {
  imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
  link: 'https://example.com',
  alt: 'Advertisement',
};

export function AdvertProvider({ children }: { children: ReactNode }) {
  const [advertImage, setAdvertImage] = useState<AdvertImage | null>(() => {
    const stored = localStorage.getItem('advert-image');
    return stored ? JSON.parse(stored) : defaultAdvert;
  });

  useEffect(() => {
    if (advertImage) {
      localStorage.setItem('advert-image', JSON.stringify(advertImage));
    }
  }, [advertImage]);

  const updateAdvertImage = (advert: AdvertImage) => {
    setAdvertImage(advert);
  };

  return (
    <AdvertContext.Provider value={{ advertImage, updateAdvertImage }}>
      {children}
    </AdvertContext.Provider>
  );
}

export function useAdvert() {
  const context = useContext(AdvertContext);
  if (context === undefined) {
    throw new Error('useAdvert must be used within an AdvertProvider');
  }
  return context;
}
