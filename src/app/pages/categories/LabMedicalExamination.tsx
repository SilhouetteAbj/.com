import { FlaskConical } from 'lucide-react';

const popularTests = [
  'Complete Blood Count (CBC)',
  'Blood Chemistry Panel',
  'Urinalysis',
  'Liver Function Tests',
  'Kidney Function Tests',
  'Thyroid Function Tests',
  'Lipid Profile',
  'Blood Glucose Test',
  'DNA Testing',
];

const faqs = [
  {
    question: 'What is a medical laboratory examination?',
    answer: 'Medical laboratory examinations analyze samples of blood, urine, or other body fluids to diagnose and monitor health conditions.'
  },
  {
    question: 'How are lab tests performed?',
    answer: 'Samples are collected and analyzed using specialized equipment and techniques.'
  },
  {
    question: 'Are lab tests accurate?',
    answer: 'Yes, modern laboratory tests are highly accurate and reliable.'
  },
  {
    question: 'Do I need to fast before lab tests?',
    answer: 'Some tests require fasting. Your healthcare provider will inform you if preparation is needed.'
  },
];

export default function LabMedicalExaminationCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-500 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500">
              <FlaskConical className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Lab Medical Examination</h1>
          <p className="text-blue-100 text-lg mb-2">Medical laboratory examinations are essential for diagnosing, monitoring, and preventing diseases. They provide critical information about your health status.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under Lab Medical Examination</h2>
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
