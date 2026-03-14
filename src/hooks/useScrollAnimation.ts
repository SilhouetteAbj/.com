import { useEffect, useRef } from 'react';
import { fadeInOnScroll, scaleOnScroll, parallaxEffect, staggerAnimation } from '@/animations/scroll.animations';

export const useScrollAnimation = (type: 'fadeIn' | 'scale' | 'parallax' | 'stagger' = 'fadeIn', speed?: number) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    switch (type) {
      case 'fadeIn':
        fadeInOnScroll(element);
        break;
      case 'scale':
        scaleOnScroll(element);
        break;
      case 'parallax':
        parallaxEffect(element, speed || 0.5);
        break;
      case 'stagger':
        const children = Array.from(element.children) as HTMLElement[];
        staggerAnimation(children);
        break;
    }
  }, [type, speed]);

  return ref;
};
