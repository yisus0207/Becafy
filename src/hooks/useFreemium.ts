'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const useFreemium = () => {
  const { user } = useAuth();
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('becafy_viewed_scholarships');
    if (stored) {
      setViewedIds(JSON.parse(stored));
    }
  }, []);

  const trackView = (id: string) => {
    if (!viewedIds.includes(id)) {
      const updated = [...viewedIds, id];
      setViewedIds(updated);
      localStorage.setItem('becafy_viewed_scholarships', JSON.stringify(updated));
    }
  };

  const getLimit = () => {
    if (!user) return 1;
    if (user.is_premium) return Infinity;
    return 10;
  };

  const remainingViews = Math.max(0, getLimit() - viewedIds.length);
  const isLimitReached = viewedIds.length >= getLimit();

  const canViewContent = (id: string) => {
    if (viewedIds.includes(id)) return true; // Already viewed
    return !isLimitReached;
  };

  return {
    viewedIds,
    trackView,
    remainingViews,
    isLimitReached,
    canViewContent,
    showGate,
    setShowGate,
    limit: getLimit()
  };
};
