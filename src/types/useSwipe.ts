'use client';

import { useState, useEffect } from 'react';

export const useSwipe = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setDirection('left');
      onSwipeLeft();
    } else if (isRightSwipe) {
      setDirection('right');
      onSwipeRight();
    }

    setIsSwiping(false);
    setDirection(null);
    setTouchStart(null);
    setTouchEnd(null);
  };

  return {
    isSwiping,
    direction,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
};