import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Calendar, MessageCircle, Phone } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-40 h-40 bg-white/5 rounded-full blur-3xl"
          style={{ left: `${i * 20}%`, top: `${(i % 2) * 50}%` }}
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInSection className="mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Ready to Get Accurate<br />Diagnostic Results?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg">
            Schedule your appointment today and experience premium diagnostic care with certified specialists.
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/booking"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl shadow-blue-500/40 hover:scale-105 transition-transform duration-200 text-center"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500/30 border-2 border-white text-white font-bold rounded-xl hover:bg-blue-500/40 transition-all duration-200"
          >
            <MessageCircle className="w-5 h-5" />
            Live Chat
          </Link>
          <a
            href="tel:+2349030002653"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500/30 border-2 border-white text-white font-bold rounded-xl hover:bg-blue-500/40 transition-all duration-200"
          >
            <Phone className="w-5 h-5" />
            +2349030002653
          </a>
          <a
            href="tel:+2349071920849"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500/30 border-2 border-white text-white font-bold rounded-xl hover:bg-blue-500/40 transition-all duration-200"
          >
            <Phone className="w-5 h-5" />
            +2349071920849
          </a>
        </FadeInSection>

        <FadeInSection delay={0.3} className="mt-12 pt-12 border-t border-white/20">
          <div className="grid sm:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="text-white">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Online Appointment Booking</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="text-white">
              <div className="text-3xl font-bold mb-2">4.9★</div>
              <p className="text-blue-100">Patient Rating</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="text-white">
              <div className="text-3xl font-bold mb-2">15K+</div>
              <p className="text-blue-100">Successful Diagnostics</p>
            </motion.div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
