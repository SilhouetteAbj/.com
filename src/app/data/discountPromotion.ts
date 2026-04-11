export const HEALTH_DISCOUNT_PERCENT = '5%';

export const HEALTH_DISCOUNT_HEADLINE =
  `Book Online & Get an Instant ${HEALTH_DISCOUNT_PERCENT} Health Discount.`;

export const HEALTH_DISCOUNT_NOTE =
  'Download your discount card after booking and present it at the center to claim your 5% offer.';

export const HEALTH_DISCOUNT_CARD_TITLE = `${HEALTH_DISCOUNT_PERCENT} HEALTH DISCOUNT CARD`;

export const SILHOUETTE_LOGO_SRC = '/icons/icon-192.png';

export const SILHOUETTE_FACILITY_NAME = 'Silhouette Diagnostics Consultants';
export const SILHOUETTE_FACILITY_ADDRESS =
  'NO12 kudang street of monrovia street, wuse2 Abuja Nigeria';
export const SILHOUETTE_FACILITY_MAP_URL =
  'https://maps.app.goo.gl/LBwrBPigCKHQKg4AA?g_st=aw';
export const SILHOUETTE_CONTACT_NUMBERS = ['+2349030002653', '+2349071920849'] as const;

export function formatDiscountIssueDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function createDiscountVoucherId(date = new Date()) {
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SDC-${stamp}-${random}`;
}
