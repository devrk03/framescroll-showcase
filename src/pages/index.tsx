// src/pages/index.tsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import VideoScroll from '../components/VideoScroll';
import Character from '../components/Character';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';
import FullScreenImage from '../components/FullScreenImage';
import { useImagePreloader } from '../hooks/useImagePreloader';

// Generate all frame paths
const generateFramePaths = () => {
  const frameCount = 47;
  return Array.from({ length: frameCount }, (_, i) => `/Video1/Frame${i + 1}.jpeg`);
};

export default function Home() {
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const allImages = [
    '/photos/background1.png',
    '/photos/photo1.png',
    '/photos/photo2.png',
    '/photos/photo3.png',
    '/photos/photo4.png',
    '/Logo1.png',
    ...generateFramePaths()
  ];
  
  const { imagesPreloaded } = useImagePreloader(allImages);
  
  useEffect(() => {
    if (imagesPreloaded) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Small delay to ensure smooth transition
    }
  }, [imagesPreloaded]);
  
  const handleVideoComplete = () => {
    setIsVideoComplete(true);
  };
  
  return (
    <>
      <Head>
        <title>Parallax Vision</title>
        <meta name="description" content="Experience the magic of scrolling" />
      </Head>
      
      {isLoading ? (
        <div className="preloader">
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading experience...</p>
          </div>
          <style jsx>{`
            .preloader {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #0a0a0a;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
            }
            
            .loader-container {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .loader {
              border: 5px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              border-top: 5px solid #e63946;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            p {
              color: white;
              font-family: 'Crimson Text', serif;
              font-size: 1.2rem;
            }
          `}</style>
        </div>
      ) : (
        <main>
          <Navigation />
          <Hero />
          <VideoScroll onComplete={handleVideoComplete} />
          <Character isReady={isVideoComplete} />
          <Gallery />
          <Footer />
          <FullScreenImage />
        </main>
      )}
    </>
  );
}

