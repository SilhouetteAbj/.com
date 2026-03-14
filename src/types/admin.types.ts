export interface AdminStats {
  totalBookings: number;
  totalChats: number;
  totalContacts: number;
  bookingsPendingReview: number;
  unreadChats: number;
  newContactSubmissions: number;
  conversionRate: number;
  averageResponseTime: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentBookings: any[];
  recentChats: any[];
  analyticsData: any;
}
