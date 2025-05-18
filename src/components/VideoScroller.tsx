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

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preloadComplete || !canvasRef.current || !containerRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    contextRef.current = context;

    // --- Load Images onto a Canvas ---
    // Using canvas for frame-by-frame drawing can be smoother than swapping img src
    // or managing many positioned img elements, especially preventing flashing.
    // It relies on images being fully loaded (handled by preloadComplete prop).

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
      // Set initial canvas size based on the first frame, adjust if needed
      if (imageSources.current[0]) {
         canvasRef.current!.width = imageSources.current[0].width;
         canvasRef.current!.height = imageSources.current[0].height;
         // Draw the first frame immediately
         renderFrame(0);
      }
    };

    loadAllImages();

    const renderFrame = (index: number | null) => {
      if (!contextRef.current || imageSources.current.length === 0) return;

      const frameToDraw = index !== null ? Math.min(index, imageSources.current.length - 1) : frameIndex.current;
      const img = imageSources.current[frameToDraw];

      if (img && canvasRef.current) {
         // Fill canvas to cover container - calculate necessary scaling/cropping
         const container = containerRef.current.getBoundingClientRect();
         const canvas = canvasRef.current;

         const imgRatio = img.width / img.height;
         const containerRatio = container.width / container.height;

         let renderWidth, renderHeight, x, y;

         if (imgRatio > containerRatio) {
             // Image is wider than container aspect ratio, scale to container height and crop width
             renderHeight = container.height;
             renderWidth = container.height * imgRatio;
             x = (container.width - renderWidth) / 2; // Center horizontally
             y = 0;
         } else {
             // Image is taller than container aspect ratio, scale to container width and crop height
             renderWidth = container.width;
             renderHeight = container.width / imgRatio;
             x = 0;
             y = (container.height - renderHeight) / 2; // Center vertically
         }

        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        // Draw image covering the whole container
         contextRef.current.drawImage(img, 0, 0, img.width, img.height, x, y, renderWidth, renderHeight);

         // Optional: Add a darkening overlay directly on canvas if needed,
         // but using a separate animated div is simpler with GSAP/Tailwind.
      }
    };

     // --- GSAP ScrollTrigger Animation ---
    const ctx = gsap.context(() => {
       if (!containerRef.current || imageSources.current.length === 0) return;

      const scrollAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top', // Ends when the bottom of the container hits the top of the viewport
          scrub: true, // Link scroll position to animation progress
          onUpdate: (self) => {
            // Map scroll progress (0 to 1) to frame index (0 to last frame)
            const progress = self.progress;
            const currentFrame = Math.min(Math.floor(progress * imageSources.current.length), imageSources.current.length - 1);

            if (currentFrame !== frameIndex.current) {
              frameIndex.current = currentFrame;
              requestAnimationFrame(() => renderFrame(currentFrame)); // Use requestAnimationFrame for smoother drawing
            }

            // Darkening effect based on scroll progress towards the end
            // Start darkening when progress is e.g., 70%
            const darkenStart = 0.7;
            if (progress > darkenStart) {
              const darkenProgress = (progress - darkenStart) / (1 - darkenStart); // Normalize progress from 0 to 1 for darkening phase
              gsap.to(overlayRef.current, { opacity: darkenProgress * 0.8, duration: 0.1 }); // Max opacity 0.8 for darkening
            } else {
               gsap.to(overlayRef.current, { opacity: 0, duration: 0.1 });
            }
          },
           onEnter: () => { // Ensure initial state is correct when entering
             requestAnimationFrame(() => renderFrame(0));
              gsap.set(textContainerRef.current, { opacity: 0, y: 20 }); // Initial state for text
           },
           onEnterBack: () => { // Ensure initial state is correct when scrolling back up
             requestAnimationFrame(() => renderFrame(0));
             gsap.set(textContainerRef.current, { opacity: 0, y: 20 });
           },
        },
      });

       // Text reveal animation triggered by scroll progression through the video section
       gsap.to( textContainerRef.current, {
           opacity: 1,
           y: 0,
           duration: 1,
           ease: 'power3.out',
           scrollTrigger: {
                trigger: containerRef.current,
                start: 'bottom bottom-=200px', // When bottom of container is 200px from bottom of viewport (adjust this)
                end: 'bottom bottom-=100px', // Finishes shortly after
                scrub: 1, // Smoothly animate with scroll
                toggleActions: 'play none none reverse' // Play on enter, reverse on leave back
           }
       });


    }, containerRef); // <-- scope animations to the container

    // Handle window resize: redraw initial frame and potentially resize canvas
    const handleResize = () => {
        if(canvasRef.current && imageSources.current[0]) {
             // Update canvas size to potentially better match new screen dimensions if needed
             // A simpler approach might be to rely on CSS/container size and recalculate drawImage parameters
             // For simplicity, primarily rely on recalculating drawImage params on canvas render
             renderFrame(frameIndex.current); // Redraw current frame to fit new container size
        }
    };
    window.addEventListener('resize', handleResize);


    return () => {
        ctx.revert(); // Clean up all GSAP animations within the context
        window.removeEventListener('resize', handleResize);
    };

  }, [preloadComplete]); // Rerun effect if preload state changes

   // Handle canvas aspect ratio / responsiveness via CSS
  useEffect(() => {
      if (canvasRef.current && containerRef.current) {
          const updateCanvasSize = () => {
              const container = containerRef.current!.getBoundingClientRect();
              // Size the canvas based on the container to simplify drawImage scaling
              // Or size it based on image aspect ratio and let CSS handle scaling (depends on desired effect)
              // Let's size it to match the container for simpler drawImage logic
              canvasRef.current!.width = container.width;
              canvasRef.current!.height = container.height;
              // Redraw the current frame after resize
              requestAnimationFrame(() => renderFrame(frameIndex.current));
          };
          updateCanvasSize(); // Initial size
          window.addEventListener('resize', updateCanvasSize);
          return () => window.removeEventListener('resize', updateCanvasSize);
      }

       // This needs to be robust - maybe better using a different approach if canvas scaling is complex
       // Or just set canvas width/height based on original image and use CSS object-fit: cover - but canvas doesn't have object-fit
       // Let's refine the renderFrame scaling logic instead.
  }, [preloadComplete]); // Dependency includes preloadComplete


  // Function to call inside renderFrame (defined within useEffect) needs to be accessible
  // Let's redefine renderFrame within the effect where context is available or pass necessary refs.

  // Simplified approach using standard img elements - less smooth, more prone to flash
  // Reverting to Canvas approach as it matches the Rockstar VI reference better for smoothness

  // The ref update pattern for canvas size needs careful handling.
  // Let's rely on the drawImage parameter calculation inside renderFrame to handle the fit,
  // setting canvas width/height might be simplified if container has fixed aspect ratio or handled purely by CSS container queries (not standard yet).
  // For now, let's try calculating drawImage parameters relative to the *canvas* size which is set to *container* size.


    const renderFrame = (index: number) => {
      if (!contextRef.current || imageSources.current.length === 0 || !canvasRef.current) return;

      const frameToDraw = Math.min(index, imageSources.current.length - 1);
      const img = imageSources.current[frameToDraw];

      if (img) {
         const canvas = canvasRef.current;
         const ctx = contextRef.current;

         const imgAspectRatio = img.width / img.height;
         const canvasAspectRatio = canvas.width / canvas.height;

         let drawWidth, drawHeight, offsetX, offsetY;

         if (imgAspectRatio > canvasAspectRatio) { // Image is wider
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgAspectRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
         } else { // Image is taller or same aspect ratio
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgAspectRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
         }

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };


   useEffect(() => {
     if (!preloadComplete || !canvasRef.current || !containerRef.current) return;

      const context = canvasRef.current.getContext('2d');
      if (!context) return;
      contextRef.current = context;

      const loadImagesAndSetup = async () => {
        imageSources.current = await Promise.all(frameUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            });
        }));

        if (imageSources.current[0] && canvasRef.current && containerRef.current) {
             // Set initial canvas size to match container
            const containerRect = containerRef.current.getBoundingClientRect();
            canvasRef.current.width = containerRect.width;
            canvasRef.current.height = containerRect.height;
             requestAnimationFrame(() => renderFrame(0)); // Draw first frame

            const ctx = gsap.context(() => {
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

                        // Darkening overlay animation
                         const darkenStart = 0.7;
                         if (progress > darkenStart) {
                            const darkenProgress = (progress - darkenStart) / (1 - darkenStart);
                            gsap.to(overlayRef.current, { opacity: darkenProgress * 0.8, duration: 0.1 });
                         } else {
                            gsap.to(overlayRef.current, { opacity: 0, duration: 0.1 });
                         }
                      },
                       onEnter: () => { // Ensure initial state is correct when entering
                         requestAnimationFrame(() => renderFrame(0));
                          gsap.set(textContainerRef.current, { opacity: 0, y: 20 }); // Initial state for text
                       },
                       onEnterBack: () => { // Ensure initial state is correct when scrolling back up
                         requestAnimationFrame(() => renderFrame(0));
                         gsap.set(textContainerRef.current, { opacity: 0, y: 20 });
                       },
                    },
                  });

                   // Text reveal animation
                   gsap.to( textContainerRef.current, {
                       opacity: 1,
                       y: 0,
                       duration: 1,
                       ease: 'power3.out',
                       scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'bottom bottom-=250px', // Adjust this to match desired reveal timing
                            end: 'bottom bottom-=50px',
                            scrub: 1,
                            toggleActions: 'play none none reverse'
                       }
                   });

            }, containerRef); // <-- scope animations

             // Window resize listener specifically for canvas size
            const handleResize = () => {
                 if(canvasRef.current && containerRef.current) {
                    const containerRect = containerRef.current.getBoundingClientRect();
                    canvasRef.current.width = containerRect.width;
                    canvasRef.current.height = containerRect.height;
                    requestAnimationFrame(() => renderFrame(frameIndex.current)); // Redraw current frame
                 }
            };
            window.addEventListener('resize', handleResize);


            return () => {
                ctx.revert(); // Clean up GSAP context
                window.removeEventListener('resize', handleResize);
            };
        }
      };

      loadImagesAndSetup();

   }, [preloadComplete]); // Effect dependencies


  return (
    // This container provides the scrollable height
    <section id="video-section" ref={containerRef} className="relative min-h-[300vh] w-full bg-black"> {/* min-h controls scroll duration */}
       {!preloadComplete && (
           <div className="absolute inset-0 flex items-center justify-center z-10 bg-black text-white font-sans">
               Loading video frames...
           </div>
       )}
      {/* Canvas for drawing frames */}
      <canvas ref={canvasRef} className={`sticky top-0 left-0 w-full h-screen object-cover ${preloadComplete ? 'visible' : 'invisible'}`}></canvas>

      {/* Overlay for darkening effect */}
      <div ref={overlayRef} className="absolute inset-0 bg-black pointer-events-none z-10 opacity-0"></div>

       {/* Text content over the video */}
      <div ref={textContainerRef} className="absolute inset-0 flex items-center justify-center z-20 text-white opacity-0">
          <div className="w-full max-w-md text-center px-4">
              <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold font-sans leading-tight">
                   Character1
              </h2>
              <p ref={descriptionRef} className="mt-4 text-lg md:text-xl font-crimson leading-relaxed">
                   He likes to paint, plays cricket, good at technology. He is the no. 2 senior here. He is the angry young man here. But he is also loving and caring.
              </p>
          </div>
      </div>

    </section>
  );
};

export default VideoScroller;
