import { Activity } from 'lucide-react';

const popularTests = [
  'Resting ECG',
  'Exercise (Stress) ECG',
  'Ambulatory ECG',
  'Signal-Averaged ECG',
  'Holter Monitoring',
];

const faqs = [
  {
    question: 'What is an ECG?',
    answer: 'An Electrocardiogram (ECG) records the electrical activity of the heart to detect abnormalities.'
  },
  {
    question: 'Is an ECG painful?',
    answer: 'No, ECG is a non-invasive and painless test.'
  },
  {
    question: 'How long does an ECG take?',
    answer: 'A standard ECG usually takes 5–10 minutes.'
  },
  {
    question: 'Why might I need an ECG?',
    answer: 'ECG is used to diagnose heart conditions, monitor heart health, and guide treatment.'
  },
];

export default function ECGCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-green-500 to-teal-500 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-teal-500">
              <Activity className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">ECG</h1>
          <p className="text-teal-100 text-lg mb-2">Electrocardiogram (ECG) is a test that measures the electrical activity of your heart. It helps diagnose arrhythmias, heart attacks, and other cardiac conditions.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under ECG</h2>
        <div className="grid gap-4 mb-8">
          {popularTests.map((test) => (
            <div key={test} className="bg-white rounded-xl shadow border border-gray-100 p-4 text-gray-800 font-medium">
              {test}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Frequently Asked Questions</h2>
          <ul>
            {faqs.map((faq, idx) => (
              <li key={idx} className="mb-4">
                <strong className="block text-gray-900 mb-1">Q: {faq.question}</strong>
                <span className="text-gray-700">A: {faq.answer}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
