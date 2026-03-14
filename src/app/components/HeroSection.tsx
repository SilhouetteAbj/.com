import * as React from 'react';
import { motion } from 'motion/react';

type HeroSectionProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
};

export function HeroSection({ title, subtitle, badge, backgroundImage, overlayOpacity = 0.7, children }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden min-h-[300px] sm:min-h-[360px] lg:min-h-[420px] pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 flex items-center" aria-label="Hero">
      {backgroundImage && (
        <img src={backgroundImage} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      )}

      <div
        className={`absolute inset-0 bg-gradient-to-br from-emerald-900 to-teal-800 ${
          overlayOpacity >= 0.8 ? 'opacity-80' : overlayOpacity >= 0.6 ? 'opacity-70' : 'opacity-50'
        }`}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {badge && <div className="mb-4 text-sm font-semibold text-emerald-200">{badge}</div>}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-3 text-lg text-emerald-100 max-w-2xl">{subtitle}</p>}
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
