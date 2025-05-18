"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageModalContextType {
  isOpen: boolean;
  imageUrl: string | null;
  openModal: (url: string) => void;
  closeModal: () => void;
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined);

export const ImageModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const openModal = (url: string) => {
    setImageUrl(url);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setImageUrl(null);
  };

  return (
    <ImageModalContext.Provider value={{ isOpen, imageUrl, openModal, closeModal }}>
      {children}
    </ImageModalContext.Provider>
  );
};

export const useImageModal = () => {
  const context = useContext(ImageModalContext);
  if (context === undefined) {
    throw new Error('useImageModal must be used within an ImageModalProvider');
  }
  return context;
};
