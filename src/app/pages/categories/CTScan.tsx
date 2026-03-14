
const popularTests = [
  'Head CT Scan',
  'Chest CT Scan',
  'Abdominal CT Scan',
  'Pelvic CT Scan',
  'CT Angiography',
  'Spine CT Scan',
  'Sinus CT Scan',
  'CT Colonography',
];

const faqs = [
  {
    question: 'What is a CT scan?',
    answer: 'A CT (Computed Tomography) scan uses X-rays and computer technology to create detailed images of the body. It helps diagnose diseases, plan treatments, and guide procedures.'
  },
  {
    question: 'Is a CT scan safe?',
    answer: 'CT scans are generally safe, but they do involve exposure to a small amount of radiation. Your doctor will weigh the benefits and risks before recommending a scan.'
  },
  {
    question: 'How long does a CT scan take?',
    answer: 'Most CT scans take between 10 and 30 minutes, depending on the area being scanned.'
  },
  {
    question: 'Do I need to prepare for a CT scan?',
    answer: 'Preparation depends on the type of scan. Some may require fasting or contrast dye. Your healthcare provider will give you specific instructions.'
  },
];

export default function CTScanCategory() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">CT Scan</h1>
      <p className="mb-6">CT scans are advanced imaging tests that provide cross-sectional views of the body. They are used to diagnose a wide range of conditions, guide treatment plans, and monitor progress. CT scans are fast, non-invasive, and highly accurate.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Popular Tests under CT Scan</h2>
      <ul className="mb-8 list-disc pl-6">
        {popularTests.map((test) => (
          <li key={test} className="mb-2 text-gray-800">{test}</li>
        ))}
      </ul>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Frequently Asked Questions</h2>
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
  );
}
