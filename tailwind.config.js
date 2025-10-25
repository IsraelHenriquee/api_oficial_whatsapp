/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue'
  ],
  darkMode: 'class',
 

theme: {
  extend: {
    colors: {
      /* --- Sistema base --- */
      background: 'var(--background)',
      foreground: 'var(--foreground)',

      card: {
        DEFAULT: 'var(--card)',
        foreground: 'var(--card-foreground)',
      },
      popover: {
        DEFAULT: 'var(--popover)',
        foreground: 'var(--popover-foreground)',
      },

      /* --- Paleta principal (Roxo minimalista) --- */
      primary: {
        DEFAULT: 'var(--primary)',
        foreground: 'var(--primary-foreground)',
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95',
      },

      secondary: {
        DEFAULT: 'var(--secondary)',
        foreground: 'var(--secondary-foreground)',
      },

      muted: {
        DEFAULT: 'var(--muted)',
        foreground: 'var(--muted-foreground)',
      },

      accent: {
        DEFAULT: 'var(--accent)',
        foreground: 'var(--accent-foreground)',
      },

      destructive: {
        DEFAULT: 'var(--destructive)',
        foreground: 'var(--destructive-foreground)',
      },

      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',

      /* --- Cores para gráficos, dashboards e ilustrações --- */
      chart: {
        1: 'var(--chart-1)',
        2: 'var(--chart-2)',
        3: 'var(--chart-3)',
        4: 'var(--chart-4)',
        5: 'var(--chart-5)',
      },

      /* --- Sidebar / Painéis --- */
      sidebar: {
        DEFAULT: 'var(--sidebar)',
        foreground: 'var(--sidebar-foreground)',
        primary: 'var(--sidebar-primary)',
        'primary-foreground': 'var(--sidebar-primary-foreground)',
        accent: 'var(--sidebar-accent)',
        'accent-foreground': 'var(--sidebar-accent-foreground)',
        border: 'var(--sidebar-border)',
        ring: 'var(--sidebar-ring)',
      },
    },

    /* --- Tipografia refinada --- */
    fontFamily: {
      sans: ['var(--font-sans)', 'Inter', 'Poppins', 'sans-serif'],
      serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
    },

    /* --- Bordas arredondadas modernas --- */
    borderRadius: {
      sm: 'calc(var(--radius) - 4px)',
      md: 'calc(var(--radius) - 2px)',
      lg: 'var(--radius)',
      xl: 'calc(var(--radius) + 6px)',
      '2xl': 'calc(var(--radius) + 10px)',
    },

    /* --- Sombras realistas e consistentes --- */
    boxShadow: {
      '2xs': 'var(--shadow-2xs)',
      xs: 'var(--shadow-xs)',
      sm: 'var(--shadow-sm)',
      DEFAULT: 'var(--shadow)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
      '2xl': 'var(--shadow-2xl)',
    },

    /* --- Gradientes suaves e modernos --- */
    backgroundImage: {
      'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      'gradient-dark': 'linear-gradient(135deg, #1a1525 0%, #2a213a 100%)',
      'gradient-glass':
        'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
    },

    /* --- Transições e animações elegantes --- */
    transitionDuration: {
      DEFAULT: '250ms',
    },
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    /* --- Espacamentos e proporções sutis --- */
    spacing: {
      4.5: '1.125rem',
      18: '4.5rem',
      30: '7.5rem',
    },
  },
},


  plugins: [],
}

