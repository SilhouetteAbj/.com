import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router';
import { Calendar, MessageCircle } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

interface ScanPrepItem {
  id: string;
  label: string;
  icon: string;
  steps: string[];
  duration: string;
}

const scanPrep: ScanPrepItem[] = [
  {
    id: '4d-ultrasound',
    label: '4D Ultrasound',
    icon: '🫀',
    steps: [
      'Drink 4-6 glasses of water 1 hour before your appointment',
      'Do not empty your bladder before the scan',
      'Eat normally — no special diet required',
      'Bring your previous scan reports if available',
      'Consider bringing a family member to share the experience',
    ],
    duration: '20-30 minutes',
  },
  {
    id: 'colonoscopy',
    label: 'Colonoscopy',
    icon: '🩺',
    steps: [
      'Follow a clear liquid diet the day before the procedure',
      'Take the prescribed bowel preparation medication',
      'Do not eat or drink anything after midnight',
      'Arrange for someone to drive you home afterward',
      'Inform your doctor of all current medications',
    ],
    duration: '30-60 minutes',
  },
  {
    id: 'mammogram',
    label: 'Mammogram',
    icon: '🎗️',
    steps: [
      'Do not wear deodorant, lotion, or powder on the day',
      'Wear a two-piece outfit for easy dressing',
      'Avoid scheduling during your menstrual period',
      'Inform staff if you are pregnant or breastfeeding',
      'Bring previous mammogram images for comparison',
    ],
    duration: '15-20 minutes',
  },
  {
    id: 'dna',
    label: 'DNA Testing',
    icon: '🧬',
    steps: [
      'Avoid eating, drinking, or smoking 30 min before sample',
      'Bring a valid photo ID to your appointment',
      'For paternity tests, bring the child and alleged father',
      'No special preparation needed for blood DNA tests',
      'Results are kept strictly confidential',
    ],
    duration: '10-15 minutes',
  },
];

export function ScanPrepAssistant() {
  const [selectedScan, setSelectedScan] = useState<ScanPrepItem>(scanPrep[0]);

  return (
    <section className="py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 dot-overlay-lg" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <FadeInSection className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 rounded-full text-sm font-semibold mb-4">Interactive Tool</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Scan Preparation Assistant</h2>
          <p className="text-blue-200 max-w-2xl mx-auto">Select your upcoming diagnostic test to see exactly how to prepare for a successful scan.</p>
        </FadeInSection>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 w-full max-w-5xl justify-items-center">
            {scanPrep.map((scan) => (
              <motion.button
                key={scan.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedScan(scan)}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold text-center transition-all duration-200 ${
                  selectedScan.id === scan.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/10 text-blue-200 hover:bg-white/20 border border-white/10'
                }`}
              >
                <span className="block text-xl mb-1">{scan.icon}</span>
                {scan.label}
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedScan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 w-full max-w-5xl mx-auto"
          >
            <div className="flex flex-col items-center gap-2 mb-6 text-center">
              <span className="text-3xl">{selectedScan.icon}</span>
              <div>
                <h3 className="text-white font-bold text-xl">{selectedScan.label} Preparation</h3>
                <p className="text-blue-300 text-sm">Estimated duration: {selectedScan.duration}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center">
              {selectedScan.steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex flex-col items-center text-center gap-2 bg-white/10 rounded-xl p-4 w-full max-w-sm"
                >
                  <div className="w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-blue-100 text-sm">{step}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Link to="/booking" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm">
                <Calendar className="w-4 h-4" />
                Book {selectedScan.label}
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all text-sm">
                <MessageCircle className="w-4 h-4" />
                Ask Questions
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
