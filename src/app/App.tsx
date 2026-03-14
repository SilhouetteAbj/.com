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

  return <RouterProvider router={router} />;
}
