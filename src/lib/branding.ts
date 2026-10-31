/** Centralized branding identity for the application */
export const BRAND = {
  name: 'Planora AI',
  company: 'Planora AI',
  tagline: 'Celebration Intelligence & Connected Planning',
  subtitle: 'One connected plan. Every celebration, elevated.',
  shortName: 'Planora AI',
  primaryColor: '#6d28d9',
  supportEmail: 'concierge@planora.ai',
  version: '2.0.0',
} as const;

export type Brand = typeof BRAND;
