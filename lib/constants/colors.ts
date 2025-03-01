export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Neutral colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  // Common colors
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export const themeColors = {
  // UI elements
  background: colors.neutral[50],
  card: colors.white,
  text: colors.neutral[800],
  textSecondary: colors.neutral[500],
  border: colors.neutral[200],
  
  // Interactive elements
  buttonPrimary: colors.primary[500],
  buttonPrimaryText: colors.white,
  buttonSecondary: colors.primary[50],
  buttonSecondaryText: colors.primary[500],
  buttonDanger: colors.danger[500],
  buttonDangerText: colors.white,
  
  // Status indicators
  statusHot: colors.danger[500],
  statusWarm: colors.warning[500],
  statusCold: colors.primary[500],
  
  // Tab bar
  tabBar: colors.white,
  tabBarActive: colors.primary[500],
  tabBarInactive: colors.neutral[500],
  
  // Form elements
  input: colors.white,
  inputBorder: colors.neutral[200],
  inputText: colors.neutral[800],
  inputPlaceholder: colors.neutral[400],
  
  // Misc
  shadow: colors.black,
};