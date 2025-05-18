'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useImageModal } from '../context/ImageModalContext';
import gsap from 'gsap';

const ImageModal = () => {
  const { isOpen, imageUrl, closeModal } = useImageModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLImageElement>(null); // Ref for the image or content container

   useEffect(() => {
        if (modalRef.current) {
            if (isOpen) {
                 // Animate modal in
                gsap.to(modalRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out', onStart: () => modalRef.current?.classList.add('open') });
                 // Optional: Animate content scale
                gsap.fromTo(contentRef.current, { scale: 0.95 }, { scale: 1, duration: 0.3, ease: 'back.out(1.2)' });
            } else {
                // Animate modal out
                gsap.to(modalRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => modalRef.current?.classList.remove('open') });
                 // Optional: Animate content scale out
                // gsap.to(contentRef.current, { scale: 0.95, duration: 0.3, ease: 'power2.in' });
            }
        }
    }, [isOpen]);


  if (!imageUrl) return null; // Don't render if no image is selected

  return (
    <div
       ref={modalRef}
       className="modal-overlay"
       onClick={closeModal} // Close modal when clicking outside image
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent clicks on content from closing modal
      >
        <Image
          ref={contentRef}
          src={imageUrl}
          alt="Full screen image"
           // Use sizes and fill carefully or set explicit width/height if aspect ratio is fixed
           // For a general modal, setting max dimensions and object-fit is common
          width={1000} // Set large enough max dimensions
          height={1000}
          style={{
             maxWidth: '90vw',
             maxHeight: '90vh',
             objectFit: 'contain' // Ensure image fits within the container
          }}
        />

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black text-2xl font-bold cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          onClick={closeModal}
          aria-label="Close Modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
