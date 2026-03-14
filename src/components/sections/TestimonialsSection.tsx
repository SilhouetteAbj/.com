import { TestimonialCard } from '../cards/TestimonialCard';
import { FadeInSection } from './FadeInSection';

const testimonials = [
  { name: 'Mrs. Adaeze O.', role: 'Patient', rating: 5, text: 'The 4D ultrasound experience was breathtaking. The staff were incredibly professional and the images were crystal clear. I could see every detail of my baby.' },
  { name: 'Dr. Emmanuel K.', role: 'Referring Physician', rating: 5, text: 'I regularly refer my patients to Silhouette Diagnostics. Their reports are thorough, timely, and the quality of their MRI images is exceptional.' },
  { name: 'Mr. Chukwudi A.', role: 'Patient', rating: 5, text: 'The DNA testing process was smooth and completely confidential. Results came back faster than expected. Highly recommended!' },
  { name: 'Mrs. Fatima B.', role: 'Patient', rating: 5, text: 'From booking to receiving results, everything was seamless. The scan preparation assistant on the website was very helpful.' },
  { name: 'Dr. Ifeanyi N.', role: 'Referring Physician', rating: 5, text: 'Their professionalism and attention to detail are unmatched. My patients always have positive feedback.' },
  { name: 'Ms. Blessing T.', role: 'Patient', rating: 5, text: 'Booking was easy and the staff were so friendly. I felt comfortable throughout my visit.' },
  { name: 'Mr. Samuel E.', role: 'Patient', rating: 5, text: 'The mammogram was quick and painless. I appreciate the care and privacy.' },
  { name: 'Mrs. Ngozi A.', role: 'Patient', rating: 5, text: 'I was nervous about my colonoscopy, but the team explained everything and made me feel at ease.' },
  { name: 'Dr. Amina S.', role: 'Referring Physician', rating: 5, text: 'Silhouette Diagnostics is my top choice for reliable test results and patient care.' },
  { name: 'Mr. John D.', role: 'Patient', rating: 5, text: 'The DNA test was fast and the results were easy to understand. Thank you!' },
  { name: 'Mrs. Esther U.', role: 'Patient', rating: 5, text: 'I loved the modern facility and the staff were very attentive.' },
  { name: 'Dr. Chinedu O.', role: 'Referring Physician', rating: 5, text: 'Their turnaround time for results is impressive. Highly recommended.' },
  { name: 'Ms. Patricia K.', role: 'Patient', rating: 5, text: 'The scan preparation assistant helped me get ready for my test. Very useful!' },
  { name: 'Mr. Ibrahim M.', role: 'Patient', rating: 5, text: 'I was able to book my appointment online and everything went smoothly.' },
  { name: 'Mrs. Grace C.', role: 'Patient', rating: 5, text: 'The staff explained every step and answered all my questions.' },
  { name: 'Dr. Uche O.', role: 'Referring Physician', rating: 5, text: 'I trust Silhouette Diagnostics for all my patient referrals.' },
  { name: 'Mr. Peter N.', role: 'Patient', rating: 5, text: 'The environment was clean and welcoming. I felt safe.' },
  { name: 'Mrs. Linda E.', role: 'Patient', rating: 5, text: 'Results were delivered on time and the follow-up was excellent.' },
  { name: 'Dr. Mary J.', role: 'Referring Physician', rating: 5, text: 'Consistently high-quality service and patient satisfaction.' },
];

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const reviewsPerPage = 4;
  const totalPages = Math.ceil(testimonials.length / reviewsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentReviews = testimonials.slice(page * reviewsPerPage, page * reviewsPerPage + reviewsPerPage);
  // If at the end, wrap around
  if (currentReviews.length < reviewsPerPage) {
    currentReviews.push(...testimonials.slice(0, reviewsPerPage - currentReviews.length));
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Patient Reviews</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Patients Say</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Real experiences from patients and physicians who trust Silhouette Diagnostics.</p>
        </FadeInSection>

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {currentReviews.map((t, i) => (
              <TestimonialCard key={t.name + page} {...t} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
