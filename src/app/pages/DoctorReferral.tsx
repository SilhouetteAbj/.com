import { useState } from 'react';
import { useMetaTags } from '@/hooks/useMetaTags';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

const SLIDES = [
  {
    title: 'Earn Professional Rewards',
    desc: 'Refer your patients to Silhouette Diagnostics and unlock professional rewards, priority reporting, and direct specialist support.',
    cta: 'Next',
    image:
      'https://images.unsplash.com/photo-1762237798212-bcc000c00891?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Track Every Referral',
    desc: 'Your referrals are logged with clear status updates. Patients get fast scheduling and reports within 24-48 hours.',
    cta: 'Next',
    image:
      'https://images.unsplash.com/photo-1770836037622-11643462bc1d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Start Referring Patients',
    desc: 'Launch your referral onboarding and activate your professional partnership in minutes.',
    cta: 'Start Referring',
    image:
      'https://images.unsplash.com/photo-1769072610024-5b8a50f05c73?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export function DoctorReferral() {
  useMetaTags({
    title: 'Doctor Referral Program - Silhouette Diagnostics',
    description: 'Refer your patients to Silhouette Diagnostics and unlock professional rewards with priority reporting.',
    keywords: 'doctor referral, medical referral, diagnostic services for physicians',
    ogTitle: 'Doctor Referral Program',
    ogDescription: 'A premium referral flow for healthcare professionals',
    canonical: `${window.location.origin}/doctor-referral`,
  });

  const [step, setStep] = useState(0);

  const slide = SLIDES[step];
  const total = SLIDES.length;
  const isLast = step === total - 1;

  const handlePrimary = () => {
    if (!isLast) {
      setStep((s) => Math.min(total - 1, s + 1));
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white overflow-x-hidden overscroll-y-contain">
      {/* Mobile Immersive Flow */}
      <div className="lg:hidden relative min-h-[100dvh] overflow-hidden">
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 bg-black/70 text-white text-sm font-semibold rounded-full border border-white/20"
        >
          Back to Home
        </Link>
        <AnimatePresence mode="wait">
          <motion.img
            key={slide.image}
            src={slide.image}
            alt="Medical professional"
            initial={{ opacity: 0.2, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-x-0 bottom-0 bg-black/95 px-6 py-10 rounded-t-3xl"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-white' : 'w-3 bg-white/30'}`}
                />
              ))}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{slide.title}</h1>
            <p className="text-sm text-white/80 max-w-sm">{slide.desc}</p>
            {isLast ? (
              <Link
                to="/doctor-referral/dashboard"
                className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl w-full"
              >
                Start Refering <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={handlePrimary}
                className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-xl w-full"
              >
                {slide.cta} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Desktop 60/40 Split Modal */}
      <div className="hidden lg:block w-full h-screen relative">
        <Link
          to="/"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 bg-black/70 text-white text-sm font-semibold rounded-full border border-white/20"
        >
          Back to Home
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-screen grid grid-cols-5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-3 relative"
            >
              <img src={slide.image} alt="Medical portrait" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            </motion.div>
          </AnimatePresence>

          <div className="col-span-2 bg-[#05070D] text-white flex flex-col items-center justify-center px-16 text-center gap-5">
            <div className="flex items-center gap-2">
              {SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-white' : 'w-3 bg-white/30'}`}
                />
              ))}
            </div>
            <h1 className="text-5xl font-bold tracking-tight">{slide.title}</h1>
            <p className="text-base text-white/75 max-w-md">{slide.desc}</p>
            {isLast ? (
              <Link
                to="/doctor-referral/dashboard"
                className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl w-full max-w-sm"
              >
                Start Refering <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={handlePrimary}
                className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-xl w-full max-w-sm"
              >
                {slide.cta} <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <div className="text-xs text-white/50">For licensed healthcare professionals only</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DoctorReferral;
