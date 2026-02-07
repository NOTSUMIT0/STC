/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // Custom overrides
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        sunset: {
          "primary": "oklch(74.703% 0.158 39.947)",
          "primary-content": "oklch(14.94% 0.031 39.947)",
          "secondary": "oklch(72.537% 0.177 2.72)",
          "secondary-content": "oklch(14.507% 0.035 2.72)",
          "accent": "oklch(71.294% 0.166 299.844)",
          "accent-content": "oklch(14.258% 0.033 299.844)",
          "neutral": "oklch(26% 0.019 237.69)",
          "neutral-content": "oklch(70% 0.019 237.69)",
          "base-100": "oklch(22% 0.019 237.69)",
          "base-200": "oklch(20% 0.019 237.69)",
          "base-300": "oklch(18% 0.019 237.69)",
          "base-content": "oklch(77.383% 0.043 245.096)",
          "info": "oklch(85.559% 0.085 206.015)",
          "info-content": "oklch(17.111% 0.017 206.015)",
          "success": "oklch(85.56% 0.085 144.778)",
          "success-content": "oklch(17.112% 0.017 144.778)",
          "warning": "oklch(85.569% 0.084 74.427)",
          "warning-content": "oklch(17.113% 0.016 74.427)",
          "error": "oklch(85.511% 0.078 16.886)",
          "error-content": "oklch(17.102% 0.015 16.886)",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25rem",
          "--animation-input": "0.25rem",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        lemonade: {
          "primary": "oklch(58.92% 0.199 134.6)",
          "primary-content": "oklch(11.784% 0.039 134.6)",
          "secondary": "oklch(77.75% 0.196 111.09)",
          "secondary-content": "oklch(15.55% 0.039 111.09)",
          "accent": "oklch(85.39% 0.201 100.73)",
          "accent-content": "oklch(17.078% 0.04 100.73)",
          "neutral": "oklch(30.98% 0.075 108.6)",
          "neutral-content": "oklch(86.196% 0.015 108.6)",
          "base-100": "oklch(98.71% 0.02 123.72)",
          "base-200": "oklch(91.8% 0.018 123.72)",
          "base-300": "oklch(84.89% 0.017 123.72)",
          "base-content": "oklch(19.742% 0.004 123.72)",
          "info": "oklch(86.19% 0.047 224.14)",
          "info-content": "oklch(17.238% 0.009 224.14)",
          "success": "oklch(86.19% 0.047 157.85)",
          "success-content": "oklch(17.238% 0.009 157.85)",
          "warning": "oklch(86.19% 0.047 102.15)",
          "warning-content": "oklch(17.238% 0.009 102.15)",
          "error": "oklch(86.19% 0.047 25.85)",
          "error-content": "oklch(17.238% 0.009 25.85)",
          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25rem",
          "--animation-input": "0.25rem",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        }
      }
    ],
  },
}
