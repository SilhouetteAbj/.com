import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Microscope, Search, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';

import { TOTAL_CATEGORIES, TOTAL_TESTS } from '@/app/data/servicesData';
import {
  HEALTH_DISCOUNT_HEADLINE,
  HEALTH_DISCOUNT_NOTE,
} from '@/app/data/discountPromotion';
import {
  DISCOVERY_QUICK_TAGS,
  FEATURED_DISCOVERY_RESULTS,
  searchDiscoveryTests,
} from '@/app/lib/serviceDiscovery';
import { cn } from '@/lib/utils';

const HERO_BG = '/images/home/hero-bg.jpg';

const HERO_BREATHE_DELAY_CLASSES = [
  'hero-breathe-delay-1',
  'hero-breathe-delay-2',
  'hero-breathe-delay-3',
  'hero-breathe-delay-4',
] as const;

const heroStats = [
  {
    value: `${TOTAL_TESTS}+`,
    label: 'Tests Indexed',
    icon: Microscope,
    cardClass:
      'border-cyan-300/20 bg-[linear-gradient(145deg,rgba(34,211,238,0.22)_0%,rgba(14,165,233,0.12)_48%,rgba(15,23,42,0.64)_100%)] shadow-[0_22px_58px_rgba(6,182,212,0.14)]',
    iconClass: 'bg-cyan-300/18 text-cyan-100',
  },
  {
    value: `${TOTAL_CATEGORIES}`,
    label: 'Specialty Tracks',
    icon: Stethoscope,
    cardClass:
      'border-emerald-300/20 bg-[linear-gradient(145deg,rgba(52,211,153,0.24)_0%,rgba(16,185,129,0.12)_48%,rgba(15,23,42,0.64)_100%)] shadow-[0_22px_58px_rgba(16,185,129,0.14)]',
    iconClass: 'bg-emerald-300/18 text-emerald-100',
  },
  {
    value: '24-48hr',
    label: 'Typical Reports',
    icon: Sparkles,
    cardClass:
      'border-fuchsia-300/20 bg-[linear-gradient(145deg,rgba(244,114,182,0.22)_0%,rgba(168,85,247,0.12)_48%,rgba(15,23,42,0.64)_100%)] shadow-[0_22px_58px_rgba(217,70,239,0.14)]',
    iconClass: 'bg-fuchsia-300/18 text-fuchsia-100',
  },
  {
    value: 'Clinician Led',
    label: 'Final Review',
    icon: ShieldCheck,
    cardClass:
      'border-amber-300/20 bg-[linear-gradient(145deg,rgba(251,191,36,0.24)_0%,rgba(249,115,22,0.12)_48%,rgba(15,23,42,0.64)_100%)] shadow-[0_22px_58px_rgba(251,146,60,0.14)]',
    iconClass: 'bg-amber-300/18 text-amber-100',
  },
];

export function HeroSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isHeroMotionPaused, setIsHeroMotionPaused] = useState(false);
  const searchHubRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const deferredQuery = useDeferredValue(query);
  const trimmedQuery = deferredQuery.trim();
  const hasSearchQuery = trimmedQuery.length >= 2;
  const results = hasSearchQuery
    ? searchDiscoveryTests(trimmedQuery, 6)
    : FEATURED_DISCOVERY_RESULTS;
  const showResults = isSearchActive || hasSearchQuery;
  const heroAnimationPaused = isHeroMotionPaused;

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) {
        window.clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  const pauseHeroAnimation = () => {
    setIsHeroMotionPaused(true);

    if (pauseTimerRef.current) {
      window.clearTimeout(pauseTimerRef.current);
    }

    pauseTimerRef.current = window.setTimeout(() => {
      setIsHeroMotionPaused(false);
      pauseTimerRef.current = null;
    }, 700);
  };

  const focusSearch = () => {
    setIsSearchActive(true);
    pauseHeroAnimation();
    inputRef.current?.focus();

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      searchHubRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const runPrimarySearch = (value: string) => {
    if (value.trim().length < 2) {
      focusSearch();
      return;
    }

    const bestMatch = searchDiscoveryTests(value, 1)[0];

    if (bestMatch) {
      navigate(bestMatch.route);
      return;
    }

    focusSearch();
  };

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#020817] text-white"
      data-hero-paused={heroAnimationPaused ? 'true' : 'false'}
    >
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="h-full w-full object-cover opacity-[0.14]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_38%),linear-gradient(180deg,_rgba(2,8,23,0.7)_0%,_rgba(2,8,23,0.92)_42%,_rgba(2,8,23,1)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '120px 120px',
          }}
        />

        <motion.div
          className="absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/25 blur-[110px]"
          animate={{ opacity: [0.22, 0.38, 0.22], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[-5%] h-80 w-80 rounded-full bg-emerald-400/20 blur-[120px]"
          animate={{ opacity: [0.18, 0.3, 0.18], scale: [1, 1.12, 1] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        />
        <motion.div
          className="absolute bottom-24 left-[-8%] h-72 w-72 rounded-full bg-blue-500/20 blur-[115px]"
          animate={{ opacity: [0.14, 0.28, 0.14], scale: [1, 1.1, 1] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/[0.12] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Service Discovery Hub
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Search by symptom.
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                Land on the right diagnostic test.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Describe what you feel in plain language and we will surface the closest tests from our local catalog, including pregnancy scans, malaria screening, imaging, and DNA services.
            </p>
          </motion.div>

          <motion.div
            ref={searchHubRef}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            onFocusCapture={() => {
              setIsSearchActive(true);
              pauseHeroAnimation();
            }}
            onBlurCapture={() => {
              if (pauseTimerRef.current) {
                window.clearTimeout(pauseTimerRef.current);
                pauseTimerRef.current = null;
              }
              setIsHeroMotionPaused(false);
              window.setTimeout(() => {
                if (!searchHubRef.current?.contains(document.activeElement)) {
                  setIsSearchActive(false);
                }
              }, 0);
            }}
            className="mx-auto mt-14 w-full max-w-[820px] sm:mt-16"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <label className="relative block flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    pauseHeroAnimation();
                  }}
                  onFocus={focusSearch}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      runPrimarySearch(event.currentTarget.value);
                    }

                    if (event.key === 'Escape') {
                      setQuery('');
                      setIsSearchActive(false);
                      setIsHeroMotionPaused(false);
                    }
                  }}
                  placeholder="Describe how you feel (e.g., 'back pain' or 'malaria symptoms')..."
                  className="h-16 w-full rounded-2xl border border-white/14 bg-slate-950/[0.84] pl-14 pr-5 text-base text-white shadow-[0_20px_48px_rgba(2,8,23,0.38)] outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-400/[0.12]"
                />
              </label>

              <div className="hero-breathe hero-breathe-delay-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => runPrimarySearch(query)}
                  className="inline-flex min-h-16 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 px-6 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(56,189,248,0.28)] transition duration-200 hover:shadow-[0_24px_55px_rgba(16,185,129,0.26)] sm:min-w-[148px]"
                >
                  Search
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="hero-breathe hero-breathe-delay-2">
                <div className="rounded-[24px] border border-emerald-200/28 bg-[linear-gradient(145deg,rgba(34,197,94,0.2)_0%,rgba(56,189,248,0.16)_44%,rgba(14,165,233,0.18)_100%)] px-4 py-4 text-center shadow-[0_18px_40px_rgba(16,185,129,0.16)] backdrop-blur-xl">
                  <div className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-50">
                    Online Booking Bonus
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white sm:text-base">
                    {HEALTH_DISCOUNT_HEADLINE}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-cyan-50/90 sm:text-sm">
                    {HEALTH_DISCOUNT_NOTE}
                  </p>
                </div>
              </div>

              <div className="text-center text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
                Quick Tags
              </div>

              <div className="mt-3 hidden flex-wrap items-center justify-center gap-3 sm:flex">
                {DISCOVERY_QUICK_TAGS.map((tag, index) => {
                  const isActive = query.trim().toLowerCase() === tag.query.toLowerCase();

                  return (
                    <button
                      key={tag.label}
                      type="button"
                      onClick={() => {
                        setQuery(tag.query);
                        focusSearch();
                      }}
                      className={cn(
                        'hero-breathe min-h-12 rounded-full border px-4 py-2 text-sm font-medium transition duration-200',
                        HERO_BREATHE_DELAY_CLASSES[index % HERO_BREATHE_DELAY_CLASSES.length],
                        isActive
                          ? 'border-cyan-300/40 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(16,185,129,0.18))] text-cyan-50'
                          : 'border-white/10 bg-white/[0.05] text-slate-200 hover:border-cyan-300/30 hover:bg-cyan-300/[0.08]',
                      )}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>

              <div
                className="mt-3 -mx-4 overflow-x-auto px-4 pb-1 sm:hidden [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none' }}
              >
                <div className="flex w-max items-center gap-3 pr-4">
                  {DISCOVERY_QUICK_TAGS.map((tag, index) => {
                    const isActive = query.trim().toLowerCase() === tag.query.toLowerCase();

                    return (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => {
                          setQuery(tag.query);
                          focusSearch();
                        }}
                        className={cn(
                          'hero-breathe min-h-12 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition duration-200',
                          HERO_BREATHE_DELAY_CLASSES[index % HERO_BREATHE_DELAY_CLASSES.length],
                          isActive
                            ? 'border-cyan-300/40 bg-[linear-gradient(135deg,rgba(34,211,238,0.2),rgba(16,185,129,0.18))] text-cyan-50'
                            : 'border-white/10 bg-white/[0.05] text-slate-200',
                        )}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                  className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/[0.78] shadow-[0_30px_90px_rgba(2,8,23,0.48)] backdrop-blur-xl"
                >
                  <div className="border-b border-white/[0.08] px-4 py-4 sm:px-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          {hasSearchQuery ? 'Suggested Tests' : 'Popular Starting Points'}
                        </div>
                        <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
                          {hasSearchQuery
                            ? `Matches for "${trimmedQuery}"`
                            : 'Start with one of these commonly requested tests'}
                        </h2>
                      </div>
                      <div className="text-sm text-slate-400">
                        {results.length} {results.length === 1 ? 'result' : 'results'}
                      </div>
                    </div>
                  </div>

                  <div
                    className="max-h-[58vh] overflow-y-auto overscroll-contain px-4 py-4 sm:max-h-[56vh] sm:px-5 sm:py-5"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {results.length > 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {results.map((result, index) => (
                          <motion.div
                            key={result.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <Link
                              to={result.route}
                              className={cn(
                                'hero-breathe group flex h-full flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-4 transition duration-200 hover:border-cyan-300/30 hover:bg-cyan-300/[0.07] hover:shadow-[0_24px_55px_rgba(34,211,238,0.12)]',
                                HERO_BREATHE_DELAY_CLASSES[index % HERO_BREATHE_DELAY_CLASSES.length],
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <span
                                  className="inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
                                  style={{
                                    borderColor: `${result.accentColor}66`,
                                    color: result.accentColor,
                                    backgroundColor: `${result.accentColor}14`,
                                  }}
                                >
                                  {result.categoryTitle}
                                </span>
                                {result.popular && (
                                  <span className="text-xs font-medium text-cyan-200">
                                    Popular
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-4 text-base font-semibold text-white sm:text-lg">
                                {result.name}
                              </h3>
                              <p className="mt-2 text-sm leading-6 text-slate-300">
                                {result.description}
                              </p>

                              <div className="mt-5 flex items-center justify-between gap-3">
                                <span className="text-xs text-slate-500">
                                  Local keyword and fuzzy match
                                </span>
                                <span className="inline-flex h-11 items-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 text-sm font-semibold text-cyan-100 transition duration-200 group-hover:border-emerald-300/30 group-hover:bg-emerald-300/[0.12] group-hover:text-emerald-100">
                                  View Details
                                  <ArrowRight className="h-4 w-4" />
                                </span>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="hero-breathe hero-breathe-delay-3 rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-center">
                        <div className="text-base font-semibold text-white">
                          No close matches yet
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Try terms like &quot;pregnancy check&quot;, &quot;persistent cough&quot;, or &quot;lower back pain&quot;.
                        </p>
                      </div>
                    )}

                    <div className="hero-breathe hero-breathe-delay-4 mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-50">
                      This tool provides suggestions based on common medical data. Please consult our professionals for a final diagnosis.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
            className="mx-auto mt-8 flex max-w-[820px] items-center justify-center"
          >
            <Link
              to="/services"
              className="hero-breathe hero-breathe-delay-1 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),rgba(16,185,129,0.14))] px-5 py-3 font-medium text-white shadow-[0_18px_40px_rgba(34,211,238,0.12)] transition duration-200 hover:border-cyan-300/30 hover:shadow-[0_22px_48px_rgba(16,185,129,0.16)]"
            >
              Browse all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="mx-auto mt-10 grid max-w-[980px] grid-cols-2 gap-3 lg:grid-cols-4">
            {heroStats.map(({ value, label, icon: Icon, cardClass, iconClass }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.28 + index * 0.08 }}
                className="h-full"
              >
                <div
                  className={cn(
                    'hero-breathe h-full rounded-[24px] border p-4 backdrop-blur-xl',
                    HERO_BREATHE_DELAY_CLASSES[index % HERO_BREATHE_DELAY_CLASSES.length],
                    cardClass,
                  )}
                >
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-2xl', iconClass)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-2xl font-semibold text-white sm:text-[1.75rem]">
                    {value}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
