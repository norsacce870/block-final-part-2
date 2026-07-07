import { Link } from "react-router-dom";
import Logo from "@/user/components/public/Logo";

// lucide-react dropped brand/logo icons a while back, so these four are
// inlined directly from the design export instead of imported.
function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.2 2H21l-6.4 7.3L22 22h-6.3l-4.9-6.4L5.1 22H2.3l6.9-7.9L2 2h6.5l4.4 5.8zm-1.1 18h1.7L7 3.8H5.2z" />
    </svg>
  );
}
function IconYoutube(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" {...props}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10 9.2l5 2.8-5 2.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14 9V7c0-1 .3-1.5 1.6-1.5H17V2.2C16.5 2.1 15.4 2 14.4 2 11.9 2 10.3 3.5 10.3 6.2V9H7.5v3.5h2.8V22h3.7v-9.5h2.7L17 9z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", icon: IconInstagram, href: "#" },
  { label: "X", icon: IconX, href: "#" },
  { label: "YouTube", icon: IconYoutube, href: "#" },
  { label: "Facebook", icon: IconFacebook, href: "#" },
];

const FOOTER_COLUMNS = [
  {
    title: "Explorer",
    links: [
      { label: "À l'affiche", href: "#films" },
      { label: "Prochainement", href: "#films" },
      { label: "Séances", href: "#films" },
      { label: "Avant-premières", href: "/avant-premieres" },
    ],
  },
  {
    title: "Cinéma",
    links: [
      { label: "Nos salles", href: "/salles" },
      { label: "Tarifs", href: "#tarifs" },
      { label: "Carte abonné", href: "/carte-abonne" },
      { label: "Nous trouver", href: "/contact" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Questions fréquentes", href: "/faq" },
      { label: "Conditions", href: "/conditions" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-6 pb-9 pt-16 sm:px-8">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 md:col-span-1">
          <a href="#top" className="mb-[18px] inline-block text-[var(--text)]">
            <Logo scale={0.85} />
          </a>
          <p className="mb-[22px] max-w-[300px] text-sm font-light leading-[1.65] text-[var(--faint)]">
            On se retrouve sous le baobab. Le cinéma comme un moment partagé,
            une émotion qui rassemble.
          </p>
          <div className="flex gap-[11px]">
            {SOCIALS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-all hover:-translate-y-0.5 hover:border-[#5E94CE]/50 hover:text-[var(--accent2)]"
              >
                <Icon className="h-[17px] w-[17px]" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <div key={column.title}>
            <h4 className="mb-[18px] font-['Sora'] text-[13px] font-semibold tracking-[0.04em] text-[var(--text)]">
              {column.title}
            </h4>
            <div className="flex flex-col gap-3">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="navlink w-fit text-sm text-[var(--faint)] hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1320px] flex-col items-start gap-3 border-t border-[var(--border)] pt-[26px] sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[13px] text-[var(--faint)]">
          © {new Date().getFullYear()} Baobab Cinéma. Tous droits réservés.
        </span>
        <span className="font-mono text-[11px] tracking-[0.08em] text-[rgba(221,230,240,0.4)]">
          Conçu avec soin · Paris · Dakar · Abidjan
        </span>
      </div>
    </footer>
  );
}
