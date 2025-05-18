import { useEffect, useState } from 'react';

const useImagePreloader = (imageUrls: string[]) => {
  const [preloadComplete, setPreloadComplete] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = imageUrls.length;

    if (totalToLoad === 0) {
      setPreloadComplete(true);
      return;
    }

    const handleLoad = () => {
      loadedCount += 1;
      if (loadedCount === totalToLoad) {
        setPreloadComplete(true);
      }
    };

    const handleError = () => {
       // Handle potential errors if needed, though simpler to just log or ignore for preloading effect
       loadedCount += 1; // Still count it, even if failed, to eventually finish
       if (loadedCount === totalToLoad) {
        setPreloadComplete(true);
      }
    };

    imageUrls.forEach((url) => {
      if (url) {
        const img = new Image();
        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = url;
      } else {
          loadedCount += 1; // Count missing/null urls
          if (loadedCount === totalToLoad) {
            setPreloadComplete(true);
          }
      }
    });

    // Cleanup function is not strictly necessary for image loading itself
    // as images are loaded into browser cache, but good practice if using other resources
  }, [imageUrls]);

  return preloadComplete;
};

export default useImagePreloader;
