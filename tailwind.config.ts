import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
        colors:{
            primaryC: "#0D4DA5",
        }
    },
  },
  darkMode: "class",
};

export default config;
