import { Scan } from 'lucide-react';

const popularTests = [
  'CT Scan',
  'MRI Scan',
  'Ultrasound Scan',
  'X-Ray',
  'PET Scan',
  'Bone Density Scan',
];

const faqs = [
  {
    question: 'What is a scan?',
    answer: 'A scan is a medical imaging test that helps visualize internal organs, tissues, and bones for diagnosis and treatment.'
  },
  {
    question: 'Are scans safe?',
    answer: 'Most scans are safe, but some use radiation. Your doctor will recommend the most appropriate scan for your condition.'
  },
  {
    question: 'How long does a scan take?',
    answer: 'Scan duration varies by type, from a few minutes (X-ray) to an hour (MRI/PET).'
  },
  {
    question: 'Do I need to prepare for a scan?',
    answer: 'Preparation depends on the scan type. Your healthcare provider will give you instructions if needed.'
  },
];

export default function ScanCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600">
              <Scan className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Scan</h1>
          <p className="text-indigo-100 text-lg mb-2">Scans are medical imaging tests that help doctors diagnose and monitor a wide range of conditions. They include CT, MRI, ultrasound, X-ray, and more.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under Scan</h2>
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
