import { useState } from 'react';
import { Link } from 'react-router';
import { Activity, Brain, Heart, Eye, Dna, Scan, FlaskConical, Stethoscope, Radar, Shield } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

import { SERVICE_CATEGORIES as allCategories } from '../../app/data/servicesData';
import type { ServiceCategory as CategoryType } from '../../app/data/servicesData';

// Top/new services for the overview section
const overviewServices = [
  {
    id: '4d-ultrasound',
    icon: Activity,
    label: '4D ULTRASOUND SCAN',
    desc: 'Crystal-clear prenatal imaging for expectant mothers',
    color: 'from-blue-500 to-cyan-500',
    href: '/services/category/scan-ultrasound',
  },
  {
    id: 'dna-testing',
    icon: Dna,
    label: 'DNA TESTING',
    desc: 'Accurate paternity, immigration & family DNA tests',
    color: 'from-violet-500 to-purple-500',
    href: '/services/category/dna-testing',
  },
  {
    id: 'mammogram',
    icon: Heart,
    label: 'MAMMOGRAM',
    desc: 'Early detection breast cancer screening services',
    color: 'from-pink-500 to-rose-500',
    href: '/services/category/cancer-screening',
  },
  {
    id: 'endoscopy',
    icon: Eye,
    label: 'ENDOSCOPY',
    desc: 'Minimally invasive internal examination procedures',
    color: 'from-emerald-500 to-teal-500',
    href: '/services/category/endoscopy',
  },
  {
    id: 'ct-scan',
    icon: Brain,
    label: 'CT SCAN',
    desc: 'High-speed computed tomography imaging for detailed diagnosis',
    color: 'from-orange-500 to-red-500',
    href: '/services/category/ct-scan',
  },
  {
    id: 'eeg',
    icon: Scan,
    label: 'EEG',
    desc: 'Neurological brain activity monitoring & analysis',
    color: 'from-amber-500 to-orange-500',
    href: '/services/category/neurological',
  },
];

type MarqueeItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  meta: string;
  accent: string;
};

const categoryIconMap: Record<string, React.ElementType> = {
  laboratory: FlaskConical,
  'scan-ultrasound': Radar,
  xray: Scan,
  mri: Stethoscope,
  'ct-scan': Brain,
  endoscopy: Eye,
  'cardiology-ecg': Heart,
  'dna-testing': Dna,
  'cancer-screening': Shield,
  neurological: Scan,
};

const pickTests = (categoryId: string, min = 3) => {
  const cat = allCategories.find((c) => c.id === categoryId);
  if (!cat) return [];
  const popular = cat.tests.filter((t) => t.popular);
  const filler = cat.tests.filter((t) => !t.popular).slice(0, Math.max(0, min - popular.length));
  return [...popular, ...filler].slice(0, min);
};

export function ServicesSection() {
  const [pauseTop, setPauseTop] = useState(false);
  const [pauseBottom, setPauseBottom] = useState(false);

  const labTests = pickTests('laboratory', 6).map((t) => ({
    id: `lab-${t.id}`,
    label: t.name,
    href: '/services/category/laboratory',
    icon: FlaskConical,
    meta: 'Laboratory Test',
    accent: '#0052FF',
  }));

  const featuredItems: MarqueeItem[] = overviewServices.map((svc) => ({
    id: svc.id,
    label: svc.label,
    href: svc.href || '/services',
    icon: svc.icon,
    meta: 'Top Featured Service',
    accent: svc.color.includes('blue') ? '#2563EB' : svc.color.includes('violet') ? '#8B5CF6' : svc.color.includes('pink') ? '#EC4899' : svc.color.includes('emerald') ? '#10B981' : svc.color.includes('orange') ? '#F97316' : '#F59E0B',
  }));

  const row1Items: MarqueeItem[] = [...featuredItems, ...labTests];

  const row2Items: MarqueeItem[] = [
    ...pickTests('scan-ultrasound', 3).map((t) => ({
      id: `us-${t.id}`,
      label: t.name,
      href: '/services/category/scan-ultrasound',
      icon: categoryIconMap['scan-ultrasound'],
      meta: 'Ultrasound',
      accent: '#7C3AED',
    })),
    ...pickTests('xray', 3).map((t) => ({
      id: `xray-${t.id}`,
      label: t.name,
      href: '/services/category/xray',
      icon: categoryIconMap.xray,
      meta: 'X-Ray',
      accent: '#0F172A',
    })),
    ...pickTests('mri', 3).map((t) => ({
      id: `mri-${t.id}`,
      label: t.name,
      href: '/services/category/mri',
      icon: categoryIconMap.mri,
      meta: 'MRI',
      accent: '#0052FF',
    })),
    ...pickTests('ct-scan', 3).map((t) => ({
      id: `ct-${t.id}`,
      label: t.name,
      href: '/services/category/ct-scan',
      icon: categoryIconMap['ct-scan'],
      meta: 'CT Scan',
      accent: '#0891B2',
    })),
    ...pickTests('cardiology-ecg', 3).map((t) => ({
      id: `cardio-${t.id}`,
      label: t.name,
      href: '/services/category/cardiology-ecg',
      icon: categoryIconMap['cardiology-ecg'],
      meta: 'Cardiology',
      accent: '#E11D48',
    })),
  ];

  const row1Loop = [...row1Items, ...row1Items];
  const row2Loop = [...row2Items, ...row2Items];

  return (
    <section className="py-24 bg-gray-50">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Our Services</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Diagnostic Services</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">From advanced imaging to laboratory analysis, we offer a comprehensive range of diagnostic services to support your health journey.</p>
        </FadeInSection>

        {/* Overview Section */}
        <FadeInSection className="mb-16">
          <div className="w-full flex flex-col items-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Overview</h3>
            <p className="text-gray-500 mb-6 max-w-2xl text-center">
              Explore our top featured services and popular tests across key diagnostic categories.
            </p>

            <div
              className="w-full overflow-hidden"
              style={{
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div
                className="flex gap-4 w-max will-change-transform"
                style={{ animation: 'marquee-left 80s linear infinite', animationPlayState: pauseTop ? 'paused' : 'running' }}
                onMouseEnter={() => setPauseTop(true)}
                onMouseLeave={() => setPauseTop(false)}
                onTouchStart={() => setPauseTop(true)}
                onTouchEnd={() => setPauseTop(false)}
              >
                {row1Loop.map((item, i) => (
                  <Link
                    key={`${item.id}-${i}`}
                    to={item.href}
                    className="shadow-sm rounded-2xl px-4 py-3 min-w-[220px] flex items-center gap-3 hover:shadow-md transition"
                    style={{
                      background: `linear-gradient(135deg, ${item.accent}1F, #FFFFFF 65%)`,
                      border: `1px solid ${item.accent}33`,
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.accent}22`, color: item.accent }}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.meta}</div>
                      <div className="text-xs font-semibold mt-1" style={{ color: item.accent }}>Learn More</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div
              className="w-full overflow-hidden mt-4"
              style={{
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
                maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div
                className="flex gap-4 w-max will-change-transform"
                style={{ animation: 'marquee-right 80s linear infinite', animationPlayState: pauseBottom ? 'paused' : 'running' }}
                onMouseEnter={() => setPauseBottom(true)}
                onMouseLeave={() => setPauseBottom(false)}
                onTouchStart={() => setPauseBottom(true)}
                onTouchEnd={() => setPauseBottom(false)}
              >
                {row2Loop.map((item, i) => (
                  <Link
                    key={`${item.id}-${i}`}
                    to={item.href}
                    className="shadow-sm rounded-2xl px-4 py-3 min-w-[220px] flex items-center gap-3 hover:shadow-md transition"
                    style={{
                      background: `linear-gradient(135deg, ${item.accent}1F, #FFFFFF 65%)`,
                      border: `1px solid ${item.accent}33`,
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.accent}22`, color: item.accent }}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.meta}</div>
                      <div className="text-xs font-semibold mt-1" style={{ color: item.accent }}>Learn More</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </FadeInSection>

        {/* All Categories as Cards */}
        <FadeInSection className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">All Diagnostic Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(allCategories as CategoryType[]).map((cat: CategoryType) => (
              <Link
                key={cat.id}
                to={`/services/category/${cat.id}`}
                className="group relative overflow-hidden rounded-xl border border-black/40 bg-black/20 aspect-video"
                style={{ borderColor: 'rgba(0,0,0,0.35)' }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: 'grayscale(0.2) contrast(1.1) brightness(0.9)' }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.65) 22%, rgba(0,0,0,0) 40%)',
                  }}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.75) 24%, rgba(0,0,0,0) 42%)',
                  }}
                />
                <div className="absolute inset-0 pointer-events-none border border-black/40 rounded-xl" />
                <div className="absolute inset-y-0 left-0 flex items-center w-[58%] sm:w-[42%] lg:w-[32%] px-4 sm:px-5">
                  <div className="text-white space-y-2">
                    <div className="text-2xl">{cat.emoji}</div>
                    <div className="text-sm sm:text-base font-bold uppercase tracking-wide">{cat.title}</div>
                    <div className="text-xs sm:text-sm text-white/80 leading-snug line-clamp-2">
                      {cat.description}
                    </div>
                    <div className="text-xs font-semibold inline-flex items-center gap-1">
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection delay={0.5} className="text-center mt-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-700 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-200"
          >
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeInSection>
      </div>
    </section>
  );
}
