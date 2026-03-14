import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MessageCircle, ArrowRight } from 'lucide-react';

const MRI_IMG = 'https://images.unsplash.com/photo-1587010580103-fd86b8ea14ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBNUkklMjBzY2FubmVyJTIwaG9zcGl0YWwlMjBtZWRpY2FsJTIwaW1hZ2luZ3xlbnwxfHx8fDE3NzI3MDE1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080';
const DNA_IMG = 'https://images.unsplash.com/photo-1655210913810-33acfa96d1e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxETkElMjBoZWxpeCUyMGdlbmV0aWNzJTIwdGVzdGluZyUyMGxhYm9yYXRvcnl8ZW58MXx8fHwxNzcyNzAxNTQxfDA&ixlib=rb-4.1.0&q=80&w=1080';

const stats = [
  { value: '15,000+', label: 'Patients Served' },
  { value: '50+', label: 'Expert Specialists' },
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '24h', label: 'Result Turnaround' },
];

type Mode = 'medical' | 'dna';

function ChatWithSupportButton({ mode }: { mode: Mode }) {
  return (
    <Link
      to="/support"
      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200"
    >
      <MessageCircle className="w-5 h-5" />
      {mode === 'medical' ? 'Chat With Support' : 'Chat with DNA Specialist'}
    </Link>
  );
}

export function HeroSection() {
  const [mode, setMode] = useState<Mode>('medical');

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={mode}
              src={mode === 'medical' ? MRI_IMG : DNA_IMG}
              alt="hero"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/70 to-blue-800/40" />
          {/* Animated grid overlay */}
          <div className="absolute inset-0 opacity-10 grid-overlay" />
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/40 rounded-full"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="flex flex-col items-center text-center">
            {/* Mode Toggle - Centered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-8 border border-white/20"
            >
              {(['medical', 'dna'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    mode === m
                      ? 'bg-white text-blue-900 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {m === 'medical' ? '🏥 Medical Diagnostics' : '🧬 DNA Testing'}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">
                  {mode === 'medical' ? (
                    <>Advanced Diagnostic<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Imaging & Lab</span><br />Services You Can Trust</>
                  ) : (
                    <>Accurate &<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Confidential</span><br />DNA Testing</>
                  )}
                </h1>

                <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-xl">
                  {mode === 'medical'
                    ? 'State-of-the-art diagnostic equipment, certified specialists, and fast results — all in one modern facility designed for your health.'
                    : 'Paternity, immigration, and family DNA testing with laboratory-certified accuracy and complete confidentiality guaranteed.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-blue-200 text-xs">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Buttons Section - Below Hero */}
      <AnimatePresence mode="wait">
        <motion.section
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-blue-900 to-blue-800 py-12 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-200">
                <Calendar className="w-5 h-5" />
                {mode === 'medical' ? 'Book Appointment' : 'Book DNA Test'}
              </Link>
              <ChatWithSupportButton mode={mode} />
              <Link to="/services" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-900 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200">
                View Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </>
  );
}
