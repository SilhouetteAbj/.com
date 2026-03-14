import { useState } from 'react';
import { useMetaTags } from '@/hooks/useMetaTags';
import { motion } from 'motion/react';
import type { FormEvent } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle, Send } from 'lucide-react';

export function Contact() {
  useMetaTags({
    title: 'Contact Us - Silhouette Diagnostics',
    description: 'Get in touch with Silhouette Diagnostics. Reach out for inquiries, appointments, or partnerships.',
    keywords: 'contact, inquiries, support, medical services',
    ogTitle: 'Contact Silhouette Diagnostics',
    ogDescription: 'Get in touch with our professional medical team',
    canonical: `${window.location.origin}/contact`,
  });

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-semibold mb-4">Contact Us</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get In Touch</h1>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">We're here to help. Reach out for appointments, inquiries, or general information.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-5">
            {[
              { icon: MapPin, title: 'Our Location', content: 'NO12 kudang street of monrovia street, wuse2 Abuja Nigeria', color: 'text-blue-600 bg-blue-50' },
              { icon: Phone, title: 'Phone Numbers', content: '+2349030002653\n+2348101196774', color: 'text-cyan-600 bg-cyan-50' },
              { icon: Mail, title: 'Email Address', content: 'silhouetteradiodiagnostics@gmail.com', color: 'text-indigo-600 bg-indigo-50' },
              { icon: Clock, title: 'Business Hours', content: '24 Hours - Monday to Sunday', color: 'text-emerald-600 bg-emerald-50' },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</div>
                  <div className="text-gray-500 text-sm whitespace-pre-line">{item.content}</div>
                </div>
              </motion.div>
            ))}

            {/* Abuja Branch Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg1o4tEVjZivOS7MqK5w8PAlQMe7LPVqjmxQ&s"
                alt="Silhouette Diagnostics Abuja Branch"
                className="w-full h-52 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <div className="text-sm font-semibold text-gray-900">Abuja Branch</div>
                <div className="text-xs text-gray-500 mt-1">Wuse 2, Abuja</div>
              </div>
            </div>

            {/* Map link */}
            <a
              href="https://maps.app.goo.gl/LBwrBPigCKHQKg4AA?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-52 relative block"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">Wuse 2, Abuja</p>
                  <p className="text-xs text-gray-400 mt-1">Tap to open Google Maps</p>
                </div>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Message Sent!</h2>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold">
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+234 800 000 0000" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                    <select aria-label="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                      <option value="">Select subject...</option>
                      <option>Appointment Inquiry</option>
                      <option>Test Results</option>
                      <option>Service Information</option>
                      <option>Pricing</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </motion.button>
              </motion.form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
