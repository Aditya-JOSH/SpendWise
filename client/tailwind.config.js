module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        backgroundLight: "#fdf6e3",
        backgroundDark: "#282c34",
        textLight: "#000000",
        textDark: "#ffffff",
        toggleLight: "#282c34",
        toggleDark: "#fdf6e3",
      },
    },
  },
  plugins: [],
};
