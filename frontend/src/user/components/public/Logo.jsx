import { useTheme } from "@/user/context/ThemeProvider";

/**
 * The real brand wordmark (no orb/icon) — kept as a single shared component
 * so the navbar and footer can never drift out of sync with each other.
 *
 * `scale` lets a consumer size it down slightly (e.g. the footer) without
 * duplicating the style block.
 */
export default function Logo({ scale = 1 }) {
  const { theme } = useTheme();
  const color = theme === "dark" ? "#FFFFFF" : "#3A6EA5";

  return (
    <div style={{ lineHeight: 1.1 }}>
      <div
        style={{
          color,
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: `${1.4 * scale}rem`,
          letterSpacing: "-0.05em",
          whiteSpace: "nowrap",
        }}
      >
        BAOBAB
      </div>
      <div
        style={{
          color,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 300,
          fontSize: `${0.78 * scale}rem`,
          letterSpacing: "0.8em",
          marginTop: "2px",
          whiteSpace: "nowrap",
        }}
      >
        CINÉMA
      </div>
    </div>
  );
}
