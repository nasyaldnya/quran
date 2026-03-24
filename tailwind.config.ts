import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        card:        { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover:     { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary:     { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary:   { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted:       { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent:      { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input:  'hsl(var(--input))',
        ring:   'hsl(var(--ring))',
        gold: {
          50:  '#FEFAED',
          100: '#FDF4D0',
          200: '#FAE59E',
          300: '#F6D060',
          400: '#F2BC2E',
          500: '#C9A028',   // primary gold
          600: '#A07D1E',
          700: '#7A5C14',
          800: '#543D0D',
          900: '#2E2006',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        arabic:  ['Amiri', 'Georgia', 'serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg:   'var(--radius)',
        md:   'calc(var(--radius) - 2px)',
        sm:   'calc(var(--radius) - 4px)',
        xl:   'calc(var(--radius) + 4px)',
        '2xl':'calc(var(--radius) + 8px)',
      },
      backgroundImage: {
        'gold-gradient':  'linear-gradient(135deg, #C9A028 0%, #E8C060 50%, #F6D060 100%)',
        'hero-gradient':  'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(240,30%,15%) 0%, transparent 70%)',
        'card-gradient':  'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
        'shimmer':        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
      },
      animation: {
        'fade-in':       'fade-in 0.6s ease-out',
        'slide-up':      'slide-up 0.5s ease-out',
        'slide-down':    'slide-down 0.3s ease-out',
        'scale-in':      'scale-in 0.3s ease-out',
        'float':         'float 4s ease-in-out infinite',
        'spin-slow':     'spin 12s linear infinite',
        'pulse-gold':    'pulse-gold 2.5s ease-in-out infinite',
        'waveform-1':    'waveform 1.0s ease-in-out infinite',
        'waveform-2':    'waveform 1.2s ease-in-out infinite 0.15s',
        'waveform-3':    'waveform 0.9s ease-in-out infinite 0.3s',
        'waveform-4':    'waveform 1.1s ease-in-out infinite 0.45s',
        'waveform-5':    'waveform 1.3s ease-in-out infinite 0.6s',
        'shimmer':       'shimmer 2.5s linear infinite',
        'glow':          'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 160, 40, 0.2), 0 0 40px rgba(201, 160, 40, 0.1)' },
          '50%':      { boxShadow: '0 0 30px rgba(201, 160, 40, 0.5), 0 0 60px rgba(201, 160, 40, 0.25)' },
        },
        'waveform': {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%':      { transform: 'scaleY(1.6)' },
        },
        'shimmer': {
          from: { backgroundPosition: '200% center' },
          to:   { backgroundPosition: '-200% center' },
        },
        'glow': {
          from: { textShadow: '0 0 10px rgba(201,160,40,0.3)' },
          to:   { textShadow: '0 0 20px rgba(201,160,40,0.7), 0 0 40px rgba(201,160,40,0.3)' },
        },
      },
      boxShadow: {
        'gold':        '0 0 30px rgba(201, 160, 40, 0.3)',
        'gold-sm':     '0 0 15px rgba(201, 160, 40, 0.2)',
        'gold-lg':     '0 0 60px rgba(201, 160, 40, 0.4)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 6px rgba(0,0,0,0.2)',
        'card-hover':  '0 12px 48px rgba(0, 0, 0, 0.6), 0 4px 12px rgba(0,0,0,0.3)',
        'glass':       'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.3)',
        'player':      '0 -4px 40px rgba(0, 0, 0, 0.6), 0 -1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
