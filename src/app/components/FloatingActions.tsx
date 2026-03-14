import { Link } from 'react-router';
import { useState } from 'react';
import { trackContactClick } from '@/app/lib/analyticsStore';

export function FloatingActions() {
  const [callOpen, setCallOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    'Hello! I would like to speak with customer support.'
  );

  return (
    <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
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
          src="https://store-images.s-microsoft.com/image/apps.8453.13655054093851568.4a371b72-2ce8-4bdb-9d83-be49894d3fa0.7f3687b9-847d-4f86-bb5c-c73259e2b38e"
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
            src="https://media.istockphoto.com/id/1494206458/vector/calling-icon-call-icon-telephone-reception-vector.jpg?s=612x612&w=0&k=20&c=0FuOg7NoZvfwM5LG2vDUjo_m-7EoNlKQWGfYiJ5GeG4="
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
              href="tel:+2348101196774"
              onClick={() => trackContactClick('call')}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
            >
              +2348101196774
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
          src="https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg"
          alt="Support chat"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>
    </div>
  );
}

export default FloatingActions;
