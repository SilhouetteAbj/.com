import { Heart } from 'lucide-react';

const popularTests = [
  'Transthoracic Echocardiogram (TTE)',
  'Transesophageal Echocardiogram (TEE)',
  'Stress Echocardiogram',
  'Doppler Echocardiogram',
  'Fetal Echocardiogram',
];

const faqs = [
  {
    question: 'What is an echocardiogram?',
    answer: 'An echocardiogram uses ultrasound waves to create images of the heart, helping assess its structure and function.'
  },
  {
    question: 'Is an echocardiogram safe?',
    answer: 'Yes, it is a safe and non-invasive procedure.'
  },
  {
    question: 'How long does an echocardiogram take?',
    answer: 'Most echocardiograms take 30–60 minutes.'
  },
  {
    question: 'Why might I need an echocardiogram?',
    answer: 'It helps diagnose heart conditions, monitor heart function, and guide treatment.'
  },
];

export default function ECHOCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-500 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500">
              <Heart className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">ECHO</h1>
          <p className="text-rose-100 text-lg mb-2">Echocardiography is an ultrasound-based test that visualizes the heart’s chambers, valves, and blood flow. It is essential for diagnosing and monitoring heart diseases.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under ECHO</h2>
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
