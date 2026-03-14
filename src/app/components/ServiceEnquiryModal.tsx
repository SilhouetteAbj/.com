import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router';
import { trackContactClick } from '@/app/lib/analyticsStore';

interface ServiceEnquiryModalProps {
  isOpen: boolean;
  service: {
    name: string;
    desc: string;
  } | null;
  onClose: () => void;
}

export function ServiceEnquiryModal({
  isOpen,
  service,
  onClose,
}: ServiceEnquiryModalProps) {
  if (!service) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 relative">
                <button
                  onClick={onClose}
                  title="Close modal"
                  aria-label="Close service enquiry modal"
                  className="absolute top-4 right-4 p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <h2 className="text-xl font-bold text-white pr-8">{service.name}</h2>
                <p className="text-blue-100 text-sm mt-2">{service.desc}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-6">
                  How would you like to inquire about this service?
                </p>

                <div className="space-y-3">
                  {/* Chat Button */}
                  <Link
                    to="/support"
                    onClick={onClose}
                    className="block w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900">Live Chat Support</div>
                          <div className="text-xs text-gray-500">Chat with our customer care team</div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>

                  {/* WhatsApp Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const message = `Hi, I'd like to inquire about ${service.name}. ${service.desc}`;
                      const encodedMessage = encodeURIComponent(message);
                      window.open(
                        `https://wa.me/2348000000000?text=${encodedMessage}`,
                        '_blank'
                      );
                      trackContactClick('whatsapp');
                      onClose();
                    }}
                    className="w-full p-4 rounded-xl border-2 border-green-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                        <Send className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">WhatsApp</div>
                        <div className="text-xs text-gray-500">Message us on WhatsApp</div>
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Close Text */}
                <p className="text-center text-xs text-gray-400 mt-6">
                  You can close this modal by clicking outside or the X button
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
