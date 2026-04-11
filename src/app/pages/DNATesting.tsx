import { useRef } from 'react';
import { useMetaTags } from '@/hooks/useMetaTags';
import { Link } from 'react-router';
import { motion, useInView } from 'motion/react';
import type { ReactNode } from 'react';
import { Shield, Award, Clock, CheckCircle, Calendar, MessageCircle, ArrowRight, Lock, Dna } from 'lucide-react';
import { trackContactClick } from '@/app/lib/analyticsStore';

const DNA_IMG = '/images/pages/dna-hero.jpg';
const LAB_IMG = '/images/shared/lab-diagnostics.jpg';

const dnaServices = [
  {
    emoji: '👨‍👩‍👧',
    title: 'Paternity DNA Testing',
    desc: 'Determine biological father-child relationships with 99.9% accuracy. Legal and non-legal options available.',
    turnaround: '3-5 business days',
    uses: ['Legal proceedings', 'Child custody matters', 'Peace of mind', 'Birth certificate amendments'],
  },
  {
    emoji: '✈️',
    title: 'Immigration DNA Testing',
    desc: 'Court-admissible DNA tests for immigration and visa purposes. Accepted by immigration authorities.',
    turnaround: '5-7 business days',
    uses: ['Visa applications', 'Citizenship claims', 'Family reunification', 'Embassy requirements'],
  },
  {
    emoji: '👨‍👩‍👦‍👦',
    title: 'Family Relationship Testing',
    desc: 'Determine grandparentage, siblingship, aunts/uncles, and other family relationships.',
    turnaround: '5-7 business days',
    uses: ['Grandparentage testing', 'Sibling testing', 'Aunt/Uncle testing', 'Twin zygosity'],
  },
];

const trustPoints = [
  { icon: Shield, title: '100% Confidential', desc: 'All samples and results are handled with strict privacy protocols' },
  { icon: Award, title: 'ISO Certified Lab', desc: 'International laboratory accreditation for accurate, reliable results' },
  { icon: Clock, title: 'Fast Results', desc: 'Results available within 3-7 business days depending on test type' },
  { icon: Lock, title: 'Chain of Custody', desc: 'Legal-grade sample collection and documentation for court purposes' },
];

const process = [
  { step: 1, title: 'Book Appointment', desc: 'Schedule your DNA test online or call us directly', icon: '📅' },
  { step: 2, title: 'Sample Collection', desc: 'Simple, painless cheek swab at our facility (or at-home kit)', icon: '🧪' },
  { step: 3, title: 'Lab Analysis', desc: 'Samples sent to our ISO-certified laboratory for analysis', icon: '🔬' },
  { step: 4, title: 'Results Delivered', desc: 'Confidential results shared via secure portal or in person', icon: '📊' },
];

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function DNATesting() {
  useMetaTags({
    title: 'DNA Testing Services - Silhouette Diagnostics',
    description: 'Professional DNA testing including paternity, immigration, and family relationship tests with 99.9% accuracy.',
    keywords: 'DNA testing, paternity test, genetic testing, immigration DNA',
    ogTitle: 'Advanced DNA Testing Services',
    ogDescription: 'Accurate DNA testing for paternity, immigration, and family relationships',
    canonical: `${window.location.origin}/dna-testing`,
  });
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={DNA_IMG} alt="DNA" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-violet-950/95 via-violet-900/80 to-violet-800/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-400/30 rounded-full px-4 py-1.5 mb-6">
              <Dna className="w-4 h-4 text-violet-300" />
              <span className="text-violet-200 text-sm font-medium">DNA Testing Services</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Accurate &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Confidential</span><br />
              DNA Testing
            </h1>
            <p className="text-violet-100 text-lg max-w-xl mb-8 leading-relaxed">
              ISO-certified DNA testing for paternity, immigration, and family relationships. Fast, accurate, and completely confidential.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/booking?service=dna-testing" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold rounded-xl shadow-xl hover:scale-105 transition-transform duration-200">
                <Calendar className="w-5 h-5" />
                Book DNA Test
              </Link>
              <a
                href="https://wa.me/2349030002653"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick('whatsapp')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((t, i) => (
              <FadeIn key={t.title} delay={i * 0.08}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                    <t.icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.title}</div>
                    <div className="text-gray-500 text-xs">{t.desc}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* DNA Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">Our DNA Services</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your DNA Test</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              All tests are performed in our ISO-certified laboratory with strict confidentiality protocols. For pricing or enquiries, book an appointment,
              call us, or chat on WhatsApp.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {dnaServices.map((svc, i) => (
              <FadeIn key={svc.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(124,58,237,0.12)' }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full"
                >
                  <div className="text-4xl mb-4">{svc.emoji}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{svc.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{svc.desc}</p>
                  <div className="space-y-2 mb-5">
                    {svc.uses.map((use) => (
                      <div key={use} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-violet-500 shrink-0" />
                        {use}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                    <div>
                      <div className="font-semibold text-gray-900">Pricing available on request</div>
                      <div className="text-xs text-gray-400">Results in {svc.turnaround}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="tel:+2349030002653"
                        onClick={() => trackContactClick('call')}
                        className="px-4 py-2 bg-violet-50 text-violet-700 text-sm font-semibold rounded-lg hover:bg-violet-100 transition-colors"
                      >
                        Call
                      </a>
                      <a
                        href="https://wa.me/2349030002653"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackContactClick('whatsapp')}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        WhatsApp
                      </a>
                      <Link
                      to="/booking?service=dna-testing"
                        className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {process.map((p, i) => (
              <FadeIn key={p.step} delay={i * 0.1}>
                <div className="relative text-center">
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] right-[-40%] h-0.5 bg-violet-200 z-0" />
                  )}
                  <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg shadow-violet-200">
                    {p.icon}
                  </div>
                  <div className="w-5 h-5 bg-white border-2 border-violet-500 rounded-full flex items-center justify-center text-xs font-bold text-violet-600 mx-auto mb-3">
                    {p.step}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm">{p.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Split section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <img src={LAB_IMG} alt="Laboratory" className="rounded-2xl w-full h-80 object-cover shadow-xl" />
            </FadeIn>
            <FadeIn delay={0.2}>
              <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold mb-4">Why Choose Us for DNA</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Your Privacy is Our Priority</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our DNA testing services are performed in a fully accredited laboratory with strict chain-of-custody protocols. All results are handled with the utmost confidentiality and professionalism.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'ISO 17025 accredited laboratory',
                  '99.9% accuracy guaranteed for all tests',
                  'Court-admissible results available',
                  'Secure online results portal',
                  'Compassionate, professional service',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-violet-600 shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/booking?service=dna-testing" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-violet-200">
                Book Your DNA Test <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-violet-700 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-sm" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started-</h2>
            <p className="text-violet-200 text-lg mb-8">Speak to our DNA specialists or book your test today. All consultations are free and confidential.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking?service=dna-testing" className="px-7 py-3.5 bg-white text-violet-700 font-bold rounded-xl hover:scale-105 transition-transform">
                Book DNA Test
              </Link>
              <Link to="/contact" className="px-7 py-3.5 bg-white/20 border border-white/30 text-white font-bold rounded-xl hover:bg-white/30 transition-all">
                Contact Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
