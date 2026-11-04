// ============================================================================
// ZUNO ERP — Brand Design System & Tokens
// ============================================================================

export const ZUNO_BRAND = {
  name: 'ZUNO ERP',
  tagline: 'Enterprise Multi-Tenant Cloud ERP',
  colors: {
    primary: '#2563EB',      // Enterprise Blue
    primaryHover: '#1D4ED8',
    secondary: '#0F172A',    // Deep Slate
    accentCyan: '#06B6D4',   // From Zuno Pinwheel
    accentOrange: '#F97316', // From Zuno Pinwheel
    accentMagenta: '#D946EF',// From Zuno Pinwheel
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    borderLight: '#E2E8F0',
    borderDark: '#334155',
    backgroundLight: '#F8FAFC',
    backgroundDark: '#0B0F19',
    cardLight: '#FFFFFF',
    cardDark: '#1E293B',
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
  }
};

export const STATUS_BADGE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  ACTIVE: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  PENDING: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  TRIAL: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
  SUSPENDED: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  LOCKED: { bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  DISABLED: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-300 dark:border-slate-700' },
  EXPIRED: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
  APPROVED: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  REJECTED: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
  DRAFT: { bg: 'bg-zinc-50 dark:bg-zinc-900', text: 'text-zinc-600 dark:text-zinc-400', border: 'border-zinc-200 dark:border-zinc-800' }
};

