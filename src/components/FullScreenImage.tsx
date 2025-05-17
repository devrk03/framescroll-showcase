// src/components/FullScreenImage.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/FullScreenImage.module.css';
import { useImageContext } from '../contexts/ImageContext';

const FullScreenImage: React.FC = () => {
  const { selectedImage, setSelectedImage } = useImageContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (selectedImage && containerRef.current && imageRef.current) {
      // Animate opening
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
      
      // Add event listener to close on ESC key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedImage]);
  
  const handleClose = () => {
    if (containerRef.current && imageRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setSelectedImage(null)
      });
      
      tl.to(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in'
      }, '-=0.1');
    }
  };
  
  if (!selectedImage) return null;
  
  return (
    <div 
      ref={containerRef}
      className={styles.fullscreenContainer}
      onClick={handleClose}
    >
      <div 
        className={styles.imageWrapper}
        onClick={(e) => e.stopPropagation()} // Prevent clicks on image from closing
      >
        <img 
          ref={imageRef}
          src={selectedImage} 
          alt="Full screen view" 
          className={styles.fullscreenImage}
        />
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close full screen image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2"/>
            <path d="M8 8L16 16M8 16L16 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FullScreenImage;
