'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const frameUrls = [
  '/Video1/Frame00.png', '/Video1/Frame01.png', '/Video1/Frame02.png', '/Video1/Frame03.png',
  '/Video1/Frame04.png', '/Video1/Frame05.png', '/Video1/Frame06.png', '/Video1/Frame07.png',
  '/Video1/Frame08.png', '/Video1/Frame09.png', '/Video1/Frame10.png', '/Video1/Frame11.png',
  '/Video1/Frame12.png', '/Video1/Frame13.png', '/Video1/Frame14.png', '/Video1/Frame15.png',
  '/Video1/Frame16.png', '/Video1/Frame17.png', '/Video1/Frame18.png', '/Video1/Frame19.png',
  '/Video1/Frame20.png',
];

const VideoScroller = ({ preloadComplete }: { preloadComplete: boolean }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const imageSources = useRef<HTMLImageElement[]>([]);
  const frameIndex = useRef(0);

  const textContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const renderFrame = (index: number) => {
    if (!contextRef.current || imageSources.current.length === 0 || !canvasRef.current || !containerRef.current) return;

    const img = imageSources.current[Math.min(index, imageSources.current.length - 1)];
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    const container = containerRef.current.getBoundingClientRect();

    const imgRatio = img.width / img.height;
    const containerRatio = container.width / container.height;

    let renderWidth, renderHeight, x, y;

    if (imgRatio > containerRatio) {
      renderHeight = container.height;
      renderWidth = container.height * imgRatio;
      x = (container.width - renderWidth) / 2;
      y = 0;
    } else {
      renderWidth = container.width;
      renderHeight = container.width / imgRatio;
      x = 0;
      y = (container.height - renderHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, x, y, renderWidth, renderHeight);
  };

  useEffect(() => {
    if (!preloadComplete || !canvasRef.current || !containerRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    contextRef.current = context;

    const loadImage = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    const loadAllImages = async () => {
      imageSources.current = await Promise.all(frameUrls.map(loadImage));
      if (imageSources.current[0] && canvasRef.current) {
        canvasRef.current.width = imageSources.current[0].width;
        canvasRef.current.height = imageSources.current[0].height;
        renderFrame(0);
      }
    };

    loadAllImages();

    const ctx = gsap.context(() => {
      if (!containerRef.current || imageSources.current.length === 0) return;

      const scrollAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const currentFrame = Math.min(Math.floor(progress * imageSources.current.length), imageSources.current.length - 1);

            if (currentFrame !== frameIndex.current) {
              frameIndex.current = currentFrame;
              requestAnimationFrame(() => renderFrame(currentFrame));
            }

            const darkenStart = 0.7;
            if (progress > darkenStart) {
              const darkenProgress = (progress - darkenStart) / (1 - darkenStart);
              gsap.to(overlayRef.current, { opacity: darkenProgress * 0.8, duration: 0.1 });
            } else {
              gsap.to(overlayRef.current, { opacity: 0, duration: 0.1 });
            }
          },
          onEnter: () => {
            requestAnimationFrame(() => renderFrame(0));
            gsap.set(textContainerRef.current, { opacity: 0, y: 20 });
          },
          onEnterBack: () => {
            requestAnimationFrame(() => renderFrame(0));
            gsap.set(textContainerRef.current, { opacity: 0, y: 20 });
          },
        },
      });

      gsap.to(textContainerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'bottom bottom-=200px',
          end: 'bottom bottom-=100px',
          scrub: 1,
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    const handleResize = () => {
      if (canvasRef.current && imageSources.current[0] && containerRef.current) {
        renderFrame(frameIndex.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [preloadComplete]);

  useEffect(() => {
    if (!preloadComplete || !canvasRef.current || !containerRef.current) return;

    const updateCanvasSize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = container.width;
      canvasRef.current.height = container.height;
      requestAnimationFrame(() => renderFrame(frameIndex.current));
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [preloadComplete]);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div ref={overlayRef} className="absolute top-0 left-0 w-full h-full bg-black opacity-0 pointer-events-none transition-opacity duration-300" />
      <div ref={textContainerRef} className="absolute bottom-10 left-10 text-white opacity-0 transform translate-y-4 transition-all duration-500">
        <h1 className="text-4xl font-bold">Scroll to Reveal</h1>
        <p className="text-lg mt-2">This is a frame-by-frame scroll animation using canvas and GSAP.</p>
      </div>
    </div>
  );
};

export default VideoScroller;
