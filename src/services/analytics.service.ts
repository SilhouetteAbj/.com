export const analyticsService = {
  // Track page view
  trackPageView(pageTitle: string): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
        page_title: pageTitle,
        page_path: window.location.pathname,
      });
    }
  },

  // Track event
  trackEvent(eventName: string, eventData?: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, eventData);
    }
  },

  // Track booking submission
  trackBookingSubmission(): void {
    this.trackEvent('booking_submission', {
      event_category: 'engagement',
      event_label: 'user_booked_appointment',
    });
  },

  // Track form submission
  trackFormSubmission(formType: string): void {
    this.trackEvent('form_submission', {
      event_category: 'engagement',
      event_label: `user_submitted_${formType}`,
    });
  },

  // Track chat interaction
  trackChatInteraction(): void {
    this.trackEvent('chat_interaction', {
      event_category: 'engagement',
      event_label: 'user_opened_chat',
    });
  },

  // Track CTA click
  trackCtaClick(ctaName: string): void {
    this.trackEvent('cta_click', {
      event_category: 'engagement',
      event_label: `user_clicked_${ctaName}`,
    });
  },
};
