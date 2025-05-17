// src/components/VideoScroll.tsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '../styles/VideoScroll.module.css';
import { useImagePreloader } from '../hooks/useImagePreloader';

gsap.registerPlugin(ScrollTrigger);

interface VideoScrollProps {
  onComplete: () => void;
}

const VideoScroll: React.FC<VideoScrollProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Create array of all frame paths
  const frameCount = 47;
  const framePaths = Array.from({ length: frameCount }, (_, i) => `/Video1/Frame${i + 1}.jpeg`);
  
  const { imagesPreloaded } = useImagePreloader(framePaths);
  
  useEffect(() => {
    if (!imagesPreloaded) return;
    
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    if (!canvas || !context || !containerRef.current) return;
    
    setIsLoaded(true);
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const frameImages: HTMLImageElement[] = [];
    let loadedImages = 0;
    
    // Load all images
    framePaths.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        loadedImages++;
        if (loadedImages === frameCount) {
          initScrollAnimation();
        }
      };
      img.src = src;
      frameImages[index] = img;
    });
    
    const initScrollAnimation = () => {
      // Draw the first frame
      if (frameImages[0]) {
        drawImageWithCover(frameImages[0], context, canvas.width, canvas.height);
      }
      
      // Create scroll animation
      const scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(self.progress * frameCount)
          );
          
          if (frameImages[frameIndex]) {
            drawImageWithCover(frameImages[frameIndex], context, canvas.width, canvas.height);
          }
          
          // Darken the canvas as we approach the end
          const darkProgress = Math.max(0, (self.progress - 0.7) / 0.3);
          if (darkProgress > 0) {
            context.fillStyle = `rgba(0, 0, 0, ${darkProgress * 0.7})`;
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
          
          // Signal completion to parent when reaching the end
          if (self.progress > 0.95) {
            onComplete();
          }
        }
      });
      
      const handleResize = () => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          
          // Redraw the current frame
          const frameIndex = Math.min(
            frameCount - 1,
            Math.floor((scrollTrigger.progress || 0) * frameCount)
          );
          
          if (frameImages[frameIndex]) {
            drawImageWithCover(frameImages[frameIndex], context, canvas.width, canvas.height);
          }
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        scrollTrigger.kill();
        window.removeEventListener('resize', handleResize);
      };
    };
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [imagesPreloaded, framePaths, onComplete]);
  
  // Function to draw image with cover positioning (like background-size: cover)
  const drawImageWithCover = (
    img: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, x, y;
    
    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      x = 0;
      y = (canvasHeight - drawHeight) / 2;
    } else {
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imgRatio;
      x = (canvasWidth - drawWidth) / 2;
      y = 0;
    }
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };
  
  return (
    <div ref={containerRef} className={styles.videoScrollContainer}>
      {!isLoaded && (
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          <p>Loading frames...</p>
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className={styles.videoCanvas}
      />
    </div>
  );
};

export default VideoScroll;
