import { FlaskConical } from 'lucide-react';

const services = [
  {
    name: 'Colonoscopy',
    description: 'Detailed examination of the large intestine and colon for polyps, cancer screening.',
    duration: '30–60 min',
    badge: 'Cancer Screening',
    imageUrl: 'https://cdn.medicalpark.com.tr/colonoscopy.jpg',
  },
];

export default function ColonoscopyCategory() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 pt-24 pb-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              <FlaskConical className="w-8 h-8 text-white" />
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Colonoscopy</h1>
          <p className="text-orange-100 text-lg mb-2">Colonoscopy is a diagnostic procedure used to examine the inner lining of the large intestine (colon and rectum). It helps detect polyps, cancer, and other abnormalities. It is recommended for cancer screening and gastrointestinal health assessment.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Services under Colonoscopy</h2>
        <div className="grid gap-6">
          {services.map((service) => (
            <div key={service.name} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex gap-6 items-center">
              <img src={service.imageUrl} alt={service.name} className="w-32 h-20 object-cover rounded-xl border" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-gray-600 mb-2">{service.description}</p>
                <div className="text-sm text-gray-500 mb-1">Duration: {service.duration}</div>
                <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium">{service.badge}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Why is Colonoscopy Important?</h2>
          <p className="text-gray-700">Colonoscopy is vital for early detection of colorectal cancer, removal of polyps before they become cancerous, and diagnosis of unexplained changes in bowel habits, abdominal pain, or bleeding.</p>
        </div>
      </div>
    </div>
  );
}
