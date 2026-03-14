import { motion } from 'motion/react';
import { Shield, Zap, Award, Users, FlaskConical, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Star, ArrowRight } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

const TEAM_IMG = 'https://kingzypharma.com/wp-content/uploads/2025/01/african-american-woman-scientist-holding-test-tube-laboratory-1024x640.jpg';

const whyUs = [
  { icon: Shield, title: 'ISO Certified', desc: 'Internationally accredited diagnostic standards', color: 'text-blue-600 bg-blue-50' },
  { icon: Zap, title: 'Fast Results', desc: 'Get your results within 24-48 hours', color: 'text-cyan-600 bg-cyan-50' },
  { icon: Award, title: 'Expert Specialists', desc: 'Board-certified radiologists and pathologists', color: 'text-indigo-600 bg-indigo-50' },
  { icon: Users, title: 'Patient-Centered', desc: 'Compassionate care for every patient', color: 'text-emerald-600 bg-emerald-50' },
  { icon: FlaskConical, title: 'Modern Equipment', desc: 'Latest generation diagnostic technology', color: 'text-violet-600 bg-violet-50' },
  { icon: Clock, title: 'Flexible Hours', desc: 'Open 7 days a week for your convenience', color: 'text-rose-600 bg-rose-50' },
];

export function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeInSection>
            <div className="relative">
              <img src={TEAM_IMG} alt="Medical team" className="rounded-3xl w-full h-[450px] object-cover shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-5 shadow-xl">
                <div className="text-white font-bold text-3xl">15K+</div>
                <div className="text-blue-100 text-sm">Patients Served</div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <div className="text-sm font-semibold text-gray-800">4.9/5 Patient Rating</div>
                <div className="text-xs text-gray-500">Based on 2,800+ reviews</div>
              </div>
            </div>
          </FadeInSection>

          <div>
            <FadeInSection className="text-center">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Why Choose Us</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Trusted Diagnostics<br />for Every Patient
              </h2>
              <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                We combine cutting-edge technology with compassionate patient care, ensuring you receive the most accurate and timely results possible.
                <span className="block mt-2">Known and trusted by hospitals and medical facilities all over Abuja and neighboring states.</span>
              </p>
            </FadeInSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyUs.map((w, i) => (
                <FadeInSection key={w.title} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${w.color}`}>
                      <w.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{w.title}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{w.desc}</div>
                    </div>
                  </motion.div>
                </FadeInSection>
              ))}
            </div>

            <FadeInSection delay={0.5} className="mt-8 text-center">
              <Link to="/booking" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200">
                Book a Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}
