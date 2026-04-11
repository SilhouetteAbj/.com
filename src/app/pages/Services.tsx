import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, useInView } from 'motion/react';
import { Search, ArrowRight, FlaskConical, Microscope, Activity, Shield, Star } from 'lucide-react';
import { SERVICE_CATEGORIES, TOTAL_TESTS, TOTAL_CATEGORIES } from '../data/servicesData';
import { HEALTH_DISCOUNT_HEADLINE, HEALTH_DISCOUNT_NOTE } from '@/app/data/discountPromotion';
import '@/styles/services.css';

const SERVICES_HERO_IMG = '/images/pages/services-hero.jpg';

function FadeIn({
  children,
  delay = 0,
  className = '',
  from = 'bottom',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: 'bottom' | 'left' | 'right';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const initial =
    from === 'left' ? { opacity: 0, x: -30 }
    : from === 'right' ? { opacity: 0, x: 30 }
    : { opacity: 0, y: 28 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CategoryCard({ cat, index }: { cat: typeof SERVICE_CATEGORIES[0]; index: number }) {
  return (
    <FadeIn delay={index * 0.06}>
      <Link to={`/services/category/${cat.id}`} className="group block h-full">
        <motion.div
          whileHover={{ y: -6, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative h-full rounded-3xl overflow-hidden border border-white/60 shadow-lg shadow-slate-200/60 bg-white/80 backdrop-blur-md flex flex-col cat-accent-${cat.id}`}
        >
          <div className="h-1.5 w-full shrink-0 service-card-bar" />
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-5">
              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0 service-card-emoji"
              >
                {cat.emoji}
              </motion.div>
              <div
                className="text-xs font-semibold px-3 py-1.5 rounded-full service-card-badge"
              >
                {cat.tagline}
              </div>
            </div>
            <div className="mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase service-card-short">
                {cat.shortTitle}
              </span>
              <h3 className="text-gray-900 mt-0.5 service-card-title">
                {cat.title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-5">
              {cat.description}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-300 service-card-link">
              View All Tests
              <div className="w-6 h-6 rounded-full flex items-center justify-center service-card-icon-bg">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none service-card-glow"
          />
        </motion.div>
      </Link>
    </FadeIn>
  );
}

function StatCard({ icon: Icon, value, label, colorClass }: { icon: React.ElementType; value: string; label: string; colorClass: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
        <Icon className={`w-4.5 h-4.5 ${colorClass}`} />
      </div>
      <div>
        <div className="text-white font-bold text-lg leading-tight">{value}</div>
        <div className="text-blue-200 text-xs leading-tight">{label}</div>
      </div>
    </div>
  );
}

export function Services() {
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();

  const filteredCategories = globalSearch.trim().length < 2
    ? SERVICE_CATEGORIES
    : SERVICE_CATEGORIES.filter((cat) => {
        const q = globalSearch.toLowerCase();
        return (
          cat.title.toLowerCase().includes(q) ||
          cat.shortTitle.toLowerCase().includes(q) ||
          cat.tests.some((t) => t.name.toLowerCase().includes(q))
        );
      });

  const searchHits =
    globalSearch.trim().length >= 2
      ? SERVICE_CATEGORIES.flatMap((cat) =>
          cat.tests
            .filter((t) => t.name.toLowerCase().includes(globalSearch.toLowerCase()))
            .slice(0, 5)
            .map((t) => ({ ...t, catTitle: cat.title, catId: cat.id, accentColor: cat.gradientFrom }))
        ).slice(0, 12)
      : [];

  return (
    <div className="min-h-screen services-page">
      <div
        className="relative pt-32 pb-20 overflow-hidden services-hero"
      >
        <img
          src={SERVICES_HERO_IMG}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 opacity-10 services-hero-grid" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl services-orb-blue" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl services-orb-purple" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-white/15 border border-white/25 text-cyan-300 mb-5">
              Diagnostic Services Directory
            </span>
            <h1 className="text-white text-center mb-4 services-title">
              Your Complete{' '}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text services-title-highlight">
                  Diagnostics
                </span>
              </span>{' '}
              Directory
            </h1>
            <p className="text-blue-200 max-w-2xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
              {TOTAL_CATEGORIES} specialist categories · {TOTAL_TESTS}+ tests · State-of-the-art equipment · Certified specialists
            </p>
          </motion.div>

          <div className="mx-auto mb-8 max-w-2xl rounded-[24px] border border-blue-300/20 bg-blue-400/10 px-4 py-4 text-left shadow-[0_16px_45px_rgba(0,82,255,0.14)]">
            <div className="text-sm font-semibold text-blue-100 sm:text-base">
              {HEALTH_DISCOUNT_HEADLINE}
            </div>
            <p className="mt-2 text-sm leading-6 text-blue-50/80">
              {HEALTH_DISCOUNT_NOTE}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="relative w-full max-w-2xl mx-auto mb-8 px-2 sm:px-0"
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder='Search any test or category (e.g., "Malaria", "MRI", "HbA1c")...'
                className="w-full pl-13 pr-6 py-4 rounded-2xl bg-white text-gray-800 shadow-2xl outline-none placeholder-gray-400 border-0 services-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchHits.length > 0) {
                    setGlobalSearch('');
                    navigate(`/services/category/${searchHits[0].catId}`);
                  }
                }}
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            <div className="mt-4 rounded-[22px] border border-blue-300/18 bg-blue-400/10 px-4 py-3 text-center shadow-[0_12px_30px_rgba(0,82,255,0.12)]">
              <div className="text-sm font-semibold text-blue-100">
                {HEALTH_DISCOUNT_HEADLINE}
              </div>
              <p className="mt-1 text-xs leading-5 text-blue-50/80 sm:text-sm">
                {HEALTH_DISCOUNT_NOTE}
              </p>
            </div>

            {searchHits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 z-20 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden services-search-results"
              >
                <div className="px-4 py-2 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {searchHits.length} Tests Found
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {searchHits.map((hit) => (
                    <button
                      key={hit.id}
                      onClick={() => {
                        setGlobalSearch('');
                        navigate(`/services/category/${hit.catId}`);
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">{hit.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{hit.catTitle}</div>
                      </div>
                      <div className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 hit-badge cat-accent-${hit.catId}`}>
                        View
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <StatCard icon={FlaskConical} value={`${TOTAL_TESTS}+`} label="Total Tests" colorClass="stat-icon-blue" />
            <StatCard icon={Microscope} value={`${TOTAL_CATEGORIES}`} label="Specialties" colorClass="stat-icon-purple" />
            <StatCard icon={Activity} value="24-48hr" label="Result Turnaround" colorClass="stat-icon-green" />
            <StatCard icon={Shield} value="ISO Cert." label="Accredited Lab" colorClass="stat-icon-amber" />
            <StatCard icon={Star} value="4.9★" label="Patient Rating" colorClass="stat-icon-rose" />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-blue-50 text-[#0052FF] border border-blue-100 mb-3">
              Choose a Category
            </span>
            <h2 className="text-gray-900 mb-3 services-section-title">
              {globalSearch ? `Categories matching "${globalSearch}"` : 'Browse All Diagnostic Categories'}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Select a category to explore all available tests, pricing, and to book your appointment.
            </p>
          </div>
        </FadeIn>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-gray-600 mb-2 services-empty-title">No results for "{globalSearch}"</h3>
            <p className="text-gray-400 text-sm">Try a different search term or browse all categories below.</p>
            <button
              onClick={() => setGlobalSearch('')}
              className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#0052FF] border border-[#0052FF] hover:bg-blue-50 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCategories.map((cat, i) => (
              <CategoryCard key={cat.id} cat={cat} index={i} />
            ))}
          </div>
        )}
      </div>

      <FadeIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-3xl p-8 sm:p-10 services-cta">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { emoji: '⚡', title: 'Same-Day Results', desc: 'Most tests report in 4-6 hours' },
                { emoji: '🔬', title: 'State-of-the-Art Equipment', desc: 'ISO-certified automated analysers' },
                { emoji: '👨‍⚕️', title: 'Expert Specialists', desc: 'Consultant radiologists & pathologists' },
                { emoji: '📱', title: 'Digital Reports', desc: 'Delivered via portal, email & WhatsApp' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5 shrink-0">{item.emoji}</div>
                  <div>
                    <div className="text-gray-900 text-sm mb-0.5 services-info-title">{item.title}</div>
                    <div className="text-slate-500 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="py-16 relative overflow-hidden services-banner">
        <div className="absolute inset-0 opacity-10 services-hero-grid" />
        <FadeIn>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-white mb-4 services-banner-title">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-blue-200 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
              Our clinical team is available 7 days a week to help you identify the right test for your health concern. Contact us or book a consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/booking" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white rounded-2xl font-bold text-[#0052FF] hover:shadow-xl hover:scale-105 transition-all duration-200">
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-200">
                Contact Us
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn>
            <h2 className="text-gray-900 mb-6 services-category-title">
              Comprehensive Diagnostic Services at Silhouette Diagnostics Consultants
            </h2>
            <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed space-y-4">
              <p>
                Silhouette Diagnostics Consultants provides a broad spectrum of diagnostic services across {TOTAL_CATEGORIES} specialist categories with over {TOTAL_TESTS} tests. From routine wellness screening to advanced molecular assays, our goal is to deliver reliable results that guide confident clinical decisions.
              </p>
              <p>
                Our laboratory services cover haematology, biochemistry, microbiology, and hormone analysis, while our imaging departments offer MRI, CT, ultrasound, X-ray, and endoscopy with consultant-led reporting. We focus on accuracy, patient safety, and quick turnaround.
              </p>
              <p>
                Dedicated cancer screening programs include breast, cervical, prostate, colorectal, and lung screening pathways, backed by evidence-based testing and specialist review for early detection and risk assessment.
              </p>
              <p>
                Patients receive results within 24 to 48 hours via secure digital channels, and our care team remains available 7 days a week to assist with preparation, booking, and follow-up.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

export default Services;
