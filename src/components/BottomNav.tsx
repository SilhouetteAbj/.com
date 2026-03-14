import { Link, useLocation } from 'react-router';
import { Home, Stethoscope, Calendar, Dna, Mail, UserPlus, ChevronRight, ChevronLeft } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function BottomNav() {
  const { pathname } = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Home',
      path: '/',
      icon: <Home className="w-5 h-5 text-blue-600" />,
    },
    {
      label: 'Services',
      path: '/services',
      icon: <Stethoscope className="w-5 h-5 text-emerald-600" />,
    },
    {
      label: 'Booking',
      path: '/booking',
      icon: <Calendar className="w-5 h-5 text-pink-500" />,
    },
    {
      label: 'DNA',
      path: '/dna-testing',
      icon: <Dna className="w-5 h-5 text-violet-600" />,
    },
    {
      label: 'Doctors Referrals',
      path: '/doctor-referral',
      icon: <UserPlus className="w-5 h-5 text-orange-500" />,
    },
    {
      label: 'Contact',
      path: '/contact',
      icon: <Mail className="w-5 h-5 text-cyan-600" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg overflow-x-auto lg:hidden">
      <div className="relative flex justify-center">
        {/* Vintage scroll indicator for mobile */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block pointer-events-none">
          <div className="bg-gradient-to-r from-[#f5e9d7] to-transparent w-8 h-12 flex items-center justify-center rounded-r-xl opacity-80 border-r border-yellow-200 shadow-vintage">
            <ChevronLeft className="w-5 h-5 text-yellow-600 animate-bounce-l" />
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:block pointer-events-none">
          <div className="bg-gradient-to-l from-[#f5e9d7] to-transparent w-8 h-12 flex items-center justify-center rounded-l-xl opacity-80 border-l border-yellow-200 shadow-vintage">
            <ChevronRight className="w-5 h-5 text-yellow-600 animate-bounce-r" />
          </div>
        </div>
        <div className="bottomnav-scroll flex items-center max-w-full min-w-[400px] sm:min-w-[500px] md:min-w-[600px] lg:min-w-[700px] xl:min-w-[800px] 2xl:min-w-[900px] mx-auto">
                <style>{`
                  .bottomnav-scroll {
                    overflow-x: auto;
                  }
                  .shadow-vintage { box-shadow: 0 2px 12px 0 #e2c48d33; }
                  @keyframes bounce-l { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-6px); } }
                  @keyframes bounce-r { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
                  .animate-bounce-l { animation: bounce-l 1.2s infinite; }
                  .animate-bounce-r { animation: bounce-r 1.2s infinite; }
                `}</style>
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 py-3 px-4 min-w-[80px] transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-600 border-t-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                }`}
              >
                {item.icon}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <style>{`
        .shadow-vintage { box-shadow: 0 2px 12px 0 #e2c48d33; }
        @keyframes bounce-l { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-6px); } }
        @keyframes bounce-r { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
        .animate-bounce-l { animation: bounce-l 1.2s infinite; }
        .animate-bounce-r { animation: bounce-r 1.2s infinite; }
      `}</style>
    </nav>
  );
}
