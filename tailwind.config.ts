import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Crimson Pro", "Georgia", "serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
