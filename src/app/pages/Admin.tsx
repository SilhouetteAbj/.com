import { useEffect, useRef, useState } from 'react';
import { useMetaTags } from '@/hooks/useMetaTags';
import { motion, AnimatePresence } from 'motion/react';
import type { ElementType, FormEvent } from 'react';
import {
  LayoutDashboard, MessageCircle, Calendar,
  LogOut, Bell, Search, Trash2, CheckSquare, Square,
  CheckCircle, XCircle,
  Menu, X, Stethoscope, CalendarCheck, Filter, User, Phone, Mail, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { ChatInbox } from '@/app/components/ChatInbox';
import { ChatInterface } from '@/app/components/ChatInterface';
import { supabase } from '@/app/lib/supabaseClient';
import { insertChatMessage, uploadChatBlob, uploadChatFile } from '@/app/lib/chatService';
import type { ChatMessage, ChatThread } from '@/app/lib/chatService';
import { loadAnalytics, type DailyCount } from '@/app/lib/analyticsStore';


type AppointmentRecord = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
};

type ReferralPartner = {
  id: string;
  fullName: string;
  placeOfWork: string;
  phone: string;
  status: 'pending' | 'confirmed';
  referralsCount?: number;
  createdAt: string;
};


type Section = 'overview' | 'chat' | 'bookings' | 'appointments' | 'referrals';

type AdminNotification = {
  id: string;
  type: 'booking' | 'appointment' | 'referral' | 'chat';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: {
    section: Section;
    chatId?: string;
    appointmentDate?: string;
  };
};

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgsnOwbpMeE0JQrY76UgyB7dmoD6z3P8_WrA&s';

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
  routine: 'bg-blue-100 text-blue-700',
  urgent: 'bg-amber-100 text-amber-700',
  emergency: 'bg-red-100 text-red-700',
};

const AnalyticsTable = ({ title, rows, itemLabel }: { title: string; rows: DailyCount[]; itemLabel: string }) => {
  const [page, setPage] = useState(1);
  const perPage = 6;
  const sorted = rows
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.count - a.count);
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * perPage, safePage * perPage);

  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col min-w-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400">Daily report</span>
      </div>
      <div className="max-h-72 overflow-auto">
        <table className="min-w-[560px] w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{itemLabel}</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Count</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">
                  No records yet.
                </td>
              </tr>
            ) : (
              pageRows.map((row, index) => (
                <tr key={`${row.date}-${row.item}-${index}`} className="border-b border-gray-50">
                  <td className="px-3 py-2 text-xs text-gray-600">{row.date}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{row.item}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-gray-900">{row.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Page {safePage} of {totalPages}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="px-2.5 py-1 border border-gray-200 rounded-md text-xs disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="px-2.5 py-1 border border-gray-200 rounded-md text-xs disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export function Admin() {
  useMetaTags({
    title: 'Admin Dashboard - Silhouette Diagnostics',
    description: 'Administrative dashboard for managing appointments, patient data, and business analytics.',
    keywords: 'admin, dashboard, appointments, analytics',
    ogTitle: 'Admin Dashboard',
    ogDescription: 'Manage your diagnostic services with our admin dashboard',
    canonical: `${window.location.origin}/admin`,
  });

  const [authed, setAuthed] = useState(false);
  const ADMIN_PIN = '937388';
  const [adminPin, setAdminPin] = useState(ADMIN_PIN);
  const [authError, setAuthError] = useState(false);
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile for better UX
  const today = new Date().toISOString().split('T')[0];
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [appointmentDate, setAppointmentDate] = useState(today);
  const [appointmentPage, setAppointmentPage] = useState(1);
  const appointmentsPerPage = 6;
  const [activeAppointment, setActiveAppointment] = useState<AppointmentRecord | null>(null);
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingPage, setBookingPage] = useState(1);
  const bookingsPerPage = 8;
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<'pending' | 'confirmed' | 'cancelled'>('pending');
  
  // Chat state
  const [viewingChat, setViewingChat] = useState(false); // false = inbox, true = conversation interface
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLastById, setChatLastById] = useState<Record<string, ChatMessage | null>>({});
  const selectedThread = chatThreads.find((t) => t.ticket_id === selectedChatId) || null;
  
  const [referralPartners, setReferralPartners] = useState<ReferralPartner[]>([]);
  const [activePartner, setActivePartner] = useState<ReferralPartner | null>(null);
  const [partnerReferralCount, setPartnerReferralCount] = useState(0);
  const [analytics, setAnalytics] = useState({
    pageViews: [],
    testSelections: [],
    contactClicks: [],
    referrals: [],
    liveActions: [],
    visitors: [],
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const notificationCountsRef = useRef({
    appointments: 0,
    referrals: 0,
    chats: 0,
    todaysAppointments: 0,
  });
  const notificationsReadyRef = useRef(false);

  useEffect(() => {
    const loadAppointments = async () => {
      const { data } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });
      const mapped = ((data || []) as any[]).map((row) => ({
        id: row.id,
        name: row.name,
        phone: row.phone,
        email: row.email,
        service: row.service,
        date: row.date,
        time: row.time,
        notes: row.notes,
        status: row.status,
        createdAt: row.created_at,
      }));
      setAppointments(mapped);
    };
    void loadAppointments();
    const channel = supabase
      .channel('admin-appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        void loadAppointments();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setAuthed(true);
      }
    };
    void checkSession();
  }, []);

  useEffect(() => {
    const loadReferrals = async () => {
      const { data } = await supabase
        .from('referral_partners')
        .select('*')
        .order('created_at', { ascending: false });
      const mapped = ((data || []) as any[]).map((p) => ({
        id: p.id,
        fullName: p.full_name,
        placeOfWork: p.place_of_work,
        phone: p.phone,
        status: p.status,
        referralsCount: p.referrals_count ?? 0,
        createdAt: p.created_at,
      }));
      setReferralPartners(mapped);
    };
    void loadReferrals();
    const channel = supabase
      .channel('admin-referrals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referral_partners' }, () => {
        void loadReferrals();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      const { data } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false });
      setChatThreads((data as ChatThread[]) || []);
    };
    void loadChats();
    const channel = supabase
      .channel('admin-chats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => {
        void loadChats();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const loadLastMessages = async () => {
      if (chatThreads.length === 0) {
        setChatLastById({});
        return;
      }
      const ids = chatThreads.map((c) => c.id);
      const { data } = await supabase
        .from('chat_messages')
        .select('*')
        .in('chat_id', ids)
        .order('created_at', { ascending: false })
        .limit(500);
      const map: Record<string, ChatMessage | null> = {};
      (data || []).forEach((msg) => {
        if (!map[msg.chat_id]) {
          map[msg.chat_id] = msg as ChatMessage;
        }
      });
      setChatLastById(map);
    };
    void loadLastMessages();
    const channel = supabase
      .channel('admin-chat-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, () => {
        void loadLastMessages();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatThreads]);

  useEffect(() => {
    const loadSelectedMessages = async () => {
      if (!selectedThread) {
        setChatMessages([]);
        return;
      }
      const data = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', selectedThread.id)
        .order('created_at', { ascending: true });
      setChatMessages((data.data as ChatMessage[]) || []);
    };
    void loadSelectedMessages();
    if (!selectedThread) return undefined;
    const channel = supabase
      .channel(`admin-chat-${selectedThread.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${selectedThread.id}` },
        (payload) => {
          const message = payload.new as ChatMessage;
          setChatMessages((prev) => (prev.find((m) => m.id === message.id) ? prev : [...prev, message]));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedThread]);

  useEffect(() => {
    const load = async () => {
      const data = await loadAnalytics();
      setAnalytics(data);
    };
    void load();
    const handleFocus = () => void load();
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!notificationsReadyRef.current) {
      notificationCountsRef.current = {
        appointments: appointments.length,
        referrals: referralPartners.length,
        chats: chatThreads.length,
        todaysAppointments: appointments.filter((appt) => appt.date === today).length,
      };
      notificationsReadyRef.current = true;
      return;
    }
    const previous = notificationCountsRef.current;

    const now = new Date().toISOString();
    const newItems: AdminNotification[] = [];

    const appointmentDiff = appointments.length - previous.appointments;
    if (appointmentDiff > 0) {
      newItems.push({
        id: `notif-booking-${Date.now()}`,
        type: 'booking',
        title: 'New Booking',
        message: `${appointmentDiff} new booking${appointmentDiff > 1 ? 's' : ''} received.`,
        time: now,
        read: false,
        link: { section: 'bookings' },
      });
    }

    const todaysCount = appointments.filter((appt) => appt.date === today).length;
    const todaysDiff = todaysCount - previous.todaysAppointments;
    if (todaysDiff > 0) {
      newItems.push({
        id: `notif-appointment-${Date.now() + 1}`,
        type: 'appointment',
        title: 'New Appointment',
        message: `${todaysDiff} appointment${todaysDiff > 1 ? 's' : ''} scheduled for today.`,
        time: now,
        read: false,
        link: { section: 'appointments', appointmentDate: today },
      });
    }

    const referralDiff = referralPartners.length - previous.referrals;
    if (referralDiff > 0) {
      newItems.push({
        id: `notif-referral-${Date.now() + 2}`,
        type: 'referral',
        title: 'New Referral Registration',
        message: `${referralDiff} new referral registration${referralDiff > 1 ? 's' : ''} submitted.`,
        time: now,
        read: false,
        link: { section: 'referrals' },
      });
    }

    const chatDiff = chatThreads.length - previous.chats;
    if (chatDiff > 0) {
      const latestChat = chatThreads
        .slice()
        .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
      newItems.push({
        id: `notif-chat-${Date.now() + 3}`,
        type: 'chat',
        title: 'New Support Chat',
        message: `${chatDiff} new chat${chatDiff > 1 ? 's' : ''} started.`,
        time: now,
        read: false,
        link: { section: 'chat', chatId: latestChat?.ticket_id },
      });
    }

    if (newItems.length > 0) {
      pushNotifications(newItems);
    }

    notificationCountsRef.current = {
      appointments: appointments.length,
      referrals: referralPartners.length,
      chats: chatThreads.length,
      todaysAppointments: todaysCount,
    };
  }, [appointments, referralPartners, chatThreads, today]);

  useEffect(() => {
    setAppointmentPage(1);
  }, [appointmentSearch, appointmentStatus, appointmentDate]);

  useEffect(() => {
    setBookingPage(1);
  }, [bookingSearch, bookingFilter]);

  const normalizedSearch = appointmentSearch.trim().toLowerCase();
  const filteredAppointments = appointments
    .filter((appt) => (appointmentDate ? appt.date === appointmentDate : true))
    .filter((appt) => (appointmentStatus === 'all' ? true : appt.status === appointmentStatus))
    .filter((appt) => {
      if (!normalizedSearch) return true;
      return (
        appt.name.toLowerCase().includes(normalizedSearch)
        || appt.service.toLowerCase().includes(normalizedSearch)
        || appt.phone.toLowerCase().includes(normalizedSearch)
        || (appt.email || '').toLowerCase().includes(normalizedSearch)
        || appt.id.toLowerCase().includes(normalizedSearch)
      );
    })
    .sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date));

  const totalAppointmentPages = Math.max(1, Math.ceil(filteredAppointments.length / appointmentsPerPage));
  const safeAppointmentPage = Math.min(appointmentPage, totalAppointmentPages);
  const paginatedAppointments = filteredAppointments.slice(
    (safeAppointmentPage - 1) * appointmentsPerPage,
    safeAppointmentPage * appointmentsPerPage
  );
  const normalizedBookingSearch = bookingSearch.trim().toLowerCase();
  const filteredBookings = appointments
    .filter((appt) => (bookingFilter === 'all' ? true : appt.status === bookingFilter))
    .filter((appt) => {
      if (!normalizedBookingSearch) return true;
      return (
        appt.name.toLowerCase().includes(normalizedBookingSearch)
        || appt.service.toLowerCase().includes(normalizedBookingSearch)
        || appt.phone.toLowerCase().includes(normalizedBookingSearch)
        || (appt.email || '').toLowerCase().includes(normalizedBookingSearch)
        || appt.id.toLowerCase().includes(normalizedBookingSearch)
      );
    })
    .sort((a, b) => (b.createdAt || b.date).localeCompare(a.createdAt || a.date));
  const totalBookingPages = Math.max(1, Math.ceil(filteredBookings.length / bookingsPerPage));
  const safeBookingPage = Math.min(bookingPage, totalBookingPages);
  const paginatedBookings = filteredBookings.slice(
    (safeBookingPage - 1) * bookingsPerPage,
    safeBookingPage * bookingsPerPage
  );
  const pageBookingIds = paginatedBookings.map((b) => b.id);
  const allPageSelected = pageBookingIds.length > 0 && pageBookingIds.every((id) => selectedBookingIds.includes(id));

  const toggleBookingSelection = (id: string) => {
    setSelectedBookingIds((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ));
  };

  const toggleSelectAllBookings = () => {
    setSelectedBookingIds((prev) => {
      if (allPageSelected) {
        return prev.filter((id) => !pageBookingIds.includes(id));
      }
      const next = new Set(prev);
      pageBookingIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
  };

  const applyBulkStatus = () => {
    if (selectedBookingIds.length === 0) return;
    const updated = appointments.map((appt) =>
      selectedBookingIds.includes(appt.id) ? { ...appt, status: bulkStatus } : appt
    );
    setAppointments(updated);
    void supabase.from('appointments').update({ status: bulkStatus }).in('id', selectedBookingIds);
    setActiveAppointment((current) =>
      current && selectedBookingIds.includes(current.id) ? { ...current, status: bulkStatus } : current
    );
  };

  const bulkDeleteBookings = () => {
    if (selectedBookingIds.length === 0) return;
    const updated = appointments.filter((appt) => !selectedBookingIds.includes(appt.id));
    setAppointments(updated);
    void supabase.from('appointments').delete().in('id', selectedBookingIds);
    setActiveAppointment((current) => (current && selectedBookingIds.includes(current.id) ? null : current));
    setSelectedBookingIds([]);
  };

  const exportBookings = () => {
    const source = selectedBookingIds.length > 0
      ? filteredBookings.filter((b) => selectedBookingIds.includes(b.id))
      : filteredBookings;
    if (source.length === 0) return;
    const headers = ['ID', 'Name', 'Service', 'Date', 'Time', 'Phone', 'Email', 'Status', 'Notes', 'Created At'];
    const rows = source.map((b) => ([
      b.id,
      b.name,
      b.service,
      b.date,
      b.time,
      b.phone,
      b.email || '',
      b.status,
      (b.notes || '').replace(/\n/g, ' '),
      b.createdAt,
    ]));
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((appt) => appt.status === 'pending').length;
  const confirmedAppointments = appointments.filter((appt) => appt.status === 'confirmed').length;
  const chatUnreadCount = 0;

  const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const isoDate = date.toISOString().split('T')[0];
    const label = date.toLocaleDateString([], { weekday: 'short' });
    const count = appointments.filter((appt) => appt.date === isoDate).length;
    return { label, count };
  });

  const serviceBreakdown = (() => {
    const counts = new Map<string, number>();
    appointments.forEach((appt) => {
      counts.set(appt.service, (counts.get(appt.service) || 0) + 1);
    });
    const palette = [
      { color: '#2563eb', className: 'bg-blue-600' },
      { color: '#0ea5e9', className: 'bg-sky-500' },
      { color: '#22c55e', className: 'bg-green-500' },
      { color: '#f97316', className: 'bg-orange-500' },
      { color: '#a855f7', className: 'bg-purple-500' },
      { color: '#e11d48', className: 'bg-rose-600' },
    ];
    return Array.from(counts.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: palette[index % palette.length].color,
        dotClass: palette[index % palette.length].className,
      }))
      .sort((a, b) => b.value - a.value);
  })();

  const chatPreviews = chatThreads
    .slice()
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .map((thread) => {
      const lastMessage = chatLastById[thread.id];
      const lastMsgText = lastMessage?.text
        ? lastMessage.text
        : lastMessage?.attachment_url
          ? 'Attachment'
          : lastMessage?.audio_url
            ? 'Voice note'
            : 'No messages yet';
      return {
        id: thread.ticket_id,
        name: `Ticket ${thread.ticket_id}`,
        lastMsg: lastMsgText,
        time: lastMessage?.created_at
          ? new Date(lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date(thread.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
      };
    });


  const navItems: { id: Section; label: string; icon: ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat Inbox', icon: MessageCircle, badge: chatUnreadCount || undefined },
    { id: 'bookings', label: 'Bookings', icon: Calendar, badge: pendingAppointments || undefined },
    { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
    { id: 'referrals', label: 'Referrals', icon: Stethoscope },
  ];

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const allSelected = notifications.length > 0 && selectedNotifications.length === notifications.length;

  const toggleNotificationSelection = (id: string) => {
    setSelectedNotifications((prev) => (
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    ));
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    const next = notifications.filter((n) => !selectedNotifications.includes(n.id));
    setSelectedNotifications([]);
    saveStoredNotifications(next);
  };

  const handleDeleteNotification = (id: string) => {
    const next = notifications.filter((n) => n.id !== id);
    setSelectedNotifications((prev) => prev.filter((item) => item !== id));
    saveStoredNotifications(next);
  };

  const handleMarkAllRead = () => {
    if (notifications.length === 0) return;
    const next = notifications.map((n) => ({ ...n, read: true }));
    saveStoredNotifications(next);
  };

  const handleSelectAll = () => {
    setSelectedNotifications(allSelected ? [] : notifications.map((n) => n.id));
  };

  const handleNotificationClick = (notif: AdminNotification) => {
    const next = notifications.map((n) => (n.id === notif.id ? { ...n, read: true } : n));
    saveStoredNotifications(next);
    setNotificationsOpen(false);
    if (notif.link.section === 'chat') {
      setSection('chat');
      setViewingChat(true);
      if (notif.link.chatId) {
        setSelectedChatId(notif.link.chatId);
      }
      return;
    }
    if (notif.link.section === 'referrals') {
      setSection('referrals');
      return;
    }
    if (notif.link.section === 'appointments') {
      setSection('appointments');
      if (notif.link.appointmentDate) {
        setAppointmentDate(notif.link.appointmentDate);
      }
      return;
    }
    setSection(notif.link.section);
  };

  useEffect(() => {
    if (!activePartner) return;
    setPartnerReferralCount(activePartner.referralsCount ?? 0);
  }, [activePartner]);

  const savePartnerReferrals = () => {
    if (!activePartner) return;
    const next = referralPartners.map((p) =>
      p.id === activePartner.id ? { ...p, referralsCount: partnerReferralCount } : p
    );
    setReferralPartners(next);
    void supabase
      .from('referral_partners')
      .update({ referrals_count: partnerReferralCount })
      .eq('id', activePartner.id);
    setActivePartner({ ...activePartner, referralsCount: partnerReferralCount });
  };

  // Helper to handle sidebar close on mobile after selection
  const handleNavClick = (id: Section) => {
    setSection(id);
    // Close sidebar on mobile (small screens) after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (adminPin.trim() !== ADMIN_PIN) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    setAuthed(true);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentRecord['status']) => {
    const updated = appointments.map((appt) => (appt.id === id ? { ...appt, status } : appt));
    setAppointments(updated);
    void supabase.from('appointments').update({ status }).eq('id', id);
    setActiveAppointment((current) => (current && current.id === id ? { ...current, status } : current));
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((appt) => appt.id !== id);
    setAppointments(updated);
    void supabase.from('appointments').delete().eq('id', id);
    setActiveAppointment((current) => (current && current.id === id ? null : current));
  };

  const saveStoredNotifications = (next: AdminNotification[]) => {
    setNotifications(next);
  };

  const pushNotifications = (items: AdminNotification[]) => {
    if (items.length === 0) return;
    setNotifications((prev) => [...items, ...prev]);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white mx-auto mb-4 shadow">
              <img src={LOGO_URL} alt="Silhouette Diagnostics logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Silhouette Diagnostics Consultants</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin PIN</label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter 6-digit PIN"
                aria-label="Admin PIN"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${authError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {authError && <p className="text-red-500 text-xs mt-1">Invalid admin PIN.</p>}
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity">
              Login to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const currentSection = navItems.find((n) => n.id === section);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25 }}
            className="w-64 bg-gradient-to-b from-blue-950 to-indigo-900 text-white flex flex-col fixed inset-y-0 left-0 z-40 lg:z-20 lg:relative lg:h-screen shadow-2xl"
          >
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-white">
                  <img src={LOGO_URL} alt="Silhouette Diagnostics logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-bold text-white text-xs">Silhouette</div>
                  <div className="text-blue-300 text-xs">Admin Panel</div>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    section === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => {
                  void supabase.auth.signOut();
                  setAuthed(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-blue-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col w-full min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden mr-2">
              {sidebarOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
            <h1 className="font-bold text-gray-900 text-sm sm:text-base">{currentSection?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                aria-label="Search dashboard"
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="relative">
              <button
                aria-label="Open notifications"
                onClick={() => setNotificationsOpen((v) => !v)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="fixed sm:absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 top-16 sm:top-auto mt-2 w-[360px] max-w-[90vw] bg-white border border-gray-100 rounded-2xl shadow-xl z-30">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Notifications</div>
                      <div className="text-xs text-gray-500">{notifications.length} total</div>
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100"
                      aria-label="Close notifications"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="px-4 py-2 flex items-center justify-between gap-2 border-b border-gray-100 text-xs">
                    <button
                      onClick={handleSelectAll}
                      className="inline-flex items-center gap-1 text-gray-600 hover:text-blue-600"
                    >
                      {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      {allSelected ? 'Clear selection' : 'Select all'}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleMarkAllRead}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all as read
                      </button>
                      <button
                        onClick={handleDeleteSelected}
                        className="text-red-500 hover:text-red-600 font-medium inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete selected
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500">No notifications yet.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleNotificationSelection(notif.id)}
                              className="mt-1 text-gray-400 hover:text-blue-600"
                              aria-label="Select notification"
                            >
                              {selectedNotifications.includes(notif.id) ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleNotificationClick(notif)}
                              className="flex-1 text-left"
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-gray-900">{notif.title}</div>
                                {!notif.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{notif.message}</div>
                              <div className="text-[11px] text-gray-400 mt-2">
                                {new Date(notif.time).toLocaleString()}
                              </div>
                            </button>
                            <button
                              onClick={() => handleDeleteNotification(notif.id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* OVERVIEW */}
            {section === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: 'Total Appointments', value: totalAppointments, icon: CalendarCheck, color: 'from-blue-500 to-blue-600' },
                    { label: 'Pending Appointments', value: pendingAppointments, icon: Clock, color: 'from-amber-500 to-amber-600' },
                    { label: 'Confirmed Appointments', value: confirmedAppointments, icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
                    { label: 'Support Chats', value: chatThreads.length, icon: MessageCircle, color: 'from-indigo-500 to-indigo-600' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Appointments chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-bold text-gray-900">Appointments Trend</h3>
                      <span className="text-xs text-gray-400">This Week</span>
                    </div>
                    {lastSevenDays.every((d) => d.count === 0) ? (
                      <div className="h-[220px] flex items-center justify-center text-sm text-gray-500">
                        No appointment activity recorded for the last 7 days.
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={lastSevenDays}>
                          <defs>
                            <linearGradient id="appointments" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="count" stroke="#2563eb" fill="url(#appointments)" strokeWidth={2} name="Appointments" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Service breakdown */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-5">Requested Services</h3>
                    {serviceBreakdown.length === 0 ? (
                      <div className="h-[220px] flex items-center justify-center text-sm text-gray-500">
                        No service data yet.
                      </div>
                    ) : (
                      <>
                        <ResponsiveContainer width="100%" height={160}>
                          <PieChart>
                            <Pie data={serviceBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                              {serviceBreakdown.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2 mt-2">
                          {serviceBreakdown.map((s) => (
                            <div key={s.name} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${s.dotClass}`} />
                                <span className="text-gray-600">{s.name}</span>
                              </div>
                              <span className="font-semibold text-gray-900">{s.value}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <AnalyticsTable title="Most Visited Pages" rows={analytics.pageViews} itemLabel="Page" />
                  <AnalyticsTable title="Most Selected Tests" rows={analytics.testSelections} itemLabel="Test" />
                  <AnalyticsTable title="WhatsApp & Call Clicks" rows={analytics.contactClicks} itemLabel="Channel" />
                  <AnalyticsTable title="Referral Registrations" rows={analytics.referrals} itemLabel="Activity" />
                  <AnalyticsTable title="Live Chat & Bookings" rows={analytics.liveActions} itemLabel="Activity" />
                  <AnalyticsTable title="Daily Site Visitors" rows={analytics.visitors} itemLabel="Visitors" />
                </div>
              </motion.div>
            )}

            {/* ── CHAT ── */}
            {section === 'chat' && (
              <div className="-mx-4 sm:-mx-6 -my-4 sm:-my-6 flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)] min-h-[600px] overflow-hidden px-4 sm:px-6 py-4 sm:py-6">
                <AnimatePresence mode="wait">
                  {!viewingChat ? (
                    <ChatInbox
                      className="flex-1"
                      chats={chatPreviews}
                      selectedChatId={selectedChatId}
                      onSelectChat={(chatId) => {
                        setSelectedChatId(chatId);
                      }}
                      onViewChat={() => setViewingChat(true)}
                    />
                  ) : (
                    <ChatInterface
                      selectedChat={selectedThread ? { ticketId: selectedThread.ticket_id, name: `Ticket ${selectedThread.ticket_id}`, chatId: selectedThread.id } : null}
                      messages={chatMessages}
                      onSendText={async (text) => {
                        if (!selectedThread) return;
                        const inserted = await insertChatMessage(selectedThread.id, {
                          sender: 'agent',
                          text,
                          attachment_url: null,
                          attachment_name: null,
                          attachment_type: null,
                          audio_url: null,
                        });
                        setChatMessages((prev) => [...prev, inserted]);
                      }}
                      onSendFile={async (file) => {
                        if (!selectedThread) return;
                        const publicUrl = await uploadChatFile(selectedThread.id, file);
                        const inserted = await insertChatMessage(selectedThread.id, {
                          sender: 'agent',
                          text: '',
                          attachment_url: publicUrl,
                          attachment_name: file.name,
                          attachment_type: file.type,
                          audio_url: null,
                        });
                        setChatMessages((prev) => [...prev, inserted]);
                      }}
                      onSendAudio={async (blob) => {
                        if (!selectedThread) return;
                        const filename = `voice-${Date.now()}.webm`;
                        const publicUrl = await uploadChatBlob(selectedThread.id, blob, filename);
                        const inserted = await insertChatMessage(selectedThread.id, {
                          sender: 'agent',
                          text: '',
                          attachment_url: null,
                          attachment_name: null,
                          attachment_type: null,
                          audio_url: publicUrl,
                        });
                        setChatMessages((prev) => [...prev, inserted]);
                      }}
                      onBack={() => {
                        setViewingChat(false);
                        setSelectedChatId(null);
                      }}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* BOOKINGS */}
            {section === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings by name, service, phone, email, or ID..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      aria-label="Search bookings"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    {[
                      { label: 'All', value: 'all' },
                      { label: 'Pending', value: 'pending' },
                      { label: 'Confirmed', value: 'confirmed' },
                      { label: 'Cancelled', value: 'cancelled' },
                    ].map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setBookingFilter(s.value as typeof bookingFilter)}
                        className={`font-medium transition-colors ${bookingFilter === s.value ? 'text-blue-700' : 'text-gray-500 hover:text-blue-700'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <button
                    onClick={toggleSelectAllBookings}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    {allPageSelected ? 'Clear page selection' : 'Select page'}
                  </button>
                  <div className="text-sm text-gray-500">
                    {selectedBookingIds.length} selected
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value as typeof bulkStatus)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      aria-label="Bulk booking status"
                    >
                      <option value="pending">Mark Pending</option>
                      <option value="confirmed">Mark Confirmed</option>
                      <option value="cancelled">Mark Cancelled</option>
                    </select>
                    <button
                      onClick={applyBulkStatus}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                    >
                      Bulk Update
                    </button>
                  </div>
                  <button
                    onClick={bulkDeleteBookings}
                    className="px-4 py-2 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={exportBookings}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700"
                  >
                    Export Bookings
                  </button>
                </div>
                {filteredBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-sm text-gray-500">
                    No bookings available yet.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Select</th>
                            {['ID', 'Patient', 'Service', 'Date', 'Time', 'Phone', 'Status', 'Actions'].map((h) => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedBookings.map((b) => (
                            <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setActiveAppointment(b)}>
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedBookingIds.includes(b.id)}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    toggleBookingSelection(b.id);
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                  aria-label={`Select booking ${b.id}`}
                                />
                              </td>
                              <td className="px-4 py-3 font-mono text-xs text-gray-500">{b.id}</td>
                              <td className="px-4 py-3 font-medium text-gray-900">{b.name}</td>
                              <td className="px-4 py-3 text-gray-600">{b.service}</td>
                              <td className="px-4 py-3 text-gray-600">{b.date}</td>
                              <td className="px-4 py-3 text-gray-600">{b.time}</td>
                              <td className="px-4 py-3 text-gray-600">{b.phone}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[b.status]}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  {b.status === 'pending' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateAppointmentStatus(b.id, 'confirmed');
                                      }}
                                      className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                      title="Confirm"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {b.status !== 'cancelled' && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateAppointmentStatus(b.id, 'cancelled');
                                      }}
                                      className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                      title="Cancel"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {filteredBookings.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
                    <div>
                      Showing {(safeBookingPage - 1) * bookingsPerPage + 1}
                      {' '}to {Math.min(safeBookingPage * bookingsPerPage, filteredBookings.length)}
                      {' '}of {filteredBookings.length} bookings
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBookingPage(Math.max(1, safeBookingPage - 1))}
                        disabled={safeBookingPage === 1}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span className="text-xs text-gray-500">Page {safeBookingPage} of {totalBookingPages}</span>
                      <button
                        onClick={() => setBookingPage(Math.min(totalBookingPages, safeBookingPage + 1))}
                        disabled={safeBookingPage === totalBookingPages}
                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            {/* APPOINTMENTS */}
            {section === 'appointments' && (
              <motion.div key="appointments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, service, phone, email, or ID..."
                      value={appointmentSearch}
                      onChange={(e) => setAppointmentSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      aria-label="Search appointments"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label="Filter appointments by date"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        value={appointmentStatus}
                        onChange={(e) => setAppointmentStatus(e.target.value as typeof appointmentStatus)}
                        className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                        aria-label="Filter appointments by status"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        setAppointmentSearch('');
                        setAppointmentStatus('all');
                        setAppointmentDate(today);
                      }}
                      className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {filteredAppointments.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-500">
                    No appointments found for the selected filters.
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {paginatedAppointments.map((appt) => (
                        <button
                          key={appt.id}
                          onClick={() => setActiveAppointment(appt)}
                          className="text-left bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-semibold text-gray-900">{appt.name}</div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[appt.status]}`}>
                              {appt.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mb-3">{appt.service}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {appt.date}</div>
                            <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {appt.time}</div>
                            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {appt.phone}</div>
                            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {appt.email || 'No email'}</div>
                          </div>
                          <div className="mt-4 text-xs font-semibold text-blue-600">View full schedule</div>
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-500">
                      <div>
                        Showing {(safeAppointmentPage - 1) * appointmentsPerPage + 1}
                        {' '}to {Math.min(safeAppointmentPage * appointmentsPerPage, filteredAppointments.length)}
                        {' '}of {filteredAppointments.length} appointments
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAppointmentPage(Math.max(1, safeAppointmentPage - 1))}
                          disabled={safeAppointmentPage === 1}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <span className="text-xs text-gray-500">Page {safeAppointmentPage} of {totalAppointmentPages}</span>
                        <button
                          onClick={() => setAppointmentPage(Math.min(totalAppointmentPages, safeAppointmentPage + 1))}
                          disabled={safeAppointmentPage === totalAppointmentPages}
                          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}
            {/* REFERRALS */}
            {section === 'referrals' && (
              <motion.div key="referrals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {referralPartners.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-sm text-gray-500">
                    No referral partner submissions yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="max-h-[420px] overflow-auto">
                        <table className="min-w-[720px] w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                            <tr>
                              {['Partner', 'Place of Work', 'Phone', 'Status', 'Referrals', 'Submitted'].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {referralPartners.map((p) => (
                              <tr
                                key={p.id}
                                className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                                onClick={() => setActivePartner(p)}
                              >
                                <td className="px-4 py-3 font-semibold text-gray-900">{p.fullName}</td>
                                <td className="px-4 py-3 text-gray-600">{p.placeOfWork}</td>
                                <td className="px-4 py-3 text-gray-600">{p.phone}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {p.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-semibold text-gray-900">{p.referralsCount ?? 0}</td>
                                <td className="px-4 py-3 text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                      {referralPartners.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setActivePartner(p)}
                          className="text-left bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-semibold text-gray-900">{p.fullName}</div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {p.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">{p.placeOfWork}</div>
                          <div className="mt-3 text-xs text-gray-600">{p.phone}</div>
                          <div className="mt-3 text-xs font-semibold text-gray-900">Referrals: {p.referralsCount ?? 0}</div>
                          <div className="mt-4 text-xs font-semibold text-blue-600">View details</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-400">Appointment ID</div>
                <div className="font-semibold text-gray-900">{activeAppointment.id}</div>
              </div>
              <button
                onClick={() => setActiveAppointment(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close appointment details"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Patient</div>
                  <div className="text-lg font-semibold text-gray-900">{activeAppointment.name}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[activeAppointment.status]}`}>
                  {activeAppointment.status}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400">Schedule</div>
                    <div className="text-gray-900 font-medium">{activeAppointment.date} at {activeAppointment.time}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400">Service</div>
                    <div className="text-gray-900 font-medium">{activeAppointment.service}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400">Phone</div>
                    <div className="text-gray-900 font-medium">{activeAppointment.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-400">Email</div>
                    <div className="text-gray-900 font-medium">{activeAppointment.email || 'Not provided'}</div>
                  </div>
                </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-400">Submitted</div>
                      <div className="text-gray-900 font-medium">
                        {activeAppointment.createdAt ? new Date(activeAppointment.createdAt).toLocaleString() : 'Unknown'}
                      </div>
                    </div>
                  </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
                <div className="text-xs text-gray-400 mb-1">Notes</div>
                {activeAppointment.notes ? activeAppointment.notes : 'No additional notes provided.'}
              </div>

              <div className="flex justify-end">
                <div className="flex flex-wrap gap-2 justify-end">
                  {activeAppointment.status !== 'confirmed' && (
                    <button
                      onClick={() => updateAppointmentStatus(activeAppointment.id, 'confirmed')}
                      className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700"
                    >
                      Confirm
                    </button>
                  )}
                  {activeAppointment.status !== 'cancelled' && (
                    <button
                      onClick={() => updateAppointmentStatus(activeAppointment.id, 'cancelled')}
                      className="px-4 py-2.5 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => deleteAppointment(activeAppointment.id)}
                    className="px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setActiveAppointment(null)}
                    className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-400">Referral Partner ID</div>
                <div className="font-semibold text-gray-900">{activePartner.id}</div>
              </div>
              <button
                onClick={() => setActivePartner(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close partner details"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400">Health Professional</div>
                  <div className="text-lg font-semibold text-gray-900">{activePartner.fullName}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activePartner.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {activePartner.status}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-gray-400">Place of Work</div>
                  <div className="text-gray-900 font-medium">{activePartner.placeOfWork}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Phone</div>
                  <div className="text-gray-900 font-medium">{activePartner.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Submitted</div>
                  <div className="text-gray-900 font-medium">{new Date(activePartner.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Registered Referrals</div>
                  <input
                    type="number"
                    min={0}
                    value={partnerReferralCount}
                    onChange={(e) => setPartnerReferralCount(Number(e.target.value) || 0)}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Registered referrals count"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={savePartnerReferrals}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setActivePartner(null)}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
