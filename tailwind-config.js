// ==========================================
// Vibe5 — Tailwind CDN Configuration
// (must be loaded AFTER the Tailwind CDN script)
// ==========================================

tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        vibe: {
          main: "#14161B",
          header: "#1C2433",
          card: "#1E222B",
          hover: "#2F3745",
          selected: "#22304A",
          textPrimary: "#F5F7FA",
          textSecondary: "#A9B3C1",
          purple: "#6D4BFF",
          cyan: "#39D8FF",
          border: "#333C4A",
        },
      },
    },
  },
};
