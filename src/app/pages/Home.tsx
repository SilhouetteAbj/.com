import { useMetaTags } from '@/hooks/useMetaTags';
import { HeroSection, ServicesSection, WhyChooseUsSection, ScanPrepAssistant, TestimonialsSection, FacilityShowcase, CTASection } from '../../components/sections';

export function Home() {
  useMetaTags({
    title: 'Home - Silhouette Diagnostics | DNA Testing & Health Solutions',
    description: 'Get comprehensive DNA testing, health assessments, and preventive care solutions from Silhouette Diagnostics. Advanced genetic testing for personalized health insights.',
    keywords: 'DNA testing, genetic testing, health diagnostics, preventive medicine, wellness',
    ogTitle: 'Silhouette Diagnostics - Advanced Health Solutions',
    ogDescription: 'Comprehensive DNA testing and health diagnostics tailored to your needs.',
    canonical: window.location.origin,
  });

  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <ScanPrepAssistant />
      <TestimonialsSection />
      <FacilityShowcase />
      <CTASection />
    </div>
  );
}
