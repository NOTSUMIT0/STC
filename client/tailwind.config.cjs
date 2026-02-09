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
          "base-100": "#16181b",
          "base-200": "#1e2124",
          "base-300": "#0b0c16",
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
      },
      {
        caramellatte: {
          "primary": "oklch(70% 0.14 182.503)",
          "primary-content": "oklch(98% 0.014 180.72)",
          "secondary": "oklch(58% 0.233 277.117)",
          "secondary-content": "oklch(96% 0.018 272.314)",
          "accent": "oklch(72% 0.219 149.579)",
          "accent-content": "oklch(98% 0.018 155.826)",
          "neutral": "oklch(55% 0.195 38.402)",
          "neutral-content": "oklch(98% 0.016 73.684)",
          "base-100": "oklch(98% 0.016 73.684)",
          "base-200": "oklch(95% 0.038 75.164)",
          "base-300": "oklch(90% 0.076 70.697)",
          "base-content": "oklch(40% 0.123 38.172)",
          "info": "oklch(62% 0.214 259.815)",
          "info-content": "oklch(97% 0.014 254.604)",
          "success": "oklch(69% 0.17 162.48)",
          "success-content": "oklch(97% 0.021 166.113)",
          "warning": "oklch(79% 0.184 86.047)",
          "warning-content": "oklch(98% 0.026 102.212)",
          "error": "oklch(65% 0.241 354.308)",
          "error-content": "oklch(97% 0.014 343.198)",
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
      }
    ],
  },
}
