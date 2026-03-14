/**
 * Phase 4: Advanced Animations - Complete API Reference
 * 
 * This module provides comprehensive animation utilities for scroll-triggered effects,
 * entrance animations, and interaction animations using GSAP, Framer Motion, and Lenis.
 */

// ==================== SCROLL ANIMATIONS ====================
// Located: src/animations/scroll.animations.ts

/**
 * Fade In On Scroll
 * Fades element in as it scrolls into view
 * Usage: fadeInOnScroll(elementRef.current, { start: 'top 80%' })
 */
export { fadeInOnScroll } from '@/animations/scroll.animations';

/**
 * Scale On Scroll
 * Scales element from 0.8 to 1 as it scrolls into view
 * Usage: scaleOnScroll(elementRef.current)
 */
export { scaleOnScroll } from '@/animations/scroll.animations';

/**
 * Parallax Effect
 * Creates depth effect by moving element faster than scroll
 * Usage: parallaxEffect(elementRef.current, 0.5)
 * @param speed - Multiplier for scroll speed (0.5 = half speed)
 */
export { parallaxEffect } from '@/animations/scroll.animations';

/**
 * Stagger Animation
 * Animates multiple children with staggered timing
 * Usage: staggerAnimation(Array.from(containerRef.current.children))
 */
export { staggerAnimation } from '@/animations/scroll.animations';

/**
 * Counter Animation
 * Animates number count-up effect
 * Usage: counterAnimation(elementRef.current, 15000, 2)
 * @param element - DOM element to update
 * @param targetValue - Number to count to
 * @param duration - Animation duration in seconds
 */
export { counterAnimation } from '@/animations/scroll.animations';

/**
 * Text Reveal Animation
 * Reveals text line by line as it scrolls
 * Usage: textRevealAnimation(elementRef.current)
 */
export { textRevealAnimation } from '@/animations/scroll.animations';

/**
 * Slide In Animation
 * Slides element in from specified direction
 * Usage: slideInAnimation(elementRef.current, 'left', 50)
 * @param element - DOM element
 * @param direction - 'left', 'right', 'up', 'down'
 * @param distance - Distance to slide in pixels
 */
export { slideInAnimation } from '@/animations/scroll.animations';

/**
 * Blur Reveal Animation
 * Reveals element by reducing blur effect
 * Usage: blurRevealAnimation(elementRef.current)
 */
export { blurRevealAnimation } from '@/animations/scroll.animations';

/**
 * Rotate Fade Animation
 * Rotates and fades element in
 * Usage: rotateFadeAnimation(elementRef.current, 15)
 * @param element - DOM element
 * @param degree - Rotation in degrees
 */
export { rotateFadeAnimation } from '@/animations/scroll.animations';

/**
 * Pin Animation
 * Pins element while scrolling through content
 * Usage: pinAnimation(elementRef.current, 3)
 * @param element - DOM element to pin
 * @param duration - Duration of pin in seconds
 */
export { pinAnimation } from '@/animations/scroll.animations';

/**
 * Horizontal Scroll Animation
 * Enables horizontal scrolling triggered by vertical scroll
 * Usage: horizontalScrollAnimation(containerRef.current, 1)
 */
export { horizontalScrollAnimation } from '@/animations/scroll.animations';

/**
 * Background Transition Animation
 * Transitions background color while scrolling
 * Usage: backgroundTransitionAnimation(elementRef.current, ['#blue', '#cyan', '#green'])
 */
export { backgroundTransitionAnimation } from '@/animations/scroll.animations';

// ==================== ENTRANCE ANIMATIONS ====================
// Located: src/animations/entrance.animations.ts

/**
 * Framer Motion Entrance Animations
 * Use with: motion.div variant={fadeInUp} initial animate
 */
export {
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  rotateIn,
  staggerContainer,
  pulse,
  float,
  bounce,
  shimmer,
  glow,
} from '@/animations/entrance.animations';

// ==================== INTERACTION ANIMATIONS ====================
// Located: src/animations/interaction.animations.ts

/**
 * Interaction Animations for modals, menus, and transitions
 */
export {
  pageTransitionIn,
  slideInFromRight,
  slideInFromLeft,
  sectionReveal,
  modalBackdrop,
  modalContent,
  menuAnimations,
} from '@/animations/interaction.animations';

// ==================== CUSTOM HOOKS ====================
// Located: src/hooks/

/**
 * useScrollAnimation Hook
 * Simplified hook for scroll-triggered animations
 * 
 * @example
 * const ref = useScrollAnimation('fadeIn');
 * return <div ref={ref}>Content</div>
 */
export { useScrollAnimation } from '@/hooks/useScrollAnimation';

/**
 * useLenisScroll Hook
 * Enables smooth scrolling with Lenis
 * Automatically synchronizes with GSAP ScrollTrigger
 * 
 * @example
 * function Component() {
 *   useLenisScroll();
 *   return <div>Smooth scrolling enabled!</div>
 * }
 */
export { useLenisScroll } from '@/hooks/useLenisScroll';

/**
 * useFormHandler Hook
 * Manages form state and validation
 * Includes loading and error states
 * 
 * @example
 * const { form, handleChange, handleSubmit, loading } = useFormHandler({
 *   onSubmit: async (data) => { await api.post('/form', data) }
 * });
 */
export { useFormHandler } from '@/hooks/useFormHandler';

// ==================== USAGE GUIDE ====================

/**
 * SCROLL ANIMATIONS USAGE
 * 
 * 1. Fade In on Scroll
 *    In your component:
 *    const containerRef = useRef(null);
 *    
 *    useEffect(() => {
 *      fadeInOnScroll(containerRef.current);
 *    }, []);
 *    
 *    return <div ref={containerRef}>Content</div>
 * 
 * 2. Using useScrollAnimation Hook
 *    const ref = useScrollAnimation('fadeIn');
 *    return <div ref={ref}>Content fades in on scroll</div>
 * 
 * 3. Multiple Animations
 *    const ref1 = useScrollAnimation('fadeIn');
 *    const ref2 = useScrollAnimation('parallax', 0.7);
 *    
 * 4. With Options
 *    fadeInOnScroll(ref.current, {
 *      start: 'top 90%',
 *      end: 'top 10%',
 *    });
 */

/**
 * FRAMER MOTION USAGE
 * 
 * 1. Simple Entrance
 *    <motion.div variants={fadeInUp} initial="initial" animate="animate">
 *      Content
 *    </motion.div>
 * 
 * 2. Staggered Children
 *    <motion.div variants={staggerContainer} animate="animate">
 *      <motion.div variants={fadeInUp}>Item 1</motion.div>
 *      <motion.div variants={fadeInUp}>Item 2</motion.div>
 *    </motion.div>
 * 
 * 3. Continuous Animations
 *    <motion.div animate={pulse}>
 *      Pulsing element
 *    </motion.div>
 */

/**
 * LENIS SMOOTH SCROLL
 * 
 * 1. Enable in Layout
 *    function Layout() {
 *      useLenisScroll();
 *      return <Outlet />
 *    }
 * 
 * 2. Combines with GSAP
 *    // Automatically syncs Lenis with ScrollTrigger
 *    // No additional configuration needed
 */

/**
 * PERFORMANCE TIPS
 * 
 * 1. Use once: true for scroll animations that should only play once
 * 2. Debounce scroll listeners with throttle
 * 3. Use will-change CSS for animated elements
 * 4. Test on mobile with useDesktop/useMobile hooks
 * 5. Consider using transform and opacity for best performance
 * 6. Clean up GSAP animations in useEffect return
 */
