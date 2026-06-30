'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Counter animation hook
export function useCountUp(
  end: number,
  duration: number = 2000,
  startOnMount: boolean = true
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!startOnMount && !hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, startOnMount, hasStarted]);

  const start = useCallback(() => setHasStarted(true), []);

  return { count, start, isComplete: count === end };
}

// Intersection observer hook for scroll animations
export function useInView(options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

// Typewriter effect hook
export function useTypewriter(
  text: string,
  speed: number = 50,
  startOnMount: boolean = true
) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!startOnMount) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, startOnMount]);

  return { displayedText, isComplete };
}

// Staggered animation helper
export function getStaggeredDelay(index: number, baseDelay: number = 100): string {
  return `${index * baseDelay}ms`;
}

// Bounce animation trigger
export function useBounce() {
  const [isBouncing, setIsBouncing] = useState(false);

  const trigger = useCallback(() => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 300);
  }, []);

  return { isBouncing, trigger };
}

// Shake animation for errors
export function useShake() {
  const [isShaking, setIsShaking] = useState(false);

  const trigger = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  }, []);

  return { isShaking, trigger };
}

// Number formatting utility
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Percentage animation
export function usePercentage(
  endPercent: number,
  duration: number = 1500
) {
  const [percent, setPercent] = useState(0);
  const { ref, isInView } = useInView();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setPercent(Math.floor(easeOut * endPercent));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, hasAnimated, endPercent, duration]);

  return { ref, percent };
}
