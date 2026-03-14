import { Link } from 'react-router';
import { motion } from 'motion/react';
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { FadeInSection } from '../sections/FadeInSection';

interface ServiceCardProps {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  color: string;
  href?: string;
  index: number;
}

export function ServiceCard({ id, icon: Icon, label, desc, color, href, index }: ServiceCardProps) {
  return (
    <FadeInSection delay={index * 0.08}>
      <Link to={href || `/services/${id}`} className="block group">
        <motion.div
          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(59,130,246,0.15)' }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">{label}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all duration-200">
            Learn more <ChevronRight className="w-4 h-4" />
          </div>
        </motion.div>
      </Link>
    </FadeInSection>
  );
}
