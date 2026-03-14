import { useState } from 'react';
import { useMetaTags } from '@/hooks/useMetaTags';
import { motion, AnimatePresence } from 'motion/react';
import type { FormEvent } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ArrowRight, Search } from 'lucide-react';
import { trackLiveAction, trackTestSelection } from '@/app/lib/analyticsStore';
import { supabase } from '@/app/lib/supabaseClient';
import { SERVICE_CATEGORIES } from '@/app/data/servicesData';

const timeSlots = ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const generateAppointmentId = () => {
  const stamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12);
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `APT-${stamp}-${rand}`;
};

const saveAppointment = async (appointment: {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}) => {
  await supabase.from('appointments').insert({
    id: appointment.id,
    name: appointment.name,
    phone: appointment.phone,
    email: appointment.email,
    service: appointment.service,
    date: appointment.date,
    time: appointment.time,
    notes: appointment.notes,
    status: appointment.status,
    created_at: appointment.createdAt,
  });
};

export function Booking() {
  useMetaTags({
    title: 'Book an Appointment - Silhouette Diagnostics',
    description: 'Schedule your diagnostic appointment with Silhouette Diagnostics. Fast, convenient, and professional medical services.',
    keywords: 'booking, appointments, medical services, diagnostic tests',
    ogTitle: 'Book Your Diagnostic Appointment',
    ogDescription: 'Schedule your appointment at Silhouette Diagnostics',
    canonical: `${window.location.origin}/booking`,
  });

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const [serviceSearch, setServiceSearch] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (form.phone.trim() && !/^[+\d\-\s()]+$/.test(form.phone)) e.phone = 'Please enter a valid phone number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address';
    if (!form.service) e.service = 'Please select a service';
    if (!form.date) e.date = 'Please select a date';
    if (!form.time) e.time = 'Please select a time';
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const appointment = {
      id: generateAppointmentId(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      service: form.service,
      date: form.date,
      time: form.time,
      notes: form.notes.trim(),
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    await saveAppointment(appointment);
    trackLiveAction('booking');
    if (form.service) {
      trackTestSelection(form.service);
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  const today = new Date().toISOString().split('T')[0];
  const serviceOptions = SERVICE_CATEGORIES.flatMap((category) => ([
    { value: category.title, label: `${category.title} (Category)`, category: category.title },
    ...category.tests.map((test) => ({
      value: test.name,
      label: `${test.name} — ${category.title}`,
      category: category.title,
    })),
  ]));
  const normalizedServiceSearch = serviceSearch.trim().toLowerCase();
  const filteredServices = normalizedServiceSearch
    ? serviceOptions.filter((option) => option.label.toLowerCase().includes(normalizedServiceSearch))
    : serviceOptions;
  const serviceSuggestions = filteredServices.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-cyan-800 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-semibold mb-4">Book an Appointment</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Schedule Your Test</h1>
            <p className="text-blue-100 text-lg">Fill out the form below and our team will confirm your appointment within 2 hours.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-12 shadow-xl border border-green-100 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Appointment Request Received!</h2>
              <p className="text-gray-500 text-lg mb-2">
                Thank you, <span className="font-semibold text-blue-700">{form.name}</span>!
              </p>
              <p className="text-gray-500 mb-6">
                We've received your request for a <strong>{form.service}</strong> on <strong>{form.date}</strong> at <strong>{form.time}</strong>.
                Our team will call you at <strong>{form.phone}</strong> to confirm your appointment within 2 hours.
              </p>
              <div className="bg-blue-50 rounded-2xl p-5 mb-8 text-left">
                <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
                <ul className="space-y-2">
                  {[
                    'Our team will call to confirm your appointment',
                    'You\'ll receive preparation instructions for your test',
                    'WhatsApp reminder will be sent 24h before your appointment',
                    'Arrive 15 minutes early on the day of your test',
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                      <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', service: '', date: '', time: '', notes: '' }); }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Book Another Appointment
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Patient Information</h2>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+234 800 000 0000"
                          className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Service Requested <span className="text-red-500">*</span>
                      </label>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          placeholder="Search tests or categories..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      {serviceSuggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {serviceSuggestions.map((option) => (
                            <button
                              key={option.label}
                              type="button"
                              onClick={() => {
                                setForm({ ...form, service: option.value });
                                setServiceSearch(option.label);
                              }}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full hover:bg-blue-100"
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                      )}
                      <select
                        aria-label="Service Requested"
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${errors.service ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      >
                        <option value="">Select a service...</option>
                        {filteredServices.map((option) => (
                          <option key={option.label} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
                    </div>

                    {/* Date & Time */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Preferred Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            aria-label="Preferred Date"
                            type="date"
                            min={today}
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                          />
                        </div>
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Preferred Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            aria-label="Preferred Time"
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white ${errors.time ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                          >
                            <option value="">Select time...</option>
                            {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Additional Notes <span className="text-gray-400 text-xs">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Any medical history, current medications, or special requirements..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Confirm Appointment <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" /> +2349030002653</div>
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-blue-600" /> +2348101196774</div>
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600" /> silhouetteradiodiagnostics@gmail.com</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-4">Business Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Sunday</span>
                        <span className="font-medium text-gray-900">24 Hours</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3">What to Expect</h3>
                    <ul className="space-y-2">
                      {[
                        'Confirmation call within 2 hours',
                        'Preparation instructions via WhatsApp',
                        'Reminder 24h before appointment',
                        'Results within 24-48 hours',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
