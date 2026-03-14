import { Scan } from 'lucide-react';

const popularTests = [
  'Chest X-Ray',
  'Abdominal X-Ray',
  'Bone X-Ray',
  'Dental X-Ray',
  'Mammogram (Breast X-Ray)',
  'Spine X-Ray',
];

const faqs = [
  {
    question: 'What is an X-ray?',
    answer: 'An X-ray is a quick, painless test that produces images of the structures inside your body, especially bones.'
  },
  {
    question: 'Is X-ray safe?',
    answer: 'X-rays use a small amount of radiation. They are generally safe when used appropriately.'
  },
  {
    question: 'How long does an X-ray take?',
    answer: 'Most X-rays take just a few minutes.'
  },
  {
    question: 'Do I need to prepare for an X-ray?',
    answer: 'Most X-rays require no special preparation.'
  },
];

export default function XRayCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-600">
              <Scan className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">X-Ray</h1>
          <p className="text-orange-100 text-lg mb-2">X-rays are imaging tests that help doctors view the inside of your body, especially bones and certain organs. They are quick, painless, and widely used.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under X-Ray</h2>
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
