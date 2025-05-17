import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import styles from '../styles/Character.module.css';

gsap.registerPlugin(ScrollTrigger);

interface CharacterProps {
  isReady: boolean;
}

const Character: React.FC<CharacterProps> = ({ isReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    if (!isReady || !containerRef.current) return;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });
    
    tl.from(titleRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .from(descriptionRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6');
    
    return () => {
      tl.kill();
    };
  }, [isReady]);
  
  return (
    <div 
      id="character" 
      ref={containerRef} 
      className={`${styles.characterSection} ${isReady ? styles.visible : ''}`}
    >
      <div className={styles.content}>
        <h2 ref={titleRef} className={styles.title}>Character1</h2>
        <p ref={descriptionRef} className={styles.description}>
          He likes to paint, plays cricket, good at technology. He is the no. 2 senior here. 
          He is the angry young man here. But he is also loving and caring.
        </p>
      </div>
    </div>
  );
};

export default Character;
