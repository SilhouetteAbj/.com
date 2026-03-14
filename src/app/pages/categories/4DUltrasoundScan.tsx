
const popularTests = [
  '4D Obstetric Ultrasound',
  'Fetal Movement Assessment',
  'Fetal Anatomy Scan',
  'Growth Scan',
  'Placental Position Scan',
];

const faqs = [
  {
    question: 'What is a 4D ultrasound scan?',
    answer: 'A 4D ultrasound scan provides real-time moving images of the fetus, allowing parents and doctors to see detailed anatomy and movements.'
  },
  {
    question: 'Is 4D ultrasound safe?',
    answer: 'Yes, 4D ultrasound uses sound waves and is considered safe for both mother and baby.'
  },
  {
    question: 'When is 4D ultrasound performed?',
    answer: 'It is usually performed between 26 and 32 weeks of pregnancy.'
  },
  {
    question: 'Do I need to prepare for a 4D ultrasound?',
    answer: 'No special preparation is needed, but a full bladder may help improve image quality.'
  },
];

export default function FourDUltrasoundScanCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
              {/* Use a relevant icon, e.g., Waves from lucide-react */}
              {/* <Waves className="w-8 h-8 text-white" /> */}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">4D Ultrasound Scan</h1>
          <p className="text-blue-100 text-lg mb-2">4D ultrasound scans provide real-time moving images of the inside of the body, commonly used in pregnancy and other medical assessments.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under 4D Ultrasound Scan</h2>
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
