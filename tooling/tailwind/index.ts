import type { Config } from "tailwindcss";

export default {
  content: [""],
  theme: {
    extend: {
      fontFamily: {
        "primary": "var(--font-primary)",
        "secondary": "var(--font-secondary)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        "overlay": "rgba(255, 255, 255, 0.16)",
        "orange": "#F9B271",
        "turquoise": "#71F9C8",
        "neutral": {
          "1": "#0A0A0A",
        },
        "purple": {
          "1": "#6A5BE2",
          "2": "#765BE2",
          "3": "#E671F9",
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
