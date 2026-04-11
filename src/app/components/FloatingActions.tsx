import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { trackContactClick } from '@/app/lib/analyticsStore';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function FloatingActions() {
  const [callOpen, setCallOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [showIosInstall, setShowIosInstall] = useState(false);
  const [iosInstallOpen, setIosInstallOpen] = useState(false);
  const [educationalModalOpen, setEducationalModalOpen] = useState(false);

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setCanInstall(true);
    };
    const handleInstalled = () => {
      setInstallPrompt(null);
      setCanInstall(false);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = isIos && !/crios|fxios/.test(ua) && /safari/.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setShowIosInstall(isSafari && !isStandalone);
  }, []);

  useEffect(() => {
    const syncEducationalModalState = () => {
      setEducationalModalOpen(
        document.body.getAttribute('data-educational-modal-open') === 'true'
      );
    };

    syncEducationalModalState();

    const observer = new MutationObserver(syncEducationalModalState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-educational-modal-open'],
    });

    return () => observer.disconnect();
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setCanInstall(false);
  };

  const whatsappMessage = encodeURIComponent(
    'Hello! I would like to speak with customer support.'
  );

  if (educationalModalOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
      {showIosInstall && (
        <div className="relative">
          <button
            onClick={() => setIosInstallOpen((v) => !v)}
            aria-label="Install on iPhone"
            title="Install on iPhone"
            className="w-12 h-12 rounded-full overflow-hidden bg-black text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border border-gray-700"
          >
            <Download className="w-5 h-5" />
          </button>
          {iosInstallOpen && (
            <div className="absolute right-14 bottom-0 w-56 bg-white border border-gray-100 shadow-xl rounded-xl p-3 text-xs text-gray-700">
              Tap the Share button in Safari, then choose <strong>Add to Home Screen</strong>.
            </div>
          )}
        </div>
      )}
      {canInstall && (
        <button
          onClick={handleInstall}
          aria-label="Install Silhouette Abuja"
          title="Install App"
          className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border border-blue-200"
        >
          <Download className="w-5 h-5" />
        </button>
      )}
      <a
        href={`https://wa.me/2349030002653?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackContactClick('whatsapp')}
        aria-label="WhatsApp"
        title="WhatsApp"
        className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border border-emerald-100"
      >
        <img
          src="/images/ui/whatsapp-icon.png"
          alt="WhatsApp"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </a>

      <div className="relative">
        <button
          onClick={() => setCallOpen((v) => !v)}
          aria-label="Call"
          title="Call Radiology"
          className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border border-sky-100"
        >
          <img
            src="/images/ui/call-icon.jpg"
            alt="Call"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
        {callOpen && (
          <div className="absolute right-14 bottom-0 bg-white border border-gray-100 shadow-xl rounded-lg p-2 w-48">
            <a
              href="tel:+2349030002653"
              onClick={() => trackContactClick('call')}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              +2349030002653
            </a>
            <a
              href="tel:+2349071920849"
              onClick={() => trackContactClick('call')}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              +2349071920849
            </a>
          </div>
        )}
      </div>

      <Link
        to="/support"
        aria-label="Open chat"
        title="Live Chat"
        className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border border-violet-100"
      >
        <img
          src="/images/ui/support-icon.jpg"
          alt="Support chat"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>
    </div>
  );
}

export default FloatingActions;
