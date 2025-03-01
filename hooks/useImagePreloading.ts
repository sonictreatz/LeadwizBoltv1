import { useState, useEffect } from 'react';
import { Image } from 'react-native';

/**
 * Custom hook to preload images for smoother UI experience
 * @param imageUrls Array of image URLs to preload
 * @returns Object containing loading state and preloaded status
 */
export const useImagePreloading = (imageUrls: string[]) => {
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const preloadPromises = imageUrls.map(uri => 
      new Promise<void>((resolve) => {
        Image.prefetch(uri)
          .then(() => {
            if (mounted) {
              setPreloadedImages(prev => ({
                ...prev,
                [uri]: true
              }));
            }
            resolve();
          })
          .catch(() => {
            // Even if prefetch fails, we'll resolve to avoid blocking the UI
            resolve();
          });
      })
    );

    Promise.all(preloadPromises)
      .then(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [imageUrls]);

  const isImagePreloaded = (uri: string) => !!preloadedImages[uri];

  return {
    isLoading,
    isImagePreloaded,
    preloadedCount: Object.keys(preloadedImages).length,
    totalCount: imageUrls.length
  };
};