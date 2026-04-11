import { useState } from 'react';
import { useMetaTags } from '@/hooks/useMetaTags';
import { motion } from 'motion/react';
import { Phone, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { trackContactClick, trackReferralRegistration } from '@/app/lib/analyticsStore';
import { submitReferralPartner } from '@/app/lib/publicApi';

export function DoctorReferralDashboard() {
  useMetaTags({
    title: 'Referral Dashboard - Silhouette Diagnostics',
    description: 'Health worker referral onboarding dashboard.',
    keywords: 'doctor referral, onboarding, healthcare professionals',
    ogTitle: 'Referral Dashboard',
    ogDescription: 'Join the Silhouette Diagnostics referral program',
    canonical: `${window.location.origin}/doctor-referral/dashboard`,
  });

  const [form, setForm] = useState({
    fullName: '',
    placeOfWork: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  const saveReferralPartner = async (payload: { fullName: string; placeOfWork: string; phone: string }) => {
    await submitReferralPartner(payload);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required';
    if (!form.placeOfWork.trim()) next.placeOfWork = 'Place of work is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    if (form.phone.trim() && !/^[+()\d\s-]{7,20}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number';
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSubmitError('');
    setLoading(true);
    try {
      await saveReferralPartner({
        fullName: form.fullName.trim(),
        placeOfWork: form.placeOfWork.trim(),
        phone: form.phone.trim(),
      });
      trackReferralRegistration();
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your referral registration right now.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    'Hello, I would like to enquire about the referral process for health professionals.'
  );

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white py-20 px-4 overflow-x-hidden overscroll-y-contain">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl"
        >
          {!submitted ? (
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold">Referral Dashboard</h1>
                <p className="text-white/70 mt-2">
                  Complete your professional details to activate your referral partnership.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {submitError}
                  </div>
                )}
                <div>
                  <label className="text-sm text-white/70">Full Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. First Last"
                  />
                  {errors.fullName && <p className="text-xs text-red-300 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="text-sm text-white/70">Place of Work</label>
                  <input
                    value={form.placeOfWork}
                    onChange={(e) => setForm({ ...form, placeOfWork: e.target.value })}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hospital or Clinic"
                  />
                  {errors.placeOfWork && <p className="text-xs text-red-300 mt-1">{errors.placeOfWork}</p>}
                </div>
                <div>
                  <label className="text-sm text-white/70">Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-2 w-full px-4 py-3 rounded-xl bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+234..."
                  />
                  {errors.phone && <p className="text-xs text-red-300 mt-1">{errors.phone}</p>}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">Welcome to the Partnership</h2>
                <p className="text-white/75 mt-2 max-w-2xl mx-auto">
                  You are now a partner with Silhouette Diagnostics. Our management team will contact you shortly with the referral form provision
                  and other necessary procedures.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-xl border border-white/20"
                >
                  <MessageCircle className="w-4 h-4" /> Customer Support
                </Link>
                <a
                  href="tel:+2349030002653"
                  onClick={() => trackContactClick('call')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-xl border border-white/20"
                >
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a
                  href={`https://wa.me/2349030002653?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactClick('whatsapp')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl">
                  Back to Home <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default DoctorReferralDashboard;
