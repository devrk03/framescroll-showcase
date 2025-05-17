// src/components/Navigation.tsx
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import styles from '../styles/Navigation.module.css';

const Navigation: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav 
      ref={navRef} 
      className={`${styles.navigation} ${isScrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}
    >
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src="/Logo1.png"
              alt="Parallax Vision Logo"
              width={150}
              height={50}
              priority
            />
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link href="#hero">Home</Link>
          <Link href="#character">Character</Link>
          <Link href="#gallery">Gallery</Link>
          <Link href="#contact">Contact</Link>
        </div>

        <button 
          className={styles.menuButton} 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={styles.mobileMenu}>
          <Link href="#hero" onClick={toggleMenu}>Home</Link>
          <Link href="#character" onClick={toggleMenu}>Character</Link>
          <Link href="#gallery" onClick={toggleMenu}>Gallery</Link>
          <Link href="#contact" onClick={toggleMenu}>Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
