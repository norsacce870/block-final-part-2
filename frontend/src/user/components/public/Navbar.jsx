import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Sun, Moon, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/user/context/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/user/components/public/Logo";

// Nav link definitions.
// `to`     → hard React Router path (always navigates there)
// `anchor` → section id to scroll to when already on the home page,
//             otherwise navigates to "/" and lets the browser scroll.
const NAV_LINKS = [
  { label: "Films",    anchor: "films" },
  { label: "Séances",  to: "/seances" },
  { label: "Tarifs",   anchor: "tarifs" },
  { label: "À propos", anchor: "experience" },
];

const HOME_PATHS = ["/"];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);

  // Scroll-aware background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Click-outside to close user dropdown
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openSearch = () => { setMenuOpen(false); setSearchOpen((v) => !v); };
  const openMenu  = () => { setSearchOpen(false); setMenuOpen((v) => !v); };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    navigate("/"); // navigate first — PrivateRoute never triggers
    await logout();
  };

  // Smart nav link handler: smooth-scroll on home, navigate otherwise
  const handleNavClick = (e, link) => {
    if (!link.anchor) return; // plain <Link> handles it
    e.preventDefault();
    setMenuOpen(false);
    const isHome = HOME_PATHS.includes(location.pathname);
    if (isHome) {
      document.getElementById(link.anchor)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/?scroll=${link.anchor}`);
    }
  };

  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()
    : "";

  const loggedIn = isAuthenticated();
  const showAdminDashboard = loggedIn && isAdmin();

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <nav
      className="fixed inset-x-0 top-0 z-[60] border-b transition-[background-color,backdrop-filter,border-color,box-shadow] duration-[400ms]"
      style={{
        backgroundColor: scrolled
          ? theme === "dark" ? "rgba(7,11,28,0.74)" : "rgba(249,249,249,0.8)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderColor: scrolled ? "var(--border)" : "transparent",
        boxShadow: scrolled ? "0 8px 36px rgba(0,0,0,0.28)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 py-[18px] sm:gap-10 sm:px-8">

        {/* Logo */}
        <Link to="/" className="shrink-0 text-[var(--text)]">
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <div className="ml-2 hidden items-center gap-[30px] md:flex">
          {NAV_LINKS.map((link) =>
            link.anchor ? (
              <a
                key={link.label}
                href={`#${link.anchor}`}
                onClick={(e) => handleNavClick(e, link)}
                className="navlink text-[14.5px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="navlink text-[14.5px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3.5">

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={openMenu}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-transform active:scale-95 md:hidden"
          >
            {menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </button>

          {/* Search */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Rechercher"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-transform active:scale-95 sm:h-10 sm:w-10"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-transform active:scale-95 sm:h-10 sm:w-10"
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {/* Admin dashboard shortcut */}
          {showAdminDashboard && (
            <Button
              asChild
              className="hidden rounded-full bg-[var(--accent)] px-4 font-['Sora'] font-semibold text-white shadow-[0_8px_26px_rgba(58,110,165,0.32)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent2)] hover:shadow-[0_12px_34px_rgba(58,110,165,0.5)] sm:inline-flex"
            >
              <Link to="/admin" className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            </Button>
          )}

          {/* Auth zone */}
          {loggedIn ? (
            /* Avatar + dropdown */
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="Mon compte"
                className="flex h-10 w-10 items-center justify-center rounded-full font-['Sora'] text-[14px] font-bold text-white shadow-[0_6px_18px_rgba(23,40,109,.45)] transition-transform active:scale-95"
                style={{ background: "linear-gradient(145deg,#3A6EA5,#17286D)", border: "1.5px solid rgba(94,148,206,.45)" }}
              >
                {initials || <User size={17} />}
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+12px)] z-[100] min-w-[200px] overflow-hidden rounded-[14px] border shadow-[0_16px_40px_rgba(0,0,0,.35)]"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                >
                  {/* User info header */}
                  <div className="border-b px-4 py-3.5" style={{ borderColor: "var(--border)" }}>
                    <p className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="mt-0.5 text-[12px]" style={{ color: "var(--muted)" }}>
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profil"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-medium transition-colors hover:bg-[var(--surface2)]"
                    style={{ color: "var(--text)" }}
                  >
                    <User size={15} strokeWidth={1.8} />
                    Mon profil
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 border-t px-4 py-3 text-[14px] font-medium transition-colors hover:bg-[var(--surface2)]"
                    style={{ color: "var(--muted)", borderColor: "var(--border)", background: "transparent" }}
                  >
                    <LogOut size={15} strokeWidth={1.8} />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Connexion + Inscription */
            <>
              <Button
                asChild
                variant="outline"
                className="hidden rounded-full border-[var(--border)] bg-transparent px-[18px] text-[var(--text)] hover:bg-white/5 hover:text-[var(--text)] sm:inline-flex"
              >
                <Link to="/connexion">Connexion</Link>
              </Button>

              <Button
                asChild
                className="rounded-full bg-[var(--accent)] px-4 font-['Sora'] font-semibold text-white shadow-[0_8px_26px_rgba(58,110,165,0.32)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent2)] hover:shadow-[0_12px_34px_rgba(58,110,165,0.5)] sm:px-5"
              >
                <Link to="/inscription">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="border-t border-[var(--border)] px-4 py-4 md:hidden"
          style={{ backgroundColor: "var(--bg)" }}
        >
          <div className="mx-auto flex max-w-[1320px] flex-col gap-1">
            {NAV_LINKS.map((link) =>
              link.anchor ? (
                <a
                  key={link.label}
                  href={`#${link.anchor}`}
                  onClick={(e) => handleNavClick(e, link)}
                  className="rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                >
                  {link.label}
                </Link>
              )
            )}

            {loggedIn ? (
              <>
                {showAdminDashboard && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/profil"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                >
                  <User size={15} />
                  Mon profil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-left text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
                  style={{ background: "transparent", border: "none" }}
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </>
            ) : (
              <Link
                to="/connexion"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--text)] sm:hidden"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-[var(--border)] px-4 py-3 sm:px-8" style={{ backgroundColor: "var(--bg)" }}>
          <div className="mx-auto flex max-w-[1320px] items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface2)] px-5 py-1">
            <Search className="h-[18px] w-[18px] text-[var(--muted)]" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher un film, un genre, un réalisateur…"
              className="w-full bg-transparent py-3 text-[15px] text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none"
            />
          </div>
        </div>
      )}
    </nav>
  );
}