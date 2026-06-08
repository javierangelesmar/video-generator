import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Two explicit themes — never auto-invert (per Docplanner/guide)
  darkMode: ['class', '[data-theme="patient"]'],
  theme: {
    extend: {
      colors: {
        // ── Semantic tokens mapped to CSS vars per theme ──────────────
        bg:             'var(--color-bg)',
        surface:        'var(--color-surface)',
        surface2:       'var(--color-surface2)',
        'border-color': 'var(--color-border)',
        primary:        'var(--color-primary)',
        'primary-hover':'var(--color-primary-hover)',
        accent:         'var(--color-accent)',
        text:           'var(--color-text)',
        'text-secondary':'var(--color-text-secondary)',
        success:        'var(--color-success)',
        warning:        'var(--color-warning)',
        danger:         'var(--color-danger)',

        // ── Doctor palette (light mode default) ───────────────────────
        doctor: {
          blue:      '#1A56DB',
          'blue-hv': '#1347B8',
          'blue-bg': '#EBF2FF',
          teal:      '#0BA5A5',
          'teal-hv': '#088D8D',
          'teal-bg': '#E6F7F7',
          bg:        '#F7F9FC',
          surface:   '#FFFFFF',
          text:      '#1F2937',
          secondary: '#6B7280',
          border:    '#E5E7EB',
          divider:   '#F3F4F6',
        },

        // ── Patient palette (dark mode default) ───────────────────────
        // Base: #121212 carbon grey (never #000 — avoids OLED smearing)
        patient: {
          base:    '#121212',
          s1:      '#1E1E1E',
          s2:      '#2C2C2C',
          s3:      '#3A3A3A',
          accent:  '#2DD4BF',        // teal bright (same hue, more saturated)
          alt:     '#3B82F6',        // blue bright alternative
          text:    '#E5E7EB',        // never #FFF — reduces halation
          muted:   '#9CA3AF',
          disabled:'#6B7280',
          success: '#34D399',
          danger:  '#F87171',
          warning: '#FCD34D',
        },

        // ── Clinical state (shared across both themes) ────────────────
        clinical: {
          critical:   '#DC2626',
          severe:     '#DC2626',
          moderate:   '#D97706',
          mild:       '#2563EB',
          normal:     '#16A34A',
          abnormal:   '#D97706',
          info:       '#0BA5A5',
          lifethreat: '#7F1D1D',
        },
      },

      fontFamily: {
        // Inter for Latin + CJK fallback stack (guide: Noto Sans SC / PingFang SC)
        sans: ['Inter var', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'sans-serif'],
        cjk:  ['Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        // Clinical scale — tabular nums for data
        xs:   ['11px', { lineHeight: '1.5' }],
        sm:   ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '1.5' }],
        md:   ['15px', { lineHeight: '1.5' }],
        lg:   ['16px', { lineHeight: '1.5' }],
        xl:   ['18px', { lineHeight: '1.4' }],
        '2xl':['20px', { lineHeight: '1.35' }],
        '3xl':['24px', { lineHeight: '1.3' }],
        '4xl':['30px', { lineHeight: '1.2' }],
      },

      // 8px grid (Watson Design System / Docplanner)
      spacing: {
        '0.5': '4px',  '1': '8px',   '1.5': '12px', '2': '16px',
        '2.5': '20px', '3': '24px',  '4': '32px',   '5': '40px',
        '6': '48px',   '7': '56px',  '8': '64px',   '10': '80px',
        '12': '96px',  '16': '128px',
      },

      borderRadius: {
        sm: '4px', DEFAULT: '8px', md: '8px', lg: '12px',
        xl: '16px', '2xl': '20px', full: '9999px',
      },

      // Motion — Doctor: 100-200ms subtle; Patient: +expressive (Linear style)
      transitionDuration: { fast: '100ms', base: '150ms', slow: '250ms' },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // Elevation via luminance (dark) — not box-shadow on near-black
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-md': '0 4px 12px rgba(0,0,0,0.10)',
        modal: '0 20px 40px rgba(0,0,0,0.18)',
        dropdown: '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
