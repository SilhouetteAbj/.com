import { Eye } from 'lucide-react';

const popularTests = [
  'Diagnostic Esophagoscopy',
  'Therapeutic Esophagoscopy',
  'Biopsy during Esophagoscopy',
  'Foreign Body Removal',
  'Esophageal Dilation',
];

const faqs = [
  {
    question: 'What is esophagoscopy?',
    answer: 'Esophagoscopy is an endoscopic procedure to examine the esophagus for abnormalities, blockages, or disease.'
  },
  {
    question: 'Is esophagoscopy painful?',
    answer: 'It is usually performed under sedation and is generally well tolerated.'
  },
  {
    question: 'How long does esophagoscopy take?',
    answer: 'Most procedures take 15–30 minutes.'
  },
  {
    question: 'Why might I need esophagoscopy?',
    answer: 'It is used to diagnose swallowing problems, bleeding, tumors, or inflammation.'
  },
];

export default function EsophagoscopyCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600">
              <Eye className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Esophagoscopy</h1>
          <p className="text-teal-100 text-lg mb-2">Esophagoscopy is a procedure that allows doctors to view the inside of the esophagus using a flexible tube with a camera. It is used for diagnosis and treatment of esophageal conditions.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under Esophagoscopy</h2>
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
