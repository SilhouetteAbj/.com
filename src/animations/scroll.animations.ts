import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade in animation on scroll
 */
export const fadeInOnScroll = (element: HTMLElement | null, options: any = {}) => {
  if (!element) return;

  gsap.fromTo(
    element,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
};

/**
 * Scale animation on scroll
 */
export const scaleOnScroll = (element: HTMLElement | null, options: any = {}) => {
  if (!element) return;

  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
};

/**
 * Parallax effect
 */
export const parallaxEffect = (element: HTMLElement | null, speed: number = 0.5) => {
  if (!element) return;

  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      scrub: 1,
      markers: false,
    },
  });
};

/**
 * Stagger animation
 */
export const staggerAnimation = (elements: HTMLElement[] | null, options: any = {}) => {
  if (!elements || elements.length === 0) return;

  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
};

/**
 * Counter animation
 */
export const counterAnimation = (element: HTMLElement | null, targetValue: number, duration: number = 2) => {
  if (!element) return;

  const obj = { value: 0 };
  gsap.to(obj, {
    value: targetValue,
    duration,
    onUpdate: () => {
      element.textContent = Math.ceil(obj.value).toString();
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
};

/**
 * Text reveal animation - reveals text line by line
 */
export const textRevealAnimation = (element: HTMLElement | null, options: any = {}) => {
  if (!element) return;

  const lines = element.querySelectorAll('p, div, span');
  gsap.fromTo(
    lines,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      scrollTrigger: {
        trigger: element,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
};

/**
 * Slide in from direction animation
 */
export const slideInAnimation = (
  element: HTMLElement | null,
  direction: 'left' | 'right' | 'up' | 'down' = 'left',
  distance: number = 50,
  options: any = {}
) => {
  if (!element) return;

  const fromProps: any = { opacity: 0 };
  
  switch (direction) {
    case 'left':
      fromProps.x = -distance;
      break;
    case 'right':
      fromProps.x = distance;
      break;
    case 'up':
      fromProps.y = distance;
      break;
    case 'down':
      fromProps.y = -distance;
      break;
  }

  gsap.fromTo(
    element,
    fromProps,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
};

/**
 * Blur reveal animation
 */
export const blurRevealAnimation = (element: HTMLElement | null, options: any = {}) => {
  if (!element) return;

  gsap.fromTo(
    element,
    { opacity: 0, filter: 'blur(10px)' },
    {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
};

/**
 * Rotate and fade animation
 */
export const rotateFadeAnimation = (element: HTMLElement | null, degree: number = 15, options: any = {}) => {
  if (!element) return;

  gsap.fromTo(
    element,
    { opacity: 0, rotate: degree },
    {
      opacity: 1,
      rotate: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...options,
      },
    }
  );
};

/**
 * Pin animation - keeps element pinned while scrolling
 */
export const pinAnimation = (element: HTMLElement | null, duration: number = 3, options: any = {}) => {
  if (!element) return;

  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top center',
      end: `+=${duration * 100}`,
      pin: true,
      scrub: 1,
      markers: false,
      ...options,
    },
  });
};

/**
 * Horizontal scroll animation
 */
export const horizontalScrollAnimation = (container: HTMLElement | null, speed: number = 1) => {
  if (!container) return;

  gsap.to(container, {
    x: () => -(container.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${container.scrollWidth}`,
      scrub: speed,
      pin: true,
      markers: false,
    },
  });
};

/**
 * Background color transition animation
 */
export const backgroundTransitionAnimation = (
  element: HTMLElement | null,
  colors: string[],
  options: any = {}
) => {
  if (!element || colors.length === 0) return;

  const colorSequence = colors.map((color, i) => ({
    color,
    offset: i / (colors.length - 1),
  }));

  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      ...options,
    },
    onUpdate: (self: any) => {
      const progress = self.progress;
      let currentColor = colors[0];

      for (let i = 0; i < colorSequence.length - 1; i++) {
        if (progress >= colorSequence[i].offset && progress <= colorSequence[i + 1].offset) {
          // Linear interpolation between colors (simplified)
          currentColor = colorSequence[i].color;
          break;
        }
      }

      element.style.backgroundColor = currentColor;
    },
  });
};
