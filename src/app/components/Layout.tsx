import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from '@/components/BottomNav';
import { FloatingActions } from './FloatingActions';
import { trackDailyVisitor, trackPageView } from '@/app/lib/analyticsStore';

export function Layout() {
  const { pathname } = useLocation();
  useLenisScroll();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(pathname);
    trackDailyVisitor();
  }, [pathname]);

  const isAdmin = pathname === '/admin';
  const isReferral = pathname.startsWith('/doctor-referral') || pathname.startsWith('/doctors-referral');
  const isSupport = pathname.startsWith('/chat') || pathname.startsWith('/support');
  const hideChrome = isAdmin || isReferral || isSupport;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <main className={`flex-1 ${hideChrome ? '' : 'pb-24'}`}>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BottomNav />}
      {!hideChrome && <FloatingActions />}
    </div>
  );
}
