import { useParams, Link } from 'react-router';
import { useMetaTags } from '@/hooks/useMetaTags';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import type { ElementType } from 'react';
import { Calendar, Clock, CheckCircle, ArrowLeft, MessageCircle, Activity, Brain, Heart, Eye, Dna, Scan, FlaskConical } from 'lucide-react';
import { trackTestSelection } from '@/app/lib/analyticsStore';

const LAB_IMG = 'https://images.unsplash.com/photo-1578496479530-799fd6d0803a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZGlhZ25vc3RpYyUyMGxhYm9yYXRvcnklMjBkb2N0b3J8ZW58MXx8fHwxNzcyNzAxNTQwfDA&ixlib=rb-4.1.0&q=80&w=1080';
const CT_IMG = 'https://medicaidradiology.com/assets/img/service/ct1.jpg';
const US_IMG = 'https://static.wixstatic.com/media/e1a4cd_09474dbb981041ce9c17b32ecb2cda2a~mv2.jpg/v1/fill/w_568,h_378,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/e1a4cd_09474dbb981041ce9c17b32ecb2cda2a~mv2.jpg';
const US_COMPARISON_IMG = 'https://venuswomenshospital.com/uploads/image/3d-4d.jpg';
const MAMMOGRAM_IMG = 'https://domf5oio6qrcr.cloudfront.net/medialibrary/15749/b4c809a0-f4ef-4fd0-8a87-5db2eee50e9f.jpg';

const serviceData: Record<string, {
  name: string;
  icon: ElementType;
  gradient: string;
  image: string;
  overview: string;
  whoShouldTake: string[];
  preparation: string[];
  duration: string;
  benefits: string[];
  price: string;
  comparisonContent?: {
    image: string;
    title: string;
    sections: Array<{ type: string; description: string; icon: string; highlight?: boolean }>;
    benefits: Array<{ title: string; description: string }>;
    whyChoose4D: string;
  };
}> = {
  'ct-scan': {
    name: 'CT Scan',
    icon: Brain,
    gradient: 'from-orange-500 to-red-600',
    image: CT_IMG,
    overview: 'Computed Tomography (CT) scanning is a rapid, non-invasive imaging technique that creates detailed cross-sectional images of the body using X-rays and advanced computer technology. CT scans are ideal for detecting internal injuries, tumors, infections, and other abnormalities with exceptional clarity and speed.',
    whoShouldTake: [
      'Patients with chest, abdominal, or head injuries',
      'Those with suspected tumors or cancers',
      'Individuals with internal bleeding or trauma',
      'Patients needing rapid diagnostic imaging',
      'Those with complex bone or joint injuries',
      'Patients requiring follow-up tumor monitoring',
    ],
    preparation: [
      'Wear comfortable, loose-fitting clothing without metal',
      'Remove jewelry, piercings, and metal accessories',
      'Inform staff if you have metal implants or devices',
      'Fasting may be required (check with your doctor)',
      'Arrive 15 minutes early for registration',
    ],
    duration: '10–30 minutes',
    benefits: [
      'Fast, high-resolution imaging',
      'Excellent for detecting bone and soft tissue abnormalities',
      'Multi-planar reconstruction capability',
      'Low radiation dose with modern CT technology',
      'Real-time dynamic imaging possible',
    ],
    price: 'From ₦35,000',
  },
  '4d-ultrasound': {
    name: '4D Ultrasound',
    icon: Activity,
    gradient: 'from-blue-500 to-cyan-500',
    image: US_IMG,
    overview: '4D ultrasound uses high-frequency sound waves to create real-time, moving three-dimensional images of your baby in the womb. It allows parents to see their baby\'s face and movements in incredible detail, while also enabling clinicians to assess fetal development and detect potential anomalies. Experience the magic of watching your baby in stunning 4-dimensional clarity!',
    whoShouldTake: [
      'Pregnant women at any stage of pregnancy',
      'Women wanting detailed fetal anatomy assessment',
      'Those with concerns about fetal wellbeing',
      'Parents wanting a memorable keepsake scan',
      'High-risk pregnancies requiring close monitoring',
    ],
    preparation: [
      'Drink 4–6 glasses of water 1 hour before your appointment',
      'Do not empty your bladder before the scan',
      'Eat normally — no special diet required',
      'Bring your previous scan reports if available',
      'Consider bringing a family member to share the experience',
    ],
    duration: '20–30 minutes',
    benefits: [
      'Real-time 4D imaging of fetal movements',
      'Detailed fetal anatomy assessment',
      'Early detection of developmental concerns',
      'Emotional bonding opportunity for parents',
      'Safe, non-invasive, no radiation',
    ],
    price: 'From ₦18,000',
    comparisonContent: {
      image: US_COMPARISON_IMG,
      title: 'Understanding Ultrasound Technology: 2D, 3D, and 4D',
      sections: [
        {
          type: '2D Ultrasound',
          description: 'Traditional 2D ultrasound provides flat, grayscale images from a single plane. While highly useful for basic fetal anatomy assessment, measurements, and screening, 2D cannot provide the spatial detail or dimensional perspective of more advanced technologies.',
          icon: '📊',
        },
        {
          type: '3D Ultrasound',
          description: '3D ultrasound adds depth by capturing multiple 2D slices and reconstructing them into three-dimensional static images. This allows you to see your baby\'s face, profile, and structure from different angles, but the images are still snapshots — not live movement.',
          icon: '🎯',
        },
        {
          type: '4D Ultrasound (Our Premium Choice)',
          description: '4D ultrasound is 3D imaging in real-time — meaning you see your baby in full dimension AND in motion, live. Watch your baby yawn, stretch, kick, and interact with the amniotic fluid. 4D captures the passage of time, revealing the beauty of life developing before your eyes. It\'s not just imaging; it\'s an unforgettable experience that strengthens parental bonding and emotional connection from the very first moment.',
          icon: '✨',
          highlight: true,
        },
      ],
      benefits: [
        {
          title: 'Superior Visual Clarity',
          description: 'See your baby in incredible detail — facial features, expressions, even fingers and toes — in stunning real-time motion.',
        },
        {
          title: 'Enhanced Diagnostics',
          description: 'The combination of real-time motion and 3D detail allows our specialists to assess fetal wellbeing, anatomy, and development with greater precision than ever before.',
        },
        {
          title: 'Emotional Bonding',
          description: 'Watching your baby move, play, and develop in 4D creates a profound connection between parents and baby weeks before birth. Many parents say it\'s one of the most meaningful experiences of their pregnancy.',
        },
        {
          title: 'Screen for Concerns Early',
          description: 'The enhanced imaging capability of 4D helps identify potential developmental concerns earlier, giving you and your doctor more time to plan and prepare.',
        },
        {
          title: 'Beautiful Memories',
          description: 'Take home videos and photos of your unique moment. Share the joy with family and friends. These memories will be treasured for a lifetime.',
        },
      ],
      whyChoose4D: 'Why Choose 4D Ultrasound?\n\n4D ultrasound represents the pinnacle of prenatal imaging technology. It combines the diagnostic power of modern medical imaging with the emotional joy of truly seeing your baby in motion. At Silhouette Diagnostics, our 4D ultrasound service isn\'t just a medical procedure — it\'s a cherished memory in the making. Whether you\'re seeking peace of mind about your baby\'s development or looking for that special bonding moment, 4D ultrasound delivers an experience that 2D and 3D simply cannot match. See your baby not as a static image, but as a living, moving person. Experience 4D ultrasound today.',
    },
  },
  'mammogram': {
    name: 'Mammogram',
    icon: Heart,
    gradient: 'from-pink-500 to-rose-600',
    image: MAMMOGRAM_IMG,
    overview: 'A mammogram is a low-dose X-ray of the breast used to detect and diagnose breast cancer in its early stages. Digital mammography provides detailed images that allow radiologists to identify even the smallest abnormalities, significantly improving treatment outcomes when cancer is detected early.',
    whoShouldTake: [
      'Women aged 40 and above for routine screening',
      'Women with a family history of breast cancer',
      'Those who notice lumps or changes in breast tissue',
      'Women with dense breast tissue',
      'Post-cancer treatment monitoring',
    ],
    preparation: [
      'Do not wear deodorant, lotion, or powder on the day',
      'Wear a two-piece outfit for easy dressing',
      'Avoid scheduling during your menstrual period',
      'Inform staff if you are pregnant or breastfeeding',
      'Bring previous mammogram images for comparison',
    ],
    duration: '15–20 minutes',
    benefits: [
      'Early detection saves lives',
      'Quick and minimally uncomfortable',
      'Digital imaging for precise analysis',
      'Can detect cancer before symptoms appear',
      'Annual screening is recommended for high-risk patients',
    ],
    price: 'From ₦15,000',
  },
  'endoscopy': {
    name: 'Upper GI Endoscopy',
    icon: Eye,
    gradient: 'from-emerald-500 to-teal-600',
    image: LAB_IMG,
    overview: 'Upper gastrointestinal endoscopy (gastroscopy) is a procedure that uses a thin, flexible tube with a camera (endoscope) to examine the lining of the esophagus, stomach, and duodenum. It is used to diagnose conditions like ulcers, inflammation, tumors, and bleeding.',
    whoShouldTake: [
      'Patients with persistent heartburn or acid reflux',
      'Those with difficulty or pain when swallowing',
      'Individuals with unexplained weight loss',
      'Patients with upper abdominal pain',
      'Those with symptoms of GI bleeding',
    ],
    preparation: [
      'Fast for at least 6 hours before the procedure',
      'Do not drink anything (including water) for at least 2 hours before',
      'Inform your doctor of all medications you take',
      'Arrange for someone to drive you home afterward',
      'Leave jewelry and valuables at home',
    ],
    duration: '20–40 minutes',
    benefits: [
      'Direct visual examination of the GI tract',
      'Tissue biopsies can be taken during the procedure',
      'Therapeutic interventions possible (e.g., polyp removal)',
      'Accurate diagnosis without major surgery',
      'Quick recovery time',
    ],
    price: 'From ₦35,000',
  },
  'colonoscopy': {
    name: 'Colonoscopy',
    icon: FlaskConical,
    gradient: 'from-emerald-500 to-teal-600',
    image: LAB_IMG,
    overview: 'A colonoscopy is an examination of the inner lining of the large intestine (colon and rectum) using a flexible, lighted scope. It is the gold standard for colorectal cancer screening and can also detect and remove polyps before they become cancerous.',
    whoShouldTake: [
      'Adults aged 45+ for routine colorectal cancer screening',
      'Those with family history of colon cancer',
      'Patients with rectal bleeding or blood in stool',
      'Individuals with unexplained changes in bowel habits',
      'Those with inflammatory bowel disease monitoring',
    ],
    preparation: [
      'Follow a clear liquid diet the day before the procedure',
      'Take the prescribed bowel preparation medication',
      'Do not eat or drink anything after midnight',
      'Arrange for someone to drive you home afterward',
      'Inform your doctor of all current medications',
    ],
    duration: '30–60 minutes',
    benefits: [
      'Gold standard for colorectal cancer screening',
      'Polyps can be removed during the same procedure',
      'Can detect early-stage cancer with excellent outcomes',
      'Comprehensive examination of the entire colon',
      'Recommended every 10 years for average-risk adults',
    ],
    price: 'From ₦40,000',
  },
  'eeg': {
    name: 'EEG (Electroencephalography)',
    icon: Scan,
    gradient: 'from-violet-500 to-purple-600',
    image: LAB_IMG,
    overview: 'An electroencephalogram (EEG) measures electrical activity in the brain using small sensors (electrodes) attached to the scalp. It is a painless test that records brain waves to help diagnose epilepsy, seizure disorders, sleep disorders, and other neurological conditions.',
    whoShouldTake: [
      'Patients with suspected epilepsy or seizures',
      'Those with unexplained loss of consciousness',
      'Individuals with sleep disorders or insomnia',
      'Patients with suspected brain tumors',
      'Those monitoring effectiveness of seizure medications',
    ],
    preparation: [
      'Wash your hair the night before (no conditioner or styling products)',
      'Get a good night\'s sleep before the test',
      'Avoid caffeine for 8 hours before',
      'Continue taking your regular medications unless advised otherwise',
      'Wear comfortable, button-up clothing (avoid pullover tops)',
    ],
    duration: '45–60 minutes',
    benefits: [
      'Completely painless and non-invasive',
      'Accurate brain activity mapping',
      'Essential for epilepsy diagnosis and management',
      'Helps identify types of seizures',
      'Can detect abnormal brain patterns',
    ],
    price: 'From ₦25,000',
  },
};

export function ServiceDetail() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const svc = serviceData[serviceId || ''];

  useEffect(() => {
    if (svc?.name) {
      trackTestSelection(svc.name);
    }
  }, [svc?.name]);

  // Set dynamic meta tags based on service
  useMetaTags({
    title: svc ? `${svc.name} - Silhouette Diagnostics` : 'Service - Silhouette Diagnostics',
    description: svc ? svc.overview : 'Professional diagnostic service at Silhouette Diagnostics',
    keywords: `${svc?.name}, diagnostic test, medical imaging, health screening`,
    ogTitle: svc?.name,
    ogDescription: svc?.overview,
    canonical: `${window.location.origin}/services/${serviceId}`,
  });

  if (!svc) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <Link to="/services" className="text-blue-600 hover:underline">← Back to Services</Link>
        </div>
      </div>
    );
  }

  const Icon = svc.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${svc.gradient} pt-32 pb-16 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 dot-overlay-lg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white/70 text-sm">Diagnostic Service</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{svc.name}</h1>
            </div>
          </motion.div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-white">
              <Clock className="w-4 h-4" /> {svc.duration}
            </div>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-white">
              💰 {svc.price}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}>
              <img src={svc.image} alt={svc.name} className="w-full h-72 object-cover rounded-2xl shadow-xl mb-8" />
            </motion.div>

            {/* Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Service Overview</h2>
              <p className="text-gray-600 leading-relaxed">{svc.overview}</p>
            </motion.div>

            {/* Who should take */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Who Should Take This Test?</h2>
              <ul className="space-y-3">
                {svc.whoShouldTake.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Preparation */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-7 border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 How to Prepare</h2>
              <div className="space-y-3">
                {svc.preparation.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{i + 1}</div>
                    <span className="text-gray-700 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Benefits */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Benefits</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {svc.benefits.map((b) => (
                  <div key={b} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-cyan-500 mt-0.5">✓</span> {b}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 4D Ultrasound Comparison Section */}
            {svc.comparisonContent && (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-7 border border-blue-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{svc.comparisonContent.title}</h2>
                  <img src={svc.comparisonContent.image} alt="Ultrasound comparison" className="w-full h-80 object-cover rounded-xl shadow-lg mb-8" />
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {svc.comparisonContent.sections.map((section, i) => (
                      <div key={i} className={`p-5 rounded-xl ${section.highlight ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg' : 'bg-white border border-gray-200'}`}>
                        <div className="text-3xl mb-3">{section.icon}</div>
                        <h3 className={`font-bold text-lg mb-3 ${section.highlight ? 'text-white' : 'text-gray-900'}`}>{section.type}</h3>
                        <p className={`text-sm leading-relaxed ${section.highlight ? 'text-white/90' : 'text-gray-600'}`}>{section.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose 4D Ultrasound?</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {svc.comparisonContent.benefits.map((benefit, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shrink-0">✨</div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                          <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-lg">
                  <p className="text-lg leading-relaxed whitespace-pre-line">{svc.comparisonContent.whyChoose4D}</p>
                </motion.div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <h3 className="font-bold text-gray-900 mb-5">Book This Service</h3>
              <div className="space-y-3 mb-5 text-sm text-gray-600">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Duration</span>
                  <span className="font-medium text-gray-900">{svc.duration}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Starting Price</span>
                  <span className="font-semibold text-blue-700">{svc.price}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Report Delivery</span>
                  <span className="font-medium text-gray-900">24–48 hours</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Availability</span>
                  <span className="font-medium text-emerald-600">7 Days a Week</span>
                </div>
              </div>
              <Link
                to={`/booking?service=${serviceId}`}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Link>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
