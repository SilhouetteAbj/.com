import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Fallback component for lazy-loaded routes
function LazyFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}

// Lazy load all pages for route-based code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const ServiceCategory = lazy(() => import('./pages/ServiceCategory').then(m => ({ default: m.ServiceCategory })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then(m => ({ default: m.ServiceDetail })));
const DNATesting = lazy(() => import('./pages/DNATesting').then(m => ({ default: m.DNATesting })));
const Booking = lazy(() => import('./pages/Booking').then(m => ({ default: m.Booking })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const DoctorReferral = lazy(() => import('./pages/DoctorReferral').then(m => ({ default: m.DoctorReferral })));
const DoctorReferralDashboard = lazy(() => import('./pages/DoctorReferralDashboard').then(m => ({ default: m.DoctorReferralDashboard })));

// Category pages
const Colonoscopy = lazy(() => import('./pages/categories/Colonoscopy'));
const CTScan = lazy(() => import('./pages/categories/CTScan'));
const ECG = lazy(() => import('./pages/categories/ECG'));
const ECHO = lazy(() => import('./pages/categories/ECHO'));
const EEG = lazy(() => import('./pages/categories/EEG'));
const Esophagoscopy = lazy(() => import('./pages/categories/Esophagoscopy'));
const Gastroscopy = lazy(() => import('./pages/categories/Gastroscopy'));
const HolterECG = lazy(() => import('./pages/categories/HolterECG'));
const LabMedicalExamination = lazy(() => import('./pages/categories/LabMedicalExamination'));
const MRI = lazy(() => import('./pages/categories/MRI'));
const Pharyngoscopy = lazy(() => import('./pages/categories/Pharyngoscopy'));
const Scan = lazy(() => import('./pages/categories/Scan'));
const XRay = lazy(() => import('./pages/categories/XRay'));
const FourDUltrasoundScan = lazy(() => import('./pages/categories/4DUltrasoundScan'));
const Mammogram = lazy(() => import('./pages/categories/Mammogram'));
const Endoscopy = lazy(() => import('./pages/categories/Endoscopy'));
const DNA = lazy(() => import('./pages/categories/DNA'));

// Create a lazy route component wrapper with Suspense
const LazyRouteComponent = (Component: React.ComponentType<any>) => {
  return () => (
    <Suspense fallback={<LazyFallback />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: LazyRouteComponent(Home) },
      { path: 'services', Component: LazyRouteComponent(Services) },
      { path: 'services/category/:categoryId', Component: LazyRouteComponent(ServiceCategory) },
      { path: 'services/:serviceId', Component: LazyRouteComponent(ServiceDetail) },
      { path: 'dna-testing', Component: LazyRouteComponent(DNATesting) },
      { path: 'booking', Component: LazyRouteComponent(Booking) },
      { path: 'chat', Component: LazyRouteComponent(Chat) },
      { path: 'support', Component: LazyRouteComponent(Chat) },
      { path: 'support-chat', Component: LazyRouteComponent(Chat) },
      { path: 'contact', Component: LazyRouteComponent(Contact) },
      { path: 'admin', Component: LazyRouteComponent(Admin) },
      { path: 'doctor-referral', Component: LazyRouteComponent(DoctorReferral) },
      { path: 'doctor-referral/dashboard', Component: LazyRouteComponent(DoctorReferralDashboard) },
      { path: 'doctors-referral', Component: LazyRouteComponent(DoctorReferral) },
      // Category routes
      { path: 'categories/Colonoscopy', Component: LazyRouteComponent(Colonoscopy) },
      { path: 'categories/CTScan', Component: LazyRouteComponent(CTScan) },
      { path: 'categories/ECG', Component: LazyRouteComponent(ECG) },
      { path: 'categories/ECHO', Component: LazyRouteComponent(ECHO) },
      { path: 'categories/EEG', Component: LazyRouteComponent(EEG) },
      { path: 'categories/Esophagoscopy', Component: LazyRouteComponent(Esophagoscopy) },
      { path: 'categories/Gastroscopy', Component: LazyRouteComponent(Gastroscopy) },
      { path: 'categories/HolterECG', Component: LazyRouteComponent(HolterECG) },
      { path: 'categories/LabMedicalExamination', Component: LazyRouteComponent(LabMedicalExamination) },
      { path: 'categories/MRI', Component: LazyRouteComponent(MRI) },
      { path: 'categories/Pharyngoscopy', Component: LazyRouteComponent(Pharyngoscopy) },
      { path: 'categories/Scan', Component: LazyRouteComponent(Scan) },
      { path: 'categories/XRay', Component: LazyRouteComponent(XRay) },
      { path: 'categories/4DUltrasoundScan', Component: LazyRouteComponent(FourDUltrasoundScan) },
      { path: 'categories/Mammogram', Component: LazyRouteComponent(Mammogram) },
      { path: 'categories/Endoscopy', Component: LazyRouteComponent(Endoscopy) },
      { path: 'categories/DNA', Component: LazyRouteComponent(DNA) },
    ],
  },
]);
