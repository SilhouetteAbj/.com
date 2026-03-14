import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, MessageCircle, MessageSquare, Phone, X } from 'lucide-react';
import { trackContactClick } from '@/app/lib/analyticsStore';

type Props = {
  testName: string | null;
  categoryTitle: string;
  onClose: () => void;
};

export function TestCTAModal({ testName, categoryTitle, onClose }: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!testName) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [testName, onClose]);

  const whatsappText = useMemo(() => {
    if (!testName) return '';
    return encodeURIComponent(
      `Hello Silhouette Diagnostics, I'd like to enquire about the ${testName} test (${categoryTitle}). Please provide more information.`
    );
  }, [testName, categoryTitle]);

  if (!testName) return null;

  const bookingUrl = `/booking?test=${encodeURIComponent(testName)}&category=${encodeURIComponent(categoryTitle)}`;
  const enquiryUrl = `/contact?test=${encodeURIComponent(testName)}`;
  const whatsappUrl = `https://wa.me/2349030002653?text=${whatsappText}`;

  return (
    <AnimatePresence>
      {testName && (
        <motion.div
          key="cta-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {isMobile ? (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-center pt-3">
                <div className="h-1.5 w-12 rounded-full bg-gray-200" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0052FF] text-white">
                      {categoryTitle}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{testName}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      How would you like to proceed with this diagnostic test? Our team is available 7 days a week.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                    aria-label="Close modal"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <a
                    href={bookingUrl}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, #0052FF 0%, #00C6FF 100%)' }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </span>
                      <span>
                        Book Appointment
                        <div className="text-xs text-white/80">Schedule at your convenience</div>
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactClick('whatsapp')}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </span>
                      <span>WhatsApp Chat</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </a>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={enquiryUrl}
                      className="border-2 border-[#0052FF] text-[#0052FF] rounded-2xl px-3 py-3 text-center font-semibold"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">Make Enquiry</span>
                      </div>
                    </a>
                    <a
                      href="tel:+2349030002653"
                      onClick={() => trackContactClick('call')}
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-center font-semibold text-gray-700"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">Call Now</span>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                  {['Available 7 Days/Week', 'Fast Results', 'Confidential'].map((label) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-300" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
            >
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="h-[1.5px] w-full" style={{ background: 'linear-gradient(90deg, #0052FF, #00C6FF)' }} />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0052FF] text-white">
                        {categoryTitle}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">{testName}</h3>
                      <p className="text-sm text-gray-600 mt-2">
                        How would you like to proceed with this diagnostic test? Our team is available 7 days a week.
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
                      aria-label="Close modal"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    <a
                      href={bookingUrl}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, #0052FF 0%, #00C6FF 100%)' }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </span>
                        <span>
                          Book Appointment
                          <div className="text-xs text-white/80">Schedule at your convenience</div>
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackContactClick('whatsapp')}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </span>
                        <span>WhatsApp Chat</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-white" />
                    </a>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={enquiryUrl}
                        className="border-2 border-[#0052FF] text-[#0052FF] rounded-2xl px-3 py-3 text-center font-semibold"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">Make Enquiry</span>
                        </div>
                      </a>
                      <a
                        href="tel:+2349030002653"
                        onClick={() => trackContactClick('call')}
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 text-center font-semibold text-gray-700"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">Call Now</span>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                    {['Available 7 Days/Week', 'Fast Results', 'Confidential'].map((label) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TestCTAModal;
