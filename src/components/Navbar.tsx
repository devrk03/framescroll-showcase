'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5,
    });
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transform -translate-y-full opacity-0 bg-black/30 backdrop-blur-md text-white"
    >
      <div className="flex items-center">
        <Image src="/Logo1.png" alt="Scroll Narrative Logo" width={40} height={40} />
        <span className="ml-3 text-lg font-semibold font-sans capitalize">Scroll Narrative</span>
      </div>
      <div className="space-x-6 hidden md:flex">
        <Link href="#hero" className="hover:text-gray-300 transition-colors duration-200 font-sans">
          Home
        </Link>
        <Link href="#video-section" className="hover:text-gray-300 transition-colors duration-200 font-sans">
          Character
        </Link>
        <Link href="#gallery" className="hover:text-gray-300 transition-colors duration-200 font-sans">
          Gallery
        </Link>
        <Link href="#footer" className="hover:text-gray-300 transition-colors duration-200 font-sans">
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
