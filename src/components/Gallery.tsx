// src/components/Gallery.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '../styles/Gallery.module.css';
import { useImageContext } from '../contexts/ImageContext';
import { useImagePreloader } from '../hooks/useImagePreloader';

gsap.registerPlugin(ScrollTrigger);

const Gallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const { setSelectedImage } = useImageContext();
  
  const photoUrls = [
    '/photos/photo1.png',
    '/photos/photo2.png',
    '/photos/photo3.png',
    '/photos/photo4.png'
  ];
  
  const { imagesPreloaded } = useImagePreloader(photoUrls);
  
  useEffect(() => {
    if (!imagesPreloaded || !galleryRef.current) return;
    
    // Animate gallery in
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: galleryRef.current,
        start: 'top 80%',
        end: 'center center',
        toggleActions: 'play none none reverse'
      }
    });
    
    tl.from(galleryRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
    
    // Animate each image
    imagesRef.current.forEach((image, index) => {
      gsap.from(image, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.2 * index,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: image,
          start: 'top 90%',
          end: 'center 70%',
          toggleActions: 'play none none reverse'
        }
      });
    });
    
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [imagesPreloaded]);
  
  const handleImageClick = (src: string) => {
    setSelectedImage(src);
  };
  
  return (
    <section id="gallery" className={styles.gallerySection}>
      <div ref={galleryRef} className={styles.galleryContainer}>
        <h2 className={styles.galleryTitle}>Photo Gallery</h2>
        <div className={styles.galleryGrid}>
          {photoUrls.map((src, index) => (
            <div
              key={index}
              ref={el => imagesRef.current[index] = el}
              className={styles.imageContainer}
              onClick={() => handleImageClick(src)}
            >
              <div className={styles.imageWrapper}>
                <img src={src} alt={`Gallery Image ${index + 1}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
