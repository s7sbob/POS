module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          blue: "var(--primary-blue)",
          green: "var(--primary-green)",
          red: "var(--primary-red)",
          orange: "var(--primary-orange)"
        },
        background: {
          main: "var(--bg-main)",
          card: "var(--bg-card)",
          overlayLight: "var(--bg-overlay-light)",
          overlayDark: "var(--bg-overlay-dark)"
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          white: "var(--text-white)",
          blue: "var(--text-blue)"
        }
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif']
      }
    }
  },
  plugins: []
};