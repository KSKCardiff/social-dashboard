const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3F3D6F",
        secondary: "#F9ECDC",
        accent: "#D1BA7D",
        dark: "#0E584B",
        danger: "#D46A4A",
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        trend: {
          primary: "#3F3D6F",
          secondary: "#F9ECDC",
          accent: "#D1BA7D",
          neutral: "#0E584B",
          "base-100": "#FFFFFF",
          info: "#3ABFF8",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#D46A4A",
        },
      },
    ],
    darkTheme: false,
  }
};
