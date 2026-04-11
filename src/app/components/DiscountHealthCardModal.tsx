import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import html2canvas from 'html2canvas';
import { Download, ExternalLink, MapPin, Phone, Ticket, X } from 'lucide-react';

import {
  createDiscountVoucherId,
  formatDiscountIssueDate,
  HEALTH_DISCOUNT_CARD_TITLE,
  HEALTH_DISCOUNT_NOTE,
  SILHOUETTE_CONTACT_NUMBERS,
  SILHOUETTE_FACILITY_ADDRESS,
  SILHOUETTE_FACILITY_MAP_URL,
  SILHOUETTE_FACILITY_NAME,
  SILHOUETTE_LOGO_SRC,
} from '@/app/data/discountPromotion';
import { trackContactClick } from '@/app/lib/analyticsStore';

type DiscountActionIntent = 'booking' | 'whatsapp';

type Props = {
  open: boolean;
  intent: DiscountActionIntent | null;
  bookingUrl: string;
  whatsappUrl: string;
  testName: string;
  categoryTitle: string;
  onClose: () => void;
  onActionComplete: () => void;
};

const MEDICAL_BLUE = '#0052FF';
const MEDICAL_BLUE_SOFT = '#38BDF8';

const medicalPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='260' viewBox='0 0 200 260'%3E%3Cg fill='none' stroke='%230052FF' stroke-opacity='.08' stroke-width='2'%3E%3Cpath d='M18 34h18M27 25v18'/%3E%3Cpath d='M144 28c8 0 13 6 13 13 0 11-13 20-13 20s-13-9-13-20c0-7 5-13 13-13Z'/%3E%3Cpath d='M35 134h40l10-14 11 28 11-18h38'/%3E%3Crect x='138' y='114' width='28' height='36' rx='10'/%3E%3Cpath d='M152 124v16M144 132h16'/%3E%3Ccircle cx='52' cy='210' r='15'/%3E%3Cpath d='M140 214h28M154 200v28'/%3E%3Cpath d='M32 226h34l7-12 8 23 9-16h27'/%3E%3C/g%3E%3C/svg%3E")`;

export function DiscountHealthCardModal({
  open,
  intent,
  bookingUrl,
  whatsappUrl,
  testName,
  categoryTitle,
  onClose,
  onActionComplete,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [issueDate, setIssueDate] = useState('');
  const [voucherId, setVoucherId] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!open || !intent) return;

    const now = new Date();
    setIssueDate(formatDiscountIssueDate(now));
    setVoucherId(createDiscountVoucherId(now));
  }, [open, intent, testName, categoryTitle]);

  const handleDownload = async () => {
    if (!cardRef.current || !voucherId) return;

    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        useCORS: true,
        scale: Math.max(2, Math.min(window.devicePixelRatio || 1, 3)),
        logging: false,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `silhouette-health-discount-${voucherId.toLowerCase()}.png`;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!open || !intent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60]"
      >
        <button
          type="button"
          aria-label="Close discount card modal"
          onClick={onClose}
          className="absolute inset-0 bg-[rgba(2,8,23,0.72)]"
          style={{ backdropFilter: 'blur(10px)' }}
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="relative w-full max-w-md"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-1 top-1 z-10 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-slate-950/70 text-white shadow-lg transition hover:bg-slate-900"
              aria-label="Close discount card"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="rounded-[32px] border border-white/10 bg-[rgba(10,19,37,0.86)] p-3 shadow-[0_28px_90px_rgba(2,8,23,0.55)] backdrop-blur-xl sm:p-4">
              <div
                ref={cardRef}
                className="relative mx-auto aspect-[0.66] w-full max-w-[340px] overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-[0_16px_50px_rgba(0,82,255,0.18)]"
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,82,255,0.06)_0%,rgba(255,255,255,0)_26%,rgba(0,82,255,0.04)_100%)]" />
                <div
                  className="absolute inset-[22%_0_0_0] opacity-100"
                  style={{ backgroundImage: medicalPattern }}
                />

                <div className="relative flex h-full flex-col">
                  <div
                    className="px-5 pb-5 pt-6 text-white"
                    style={{ background: `linear-gradient(135deg, ${MEDICAL_BLUE} 0%, ${MEDICAL_BLUE_SOFT} 100%)` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">
                          {SILHOUETTE_FACILITY_NAME}
                        </div>
                        <div className="mt-2 text-xl font-bold leading-tight text-white">
                          Digital Discount Identity Card
                        </div>
                      </div>
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/25 bg-white/18">
                        <img
                          src={SILHOUETTE_LOGO_SRC}
                          alt="Silhouette Diagnostics logo"
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
                    <div className="rounded-[24px] border border-blue-100 bg-white/88 px-4 py-4 shadow-[0_12px_28px_rgba(0,82,255,0.08)] backdrop-blur-sm">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-500">
                        Online Booking Benefit
                      </div>
                      <div className="mt-3 text-[1.45rem] font-black leading-tight text-blue-700">
                        {HEALTH_DISCOUNT_CARD_TITLE}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Present this digital card at the center after your online booking to claim your healthcare offer.
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-blue-100 bg-blue-50/90 px-3 py-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-500">
                          Date of Issue
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-800">
                          {issueDate}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-blue-100 bg-blue-50/90 px-3 py-3">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-500">
                          Voucher ID
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-800">
                          {voucherId}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[24px] border border-blue-100 bg-white/92 px-4 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-500">
                        <Ticket className="h-3.5 w-3.5" />
                        Linked Booking
                      </div>
                      <div className="mt-2 text-sm font-semibold text-slate-900">
                        {testName}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {categoryTitle}
                      </div>
                    </div>

                    <div className="mt-4 rounded-[24px] border border-blue-100 bg-blue-950 px-4 py-4 text-white">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-200">
                        Facility Information
                      </div>
                      <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-blue-50">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-200" />
                        <span>{SILHOUETTE_FACILITY_ADDRESS}</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {SILHOUETTE_CONTACT_NUMBERS.map((phone) => (
                          <div key={phone} className="flex items-center gap-2 text-xs text-blue-50">
                            <Phone className="h-3.5 w-3.5 text-blue-200" />
                            <span>{phone}</span>
                          </div>
                        ))}
                      </div>
                      <a
                        href={SILHOUETTE_FACILITY_MAP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-2 text-[11px] font-semibold tracking-[0.16em] text-white"
                      >
                        Google Map Location
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <div className="mt-auto pt-4 text-center text-[11px] leading-5 text-slate-500">
                      {HEALTH_DISCOUNT_NOTE}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="mt-4 flex flex-col gap-3"
                style={{ paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom))' }}
              >
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-[0_14px_40px_rgba(0,82,255,0.16)] transition hover:bg-blue-50 disabled:cursor-wait disabled:opacity-70"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? 'Preparing Card...' : 'Download My Discount Card'}
                </button>

                {intent === 'booking' ? (
                  <Link
                    to={bookingUrl}
                    onClick={onActionComplete}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                    style={{ background: `linear-gradient(135deg, ${MEDICAL_BLUE} 0%, ${MEDICAL_BLUE_SOFT} 100%)` }}
                  >
                    Continue to Booking
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                ) : (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackContactClick('whatsapp');
                      onActionComplete();
                    }}
                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#25D366]/30 bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    Continue to WhatsApp Chat
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DiscountHealthCardModal;
