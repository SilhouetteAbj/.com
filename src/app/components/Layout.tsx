import { Outlet, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNav } from '@/components/BottomNav';
import { FloatingActions } from './FloatingActions';
import { trackDailyVisitor, trackPageView } from '@/app/lib/analyticsStore';
import { supabase } from '@/app/lib/supabaseClient';

export function Layout() {
  const { pathname } = useLocation();
  useLenisScroll();
  const releaseRef = useRef<string | null>(null);
  const releaseInitRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackPageView(pathname);
    trackDailyVisitor();
  }, [pathname]);

  useEffect(() => {
    let active = true;
    const loadRelease = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'release_version')
        .maybeSingle();
      if (!active) return;
      if (data?.value) {
        releaseRef.current = data.value;
      }
      releaseInitRef.current = true;
    };
    void loadRelease();
    const channel = supabase
      .channel('site-settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_settings', filter: 'key=eq.release_version' },
        (payload) => {
          const nextValue = (payload.new as { value?: string } | null)?.value;
          if (!nextValue) return;
          if (!releaseInitRef.current) {
            releaseRef.current = nextValue;
            releaseInitRef.current = true;
            return;
          }
          if (releaseRef.current && nextValue !== releaseRef.current) {
            releaseRef.current = nextValue;
            window.location.reload();
          } else if (!releaseRef.current) {
            releaseRef.current = nextValue;
          }
        }
      )
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

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
