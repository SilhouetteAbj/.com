import { Activity } from 'lucide-react';

const popularTests = [
  '24-hour Holter Monitoring',
  '48-hour Holter Monitoring',
  'Event Recorder',
  'Extended Holter Monitoring',
];

const faqs = [
  {
    question: 'What is Holter ECG?',
    answer: 'Holter ECG is a continuous recording of heart’s electrical activity over 24–48 hours using a portable device.'
  },
  {
    question: 'Why is Holter monitoring done?',
    answer: 'It helps detect irregular heart rhythms that may not show up during a standard ECG.'
  },
  {
    question: 'Is Holter monitoring uncomfortable?',
    answer: 'The device is lightweight and non-invasive, but you may feel the electrodes on your skin.'
  },
  {
    question: 'Can I shower with a Holter monitor?',
    answer: 'No, you should avoid getting the device wet.'
  },
];

export default function HolterECGCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500">
              <Activity className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Holter ECG</h1>
          <p className="text-orange-100 text-lg mb-2">Holter ECG is a test that continuously records your heart’s electrical activity for 24–48 hours. It is used to detect arrhythmias and monitor heart health over time.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under Holter ECG</h2>
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
