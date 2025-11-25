/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // lavender
        input: 'var(--color-input)', // cream
        ring: 'var(--color-ring)', // rose gold
        background: 'var(--color-background)', // warm white
        foreground: 'var(--color-foreground)', // warm dark brown
        primary: {
          DEFAULT: 'var(--color-primary)', // rose gold
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // cream
          foreground: 'var(--color-secondary-foreground)', // warm dark brown
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // bronze
          foreground: 'var(--color-accent-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // terracotta
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // subtle beige
          foreground: 'var(--color-muted-foreground)', // medium brown
        },
        card: {
          DEFAULT: 'var(--color-card)', // subtle beige
          foreground: 'var(--color-card-foreground)', // warm dark brown
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)', // warm dark brown
        },
        success: {
          DEFAULT: 'var(--color-success)', // sage green
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber
          foreground: 'var(--color-warning-foreground)', // warm dark brown
        },
        error: {
          DEFAULT: 'var(--color-error)', // terracotta
          foreground: 'var(--color-error-foreground)', // white
        },
        cta: {
          DEFAULT: 'var(--color-cta)', // crimson
          foreground: 'var(--color-cta-foreground)', // white
        },
        brand: {
          gold: 'var(--color-brand-gold)', // goldenrod
          pink: 'var(--color-brand-pink)', // pink
          hotPink: 'var(--color-brand-hot-pink)', // hot pink
          beige: 'var(--color-brand-beige)', // beige
          floral: 'var(--color-brand-floral)', // floral white
        },
      },
      fontFamily: {
        headline: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        cta: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        accent: ['Dancing Script', 'cursive'],
      },
      fontSize: {
        xs: 'var(--font-size-xs)', // 12px
        sm: 'var(--font-size-sm)', // 14px
        base: 'var(--font-size-base)', // 16px
        lg: 'var(--font-size-lg)', // 18px
        xl: 'var(--font-size-xl)', // 20px
        '2xl': 'var(--font-size-2xl)', // 24px
        '3xl': 'var(--font-size-3xl)', // 30px
        '4xl': 'var(--font-size-4xl)', // 36px
        '5xl': 'var(--font-size-5xl)', // 48px
        '6xl': 'var(--font-size-6xl)', // 60px
      },
      spacing: {
        xs: 'var(--spacing-xs)', // 8px
        sm: 'var(--spacing-sm)', // 13px
        md: 'var(--spacing-md)', // 21px
        lg: 'var(--spacing-lg)', // 34px
        xl: 'var(--spacing-xl)', // 55px
      },
      borderRadius: {
        sm: 'var(--radius-sm)', // 4px
        DEFAULT: 'var(--radius-md)', // 8px
        md: 'var(--radius-md)', // 8px
        lg: 'var(--radius-lg)', // 12px
        xl: 'var(--radius-xl)', // 16px
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        heartbeat: 'heartbeat 2s ease-in-out infinite',
        fadeIn: 'fadeIn 300ms ease-out',
        slideInRight: 'slideInRight 300ms ease-out',
        slideInLeft: 'slideInLeft 300ms ease-out',
        slideInUp: 'slideInUp 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionTimingFunction: {
        'romantic': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}