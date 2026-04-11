import { motion } from 'motion/react';
import { FadeInSection } from './FadeInSection';

interface FacilityImage {
  title: string;
  desc: string;
  src: string;
  alt: string;
}

const facilities: FacilityImage[] = [
  {
    title: 'CT Scanner',
    desc: 'High-resolution CT scanner for advanced imaging',
    src: '/images/home/facility-ct.jpg',
    alt: 'CT Scanner'
  },
  {
    title: 'Ultrasound Lab',
    desc: 'Modern ultrasound lab with advanced equipment',
    src: '/images/shared/ultrasound-lab.jpg',
    alt: 'Ultrasound Lab'
  },
  {
    title: 'EEG Room',
    desc: 'Electroencephalogram (EEG) for brain activity monitoring',
    src: '/images/home/facility-eeg.jpg',
    alt: 'EEG Room'
  },
  {
    title: 'Mammogram Suite',
    desc: 'Upgraded Hologic Genius 3D mammogram machines',
    src: '/images/home/facility-mammogram.jpg',
    alt: 'Mammogram Suite'
  },
];

export function FacilityShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">Our Facility</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">State-of-the-Art Equipment</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Our modern diagnostic facility is equipped with the latest technology to ensure accurate results and patient comfort.</p>
        </FadeInSection>

        <div className="grid lg:grid-cols-2 gap-6">
          {facilities.map((facility, i) => (
            <FadeInSection key={facility.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-100"
              >
                <img
                  src={facility.src}
                  alt={facility.alt}
                  className="w-full h-[280px] object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">{facility.title}</h3>
                    <p className="text-gray-300 text-sm">{facility.desc}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/30 flex items-end p-6 group-hover:from-gray-900/10">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-bold text-lg">{facility.title}</h3>
                  </div>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
