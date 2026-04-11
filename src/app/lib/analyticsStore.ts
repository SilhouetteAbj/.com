import { supabase } from '@/app/lib/supabaseClient';
import { trackAnalyticsEvent } from '@/app/lib/publicApi';

export type DailyCount = {
  date: string;
  item: string;
  count: number;
};

export type AnalyticsStore = {
  pageViews: DailyCount[];
  testSelections: DailyCount[];
  contactClicks: DailyCount[];
  referrals: DailyCount[];
  liveActions: DailyCount[];
  visitors: DailyCount[];
};

const getToday = () => new Date().toISOString().split('T')[0];

const inMemoryVisitorSet = new Set<string>();

const recordEvent = async (eventType: string, item: string, path?: string) => {
  try {
    await trackAnalyticsEvent({
      eventType,
      item,
      path: path || null,
    });
  } catch (error) {
    console.warn('Analytics event failed to record:', error);
  }
};

const aggregateDaily = (rows: Array<{ created_at: string; item: string }>): DailyCount[] => {
  const map = new Map<string, DailyCount>();
  rows.forEach((row) => {
    const date = row.created_at.split('T')[0];
    const key = `${date}::${row.item}`;
    const existing = map.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(key, { date, item: row.item, count: 1 });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date) || b.count - a.count);
};

export const loadAnalytics = async (): Promise<AnalyticsStore> => {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_type, item, created_at')
    .order('created_at', { ascending: false })
    .limit(2000);
  if (error || !data) {
    return {
      pageViews: [],
      testSelections: [],
      contactClicks: [],
      referrals: [],
      liveActions: [],
      visitors: [],
    };
  }
  const byType = (type: string) => data.filter((row) => row.event_type === type);
  return {
    pageViews: aggregateDaily(byType('page_view')),
    testSelections: aggregateDaily(byType('test_selection')),
    contactClicks: aggregateDaily(byType('contact_click')),
    referrals: aggregateDaily(byType('referral_registration')),
    liveActions: aggregateDaily(byType('live_action')),
    visitors: aggregateDaily(byType('visitor')),
  };
};

export const trackPageView = (path: string) => {
  void recordEvent('page_view', path, path);
};

export const trackTestSelection = (testName: string) => {
  void recordEvent('test_selection', testName);
};

export const trackContactClick = (type: 'whatsapp' | 'call') => {
  const label = type === 'whatsapp' ? 'WhatsApp' : 'Call';
  void recordEvent('contact_click', label);
};

export const trackReferralRegistration = () => {
  void recordEvent('referral_registration', 'Referral Registration');
};

export const trackLiveAction = (type: 'live_chat' | 'booking') => {
  const label = type === 'live_chat' ? 'Live Chat Started' : 'Booking Submitted';
  void recordEvent('live_action', label);
};

export const trackDailyVisitor = () => {
  const today = getToday();
  if (inMemoryVisitorSet.has(today)) return;
  inMemoryVisitorSet.add(today);
  void recordEvent('visitor', 'Visitor');
};
