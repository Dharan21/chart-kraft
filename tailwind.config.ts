import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        text: "var(--text)",
        success: "var(--success)",
        danger: "var(--danger)",
        disabled: "var(--disabled)",
      },
      fontFamily: {
        sans: ["Roboto", "Open Sans", "Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
