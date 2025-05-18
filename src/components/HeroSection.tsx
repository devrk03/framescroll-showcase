'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import ScrollIndicator from './ScrollIndicator';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.8 }
      );
       gsap.fromTo(textRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 1 }
      );

       // Simple parallax for background
       gsap.to(bgRef.current, {
          y: '20%', // Adjust parallax strength
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

    }, sectionRef); // <-- scope animations to the section

     return () => ctx.revert(); // Clean up animations on unmount

  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative flex items-center justify-start h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/photos/background1.png"
          alt="Hero Background"
          fill
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
          priority
        />
         {/* Optional overlay for better text readability */}
         <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>


      <div className="relative z-10 px-8 md:px-16 lg:px-24 text-white w-full md:w-1/2 lg:w-1/3">
        <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold font-sans leading-tight">
          My test website
        </h1>
        <p ref={textRef} className="mt-4 text-lg md:text-xl font-crimson leading-relaxed">
          I will show some of my website building skills here.
        </p>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;
