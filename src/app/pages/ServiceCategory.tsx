import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Filter, Search, Star } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';
import type { ServiceCategory, Test } from '../data/servicesData';
import { TestCTAModal } from '../components/TestCTAModal';
import { trackContactClick, trackTestSelection } from '@/app/lib/analyticsStore';

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 animate-pulse">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="h-11 rounded-xl bg-gray-200"
          style={{ opacity: Math.max(0.25, 1 - i * 0.03) }}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  title,
  content,
  isOpen,
  onToggle,
  accentColor,
}: {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
  accentColor: string;
}) {
  return (
    <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold text-gray-800"
      >
        {title}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 pb-4 text-sm text-slate-600 leading-relaxed"
            style={{ borderTop: `1px solid ${accentColor}33` }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TestPill({
  name,
  popular,
  accentColor,
  gradientFrom,
  gradientTo,
  delay,
  onClick,
}: {
  name: string;
  popular?: boolean;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  const baseBorder = `${accentColor}4D`;
  const hoverBg = `${accentColor}14`;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.25 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className="relative w-full text-left rounded-xl px-4 py-2.5 text-sm font-medium truncate"
      style={{
        border: `1px solid ${hover ? accentColor : baseBorder}`,
        color: hover ? accentColor : '#334155',
        background: hover ? hoverBg : '#FFFFFF',
      }}
    >
      {name}
      {popular && (
        <span
          className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
          style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        />
      )}
    </motion.button>
  );
}

export function ServiceCategory() {
  const { categoryId } = useParams();
  const [search, setSearch] = useState('');
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeTag, setActiveTag] = useState('all');

  const category = useMemo<ServiceCategory | undefined>(
    () => SERVICE_CATEGORIES.find((c) => c.id === categoryId),
    [categoryId]
  );

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [categoryId]);

  const allTags = useMemo(() => {
    if (!category) return [];
    const tagSet = new Set<string>();
    category.tests.forEach((t) => t.tags?.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [category]);

  const filteredTests = useMemo<Test[]>(() => {
    if (!category) return [];
    const q = search.trim().toLowerCase();
    return category.tests.filter((t) => {
      const matchesSearch = q.length === 0 || t.name.toLowerCase().includes(q);
      const matchesTag = activeTag === 'all'
        || (activeTag === 'popular' && t.popular)
        || t.tags?.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [category, search, activeTag]);

  const popularTests = useMemo(() => filteredTests.filter((t) => t.popular), [filteredTests]);

  if (!category) {
    return (
      <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center text-gray-600">
        Category not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FF]">
      <div
        className="relative pt-28 pb-16 overflow-hidden"
        style={{ background: `linear-gradient(140deg, #001A6E 0%, ${category.gradientFrom} 55%, ${category.gradientTo} 100%)` }}
      >
        {category.image && (
          <img
            src={category.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            loading="lazy"
          />
        )}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${category.gradientTo}, transparent)` }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: `radial-gradient(circle, ${category.gradientFrom}, transparent)` }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <Link to="/services" className="text-white/70 text-sm hover:text-white">← All Services</Link>
          <div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/18 border border-white/30 backdrop-blur flex items-center justify-center text-3xl">
                {category.emoji}
              </div>
              <div>
                <div className="text-xs tracking-widest uppercase text-white/70">{category.shortTitle}</div>
                <h1 className="text-2xl sm:text-3xl font-extrabold">{category.title}</h1>
                <p className="text-sm text-blue-100 mt-2 max-w-xl">{category.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                `${category.testCount} Tests`,
                '4.9★ Rated',
                'Results in 24-48hr',
              ].map((stat) => (
                <div key={stat} className="px-4 py-2 rounded-2xl bg-white/15 border border-white/20 text-xs font-semibold">
                  {stat}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-[#F7F9FF]/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative w-full sm:flex-1 sm:min-w-[220px] sm:max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tests in this category..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none"
                style={{ boxShadow: search ? `0 0 0 3px ${category.accentColor}22` : 'none', borderColor: search ? category.accentColor : undefined }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilterMenu((v) => !v)}
              className="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
              {activeTag !== 'all' && <span className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
            <div className="text-xs text-gray-500 sm:ml-auto">
              {filteredTests.length} results
            </div>
          </div>
          <AnimatePresence>
            {showFilterMenu && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mt-3"
              >
                <div className="flex flex-wrap gap-2">
                  {['all', 'popular', ...allTags].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: activeTag === tag ? category.accentColor : '#F1F5F9',
                        color: activeTag === tag ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {tag === 'all' ? 'All Tests' : tag === 'popular' ? '⭐ Popular' : tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {!search && activeTag === 'all' && popularTests.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
              <Star className="w-4 h-4 text-yellow-500" /> Popular Tests in {category.shortTitle}
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTests.slice(0, 10).map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTest(t.name);
                    trackTestSelection(t.name);
                  }}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    color: category.accentColor,
                    background: `${category.accentColor}14`,
                    border: `1px solid ${category.accentColor}66`,
                  }}
                >
                  <span className="mr-1">⭐</span> {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Tests</h2>
            <span className="hidden sm:block text-xs text-gray-500">Click any test to enquire or book</span>
          </div>
          {loading ? (
            <SkeletonGrid />
          ) : filteredTests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-600">No tests found for this filter.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveTag('all');
                }}
                className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold text-blue-700 border border-blue-200"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <AnimatePresence>
                {filteredTests.map((t, i) => (
                  <TestPill
                    key={t.id}
                    name={t.name}
                    popular={t.popular}
                    accentColor={category.accentColor}
                    gradientFrom={category.gradientFrom}
                    gradientTo={category.gradientTo}
                    delay={i * 0.025}
                    onClick={() => {
                      setSelectedTest(t.name);
                      trackTestSelection(t.name);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div
          className="rounded-2xl border p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          style={{
            background: `${category.accentColor}14`,
            borderColor: `${category.accentColor}33`,
          }}
        >
          <div>
            <h3 className="font-semibold text-gray-900">Not Sure Which Test You Need?</h3>
            <p className="text-sm text-gray-600 mt-1">Our specialists can guide you in choosing the right diagnostic test.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/2349030002653"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick('whatsapp')}
              className="px-5 py-2.5 rounded-xl text-white font-semibold"
              style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
            >
              WhatsApp Us
            </a>
            <Link
              to="/booking"
              className="px-5 py-2.5 rounded-xl text-white font-semibold"
              style={{ background: `linear-gradient(135deg, ${category.gradientFrom}, ${category.gradientTo})` }}
            >
              Book Now
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: `${category.accentColor}14`, color: category.accentColor }}
          >
            Patient Education
          </span>
          <h2 className="text-xl font-bold text-gray-900">About {category.title}</h2>
          <div className="space-y-3">
            {category.about.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <AccordionItem
                  title={item.title}
                  content={item.content}
                  isOpen={openAccordion === i}
                  onToggle={() => setOpenAccordion(openAccordion === i ? null : i)}
                  accentColor={category.accentColor}
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Explore Other Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SERVICE_CATEGORIES.filter((c) => c.id !== category.id).slice(0, 5).map((c) => (
              <Link
                key={c.id}
                to={`/services/category/${c.id}`}
                className="bg-white rounded-2xl border border-gray-100 p-3 text-center hover:shadow-md hover:-translate-y-1 transition"
              >
                <div className="text-2xl">{c.emoji}</div>
                <div className="text-xs font-bold mt-2" style={{ color: c.accentColor }}>{c.shortTitle}</div>
                <div className="text-xs text-gray-400">{c.testCount} tests</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <TestCTAModal
        testName={selectedTest}
        categoryTitle={category.title}
        onClose={() => setSelectedTest(null)}
      />
    </div>
  );
}

export default ServiceCategory;
