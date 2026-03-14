import { Scan } from 'lucide-react';

const popularTests = [
  'Routine EEG',
  'Ambulatory EEG',
  'Sleep EEG',
  'Video EEG Monitoring',
  'Evoked Potentials',
];

const faqs = [
  {
    question: 'What is an EEG?',
    answer: 'An Electroencephalogram (EEG) records electrical activity in the brain to diagnose neurological conditions.'
  },
  {
    question: 'Is an EEG painful?',
    answer: 'No, EEG is a non-invasive and painless test.'
  },
  {
    question: 'How long does an EEG take?',
    answer: 'A routine EEG usually takes 20–60 minutes.'
  },
  {
    question: 'Why might I need an EEG?',
    answer: 'EEG is used to diagnose epilepsy, sleep disorders, and other neurological conditions.'
  },
];

export default function EEGCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600">
              <Scan className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">EEG</h1>
          <p className="text-purple-100 text-lg mb-2">Electroencephalography (EEG) is a test that measures electrical activity in the brain. It is commonly used to diagnose epilepsy, sleep disorders, and other neurological conditions.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under EEG</h2>
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
