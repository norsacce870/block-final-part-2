// Design tokens for the public site, lifted from the Claude Design export.
// Applied as CSS custom properties on the document root so every component
// can reference them with Tailwind arbitrary values, e.g. bg-[var(--surface)].
export const THEMES = {
  dark: {
    "--bg": "#000000",
    "--bg2": "#0A0F2C",
    "--surface": "#0B1028",
    "--surface2": "#121A3C",
    "--border": "rgba(168,192,224,0.14)",
    "--text": "#F9F9F9",
    "--muted": "#A8C0E0",
    "--faint": "rgba(221,230,240,0.55)",
    "--accent": "#3A6EA5",
    "--accent2": "#5E94CE",
    "--chip": "rgba(168,192,224,0.07)",
  },
  light: {
    "--bg": "#F9F9F9",
    "--bg2": "#EEF3FA",
    "--surface": "#FFFFFF",
    "--surface2": "#F1F6FC",
    "--border": "rgba(23,40,109,0.12)",
    "--text": "#0A0F2C",
    "--muted": "#2D3E50",
    "--faint": "rgba(45,62,80,0.62)",
    "--accent": "#3A6EA5",
    "--accent2": "#2C5C92",
    "--chip": "rgba(23,40,109,0.05)",
  },
};

export function applyTheme(theme) {
  const vars = THEMES[theme] ?? THEMES.dark;
  const root = document.documentElement;
  for (const key in vars) {
    root.style.setProperty(key, vars[key]);
  }
}
