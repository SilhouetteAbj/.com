import { RouterProvider } from 'react-router';
import { useEffect } from 'react';
import { router } from './routes.tsx';

export default function App() {
  useEffect(() => {
    const splash = document.getElementById('app-splash');
    if (!splash) return;
    splash.classList.add('hide');
    window.setTimeout(() => splash.remove(), 400);
  }, []);

  useEffect(() => {
    const prodUrl = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined;
    if (!prodUrl) return;
    try {
      const prodOrigin = new URL(prodUrl).origin;
      if (
        window.location.origin !== prodOrigin
        && window.location.hostname.endsWith('vercel.app')
      ) {
        window.location.replace(
          `${prodOrigin}${window.location.pathname}${window.location.search}${window.location.hash}`
        );
      }
    } catch {
      // ignore invalid URL
    }
  }, []);

  return <RouterProvider router={router} />;
}
