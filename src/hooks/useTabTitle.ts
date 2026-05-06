'use client';

import { useEffect } from 'react';

export const useTabTitle = () => {
  useEffect(() => {
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        document.title = '¡Espera! Tu futuro espera 😢';
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.title = originalTitle;
    };
  }, []);
};
