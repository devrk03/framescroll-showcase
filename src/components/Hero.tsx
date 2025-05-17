// src/components/Hero.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from '../styles/Hero.module.css';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    })
    .from(textRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.5')
    .from(scrollIndicatorRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.2');

    // Parallax effect on scroll
    gsap.to(heroRef.current, {
      backgroundPositionY: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div id="hero" ref={heroRef} className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 ref={titleRef} className={styles.title}>My test website</h1>
        <p ref={textRef} className={styles.subtitle}>
          I will show some of my website building skills here.
        </p>
      </div>
      <div ref={scrollIndicatorRef} className={styles.scrollIndicator}>
        <p>Scroll Down</p>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
