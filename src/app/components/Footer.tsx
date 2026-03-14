import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/app/data/servicesData';
import { trackContactClick } from '@/app/lib/analyticsStore';

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgsnOwbpMeE0JQrY76UgyB7dmoD6z3P8_WrA&s';

const services = SERVICE_CATEGORIES.map((c) => ({
  label: c.title,
  href: `/services/category/${c.id}`,
}));

const quickLinks = [
  { label: 'Book Appointment', href: '/booking' },
  { label: 'Our Services', href: '/services' },
  { label: 'DNA Testing', href: '/dna-testing' },
  { label: 'Doctor Referral', href: '/doctor-referral' },
  { label: 'Contact Us', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-blue-950 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                <img src={LOGO_URL} alt="Silhouette Diagnostics logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Silhouette</div>
                <div className="text-blue-300 text-xs">Diagnostics Consultants</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-5">
              Premium diagnostic imaging and laboratory services you can trust. Accurate results, certified specialists, and compassionate care.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Youtube, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 bg-blue-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-500 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.label}>
                  <Link
                    to={s.href}
                    className="text-blue-300 hover:text-cyan-400 text-sm transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-cyan-500 rounded-full group-hover:w-2 transition-all duration-200" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-blue-300 hover:text-cyan-400 text-sm transition-colors duration-150 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-cyan-500 rounded-full group-hover:w-2 transition-all duration-200" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <p className="text-blue-200 text-sm">
                  NO12 kudang street of monrovia street, wuse2 Abuja Nigeria
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="tel:+2349030002653"
                  onClick={() => trackContactClick('call')}
                  className="text-blue-200 text-sm hover:text-cyan-400 transition-colors"
                >
                  +2349030002653
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="tel:+2348101196774"
                  onClick={() => trackContactClick('call')}
                  className="text-blue-200 text-sm hover:text-cyan-400 transition-colors"
                >
                  +2348101196774
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href="mailto:silhouetteradiodiagnostics@gmail.com" className="text-blue-200 text-sm hover:text-cyan-400 transition-colors">
                  silhouetteradiodiagnostics@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p>24 Hours - Monday to Sunday</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-400 text-sm text-center">
            (c) {new Date().getFullYear()} Silhouette Diagnostics Consultants. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-blue-400 hover:text-cyan-400 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-blue-400 hover:text-cyan-400 text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
