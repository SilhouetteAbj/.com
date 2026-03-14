import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router';
import { Layout } from './components/Layout';
import { LoadingSpinner } from './components/LoadingSpinner';

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
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then(m => ({ default: m.ServiceDetail })));
const DNATesting = lazy(() => import('./pages/DNATesting').then(m => ({ default: m.DNATesting })));
const Booking = lazy(() => import('./pages/Booking').then(m => ({ default: m.Booking })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const DoctorReferral = lazy(() => import('./pages/DoctorReferral').then(m => ({ default: m.DoctorReferral })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

// Create a lazy route component wrapper
const LazyRouteComponent = (Component: React.ComponentType) => () => (
  <Suspense fallback={<LazyFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: LazyRouteComponent(Home) },
      { path: 'services', Component: LazyRouteComponent(Services) },
      { path: 'services/:serviceId', Component: LazyRouteComponent(ServiceDetail) },
      { path: 'dna-testing', Component: LazyRouteComponent(DNATesting) },
      { path: 'booking', Component: LazyRouteComponent(Booking) },
      { path: 'blog', Component: LazyRouteComponent(Blog) },
      { path: 'contact', Component: LazyRouteComponent(Contact) },
      { path: 'doctor-referral', Component: LazyRouteComponent(DoctorReferral) },
      { path: 'admin', Component: LazyRouteComponent(Admin) },
    ],
  },
]);
