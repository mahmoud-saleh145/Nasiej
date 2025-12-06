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

        background: {
          DEFAULT: "#f7f3ed", // الخلفية العامة
          light: "#fcfaf8",    // خلفية فاتحة جدًا
          dark: "#e8dfd3",     // خلفية أغمق بسيطة
        },
        buttons: {
          DEFAULT: "#c8a97e",  // الزرار الرئيسي أو اللون البارز
          hover: "#b38b65",
          disabled: "#e0d2ba"    // لون الـ hover أو التأكيد
        },
        accent: {
          DEFAULT: "#d5c4a1",  // لتفاصيل الكروت أو الأزرار الثانوية
        },
        text: {
          DEFAULT: "#3a2f25",  // النص الأساسي
          secondary: "#6f6256", // النص الثانوي
          muted: "#8b8a6d",     // النصوص الخافتة أو التوضيحية
        },
        border: {
          DEFAULT: "#e5ddd3",   // حدود العناصر أو الفواصل
        },
        plus: "#8b8a6d",      // لمسات زيتونية (اختيارية)
      },
    },
  },
  plugins: [],
};

export default config;
