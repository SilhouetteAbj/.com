import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { FadeInSection } from '../sections/FadeInSection';

interface TestimonialCardProps {
  name: string;
  role: string;
  rating: number;
  text: string;
  index: number;
}

export function TestimonialCard({ name, role, rating, text, index }: TestimonialCardProps) {
  return (
    <FadeInSection key={name} delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full"
      >
        <div className="flex items-center gap-1 mb-4">
          {[...Array(rating)].map((_, j) => (
            <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{text}"</p>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{name}</div>
            <div className="text-gray-500 text-xs">{role}</div>
          </div>
        </div>
      </motion.div>
    </FadeInSection>
  );
}
