
const popularTests = [
  'Upper GI Endoscopy',
  'Colonoscopy',
  'Flexible Sigmoidoscopy',
  'Capsule Endoscopy',
  'Bronchoscopy',
  'Esophagoscopy',
  'Gastroscopy',
];

const faqs = [
  {
    question: 'What is endoscopy?',
    answer: 'Endoscopy is a procedure that uses a flexible tube with a camera to view the inside of the digestive tract and other organs.'
  },
  {
    question: 'Is endoscopy painful?',
    answer: 'Endoscopy is usually performed under sedation and is generally well tolerated.'
  },
  {
    question: 'How long does endoscopy take?',
    answer: 'Most procedures take 15–45 minutes.'
  },
  {
    question: 'Why might I need endoscopy?',
    answer: 'It is used to diagnose and treat conditions of the digestive tract, lungs, and other organs.'
  },
];

export default function EndoscopyCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-green-500 to-cyan-600 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-cyan-600">
              {/* Use a relevant icon, e.g., Stethoscope from lucide-react */}
              {/* <Stethoscope className="w-8 h-8 text-white" /> */}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Endoscopy</h1>
          <p className="text-cyan-100 text-lg mb-2">Endoscopy is a procedure that allows doctors to view the inside of the body using a flexible tube with a camera. It is used for diagnosis, monitoring, and treatment.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Popular Tests under Endoscopy</h2>
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
