'use client'; // This is a client component

import HeroSection from "@/components/HeroSection";
import VideoScroller from "@/components/VideoScroller";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import useImagePreloader from "@/hooks/useImagePreloader";

// List all images that need preloading here
const imagesToPreload = [
  '/Logo1.png',
  '/photos/background1.png',
  '/photos/photo1.png',
  '/photos/photo2.png',
  '/photos/photo3.png',
  '/photos/photo4.png',
  // Include all video frames
  ...Array.from({ length: 21 }, (_, i) => `/Video1/Frame${String(i).padStart(2, '0')}.png`),
];

export default function Home() {
  const preloadComplete = useImagePreloader(imagesToPreload);

  // Optionally show a loading screen until preloading is complete
  if (!preloadComplete) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white font-sans text-xl">
        Loading assets...
      </div>
    );
  }

  return (
    <main className="relative">
      {/* Navbar is fixed and handled in layout.tsx */}
      <HeroSection />
      <VideoScroller preloadComplete={preloadComplete} />
      <Gallery />
      <Footer />
    </main>
  );
}
