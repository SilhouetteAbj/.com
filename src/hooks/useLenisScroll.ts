import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll hook using GSAP
 * Provides scroll synchronization with GSAP animations
 * Lenis integration can be added later when package is available
 */
export function useLenisScroll() {
  const scrollRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    // Synchronize scroll with ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollRef;
}
