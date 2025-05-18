'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useImageModal } from '../context/ImageModalContext';

gsap.registerPlugin(ScrollTrigger);

const photoUrls = [
  '/photos/photo1.png',
  '/photos/photo2.png',
  '/photos/photo3.png',
  '/photos/photo4.png',
];

const Gallery = () => {
  const containerRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const { openModal } = useImageModal();

   // Function to add items to the ref array dynamically
  const addToItemsRef = (el: HTMLDivElement) => {
      if (el && !itemsRef.current.includes(el)) {
          itemsRef.current.push(el);
      }
  };


  useEffect(() => {
    const ctx = gsap.context(() => {
       if (!containerRef.current) return;

       // Animate gallery container entrance by slightly moving up and fading in
         gsap.fromTo(containerRef.current,
            { y: 100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: 'power3.out',
                 scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom-=100px', // Start animation when the top of the gallery enters 100px from bottom of viewport
                    end: 'top center',
                    scrub: 1, // Smoothly animate with scroll
                }
            }
        );

      // Animate individual items with a stagger effect
      gsap.fromTo(itemsRef.current,
          { opacity: 0, scale: 0.9 },
          {
              opacity: 1,
              scale: 1,
              duration: 1,
              stagger: 0.2, // Delay animation for each item
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom-=150px', // Start animation slightly earlier than container
                 end: 'top center+=100px',
                scrub: 1,
              }
          }
      );


        // Hover effect using GSAP
        itemsRef.current.forEach(item => {
            gsap.to(item, {
                scale: 1.05,
                duration: 0.3,
                paused: true,
                ease: "power1.inOut",
                overwrite: true // Ensure only one animation runs at a time
            });

             // Manually add event listeners or use a library that wraps them if needed
             // Tailwind hover classes are simpler for CSS-only effects like border/shadow
             // Keeping the hover effect as a simple CSS/Tailwind one is often better than GSAP for performance on many elements

        });


    }, containerRef); // <-- scope animations

    return () => ctx.revert(); // Clean up animations
  }, []);

  return (
    <section id="gallery" ref={containerRef} className="py-16 md:py-24 bg-gradient-to-b from-darkOverlay via-black to-black"> {/* Use gradient from the end of video section */}
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl md:text-5xl font-bold font-sans mb-12 text-white">Photo Gallery</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {photoUrls.map((url, index) => (
            <div
               key={index}
               ref={addToItemsRef} // Add element to ref array
               className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer"
               onClick={() => openModal(url)}
             >
               {/* Use a container for glow effect that doesn't affect the image itself */}
               <div className="absolute inset-0 z-10 pointer-events-none transition-all duration-300 group-hover:animate-glow-border group-hover:border-2 group-hover:border-white rounded-lg"></div>

               <Image
                  src={url}
                  alt={`Gallery Photo ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease-in-out' // Smooth hover transform
                  }}
                  className="group-hover:scale-105"
                 />
                 {/* Optional subtle overlay or text on hover */}
                 {/* <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-0"></div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
