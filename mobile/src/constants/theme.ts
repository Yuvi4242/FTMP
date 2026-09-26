export const THEME = {
  colors: {
    // Ultra-fresh culinary dark palette (Deep Obsidian Slate & Botanic Jade)
    canvas: '#0B0F14', // Main app background
    surface: '#131922', // Card & tile background (Dark Mineral Slate)
    surfaceElevated: '#1C2532', // Modal & elevated popover surface
    surfaceSubtle: '#0E141B', // Subtle inset surface
    border: '#222D3B', // Standard container borders
    borderSubtle: '#18202A', // Faint separator lines
    borderActive: '#10B981', // Highlighted element border

    // Brand accent (Fresh Emerald / Botanic Jade)
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    primaryMuted: 'rgba(16, 185, 129, 0.14)',

    // Expiry tier colors
    expiry: {
      critical: '#F87171', // Red: today or tomorrow
      criticalBg: 'rgba(248, 113, 113, 0.14)',
      criticalBorder: 'rgba(248, 113, 113, 0.35)',

      soon: '#FBBF24', // Amber: 2-3 days
      soonBg: 'rgba(251, 191, 36, 0.14)',
      soonBorder: 'rgba(251, 191, 36, 0.35)',

      fresh: '#10B981', // Green: 4+ days
      freshBg: 'rgba(16, 185, 129, 0.14)',
      freshBorder: 'rgba(16, 185, 129, 0.35)',
    },

    // Semantic status colors
    success: '#10B981',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#38BDF8',

    // Typography colors
    textPrimary: '#F8FAFC', // Crisp diamond white headline & primary text
    textSecondary: '#94A3B8', // Neutral cool slate secondary labels
    textMuted: '#64748B', // Helper hints and timestamps
    textInverse: '#0B0F14', // Dark text on bright primary badges
  },

  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    badge: 6,
    input: 12,
    button: 12, // Modern ergonomic rounded rectangle
    card: 16, // Clean modern card radius
    modal: 20,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  typography: {
    fontFamilies: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    sizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 18,
      xl: 22,
      xxl: 28,
    },
  },
};

