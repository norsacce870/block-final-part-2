import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, UserCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/user/context/ThemeProvider";
import Logo from "@/user/components/public/Logo";

// ─── wrapper ──────────────────────────────────────────────────────────────────

export default function Auth({ initialMode = "login" }) {
  return (
    <ThemeProvider>
      <AuthContent initialMode={initialMode} />
    </ThemeProvider>
  );
}

// ─── main content ─────────────────────────────────────────────────────────────

function AuthContent({ initialMode }) {
  const navigate = useNavigate();
  const { login, register, loading, isAdmin } = useAuth();
  const fromParam = new URLSearchParams(window.location.search).get("from");
  const [mode, setMode] = useState(initialMode); // "login" | "register"

  // form values
  const [vals, setVals] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [terms, setTerms] = useState(false);

  // errors
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [toast, setToast] = useState("");

  const set = (field) => (e) => {
    setVals((v) => ({ ...v, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: "" }));
    setApiError("");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  // ── validation ───────────────────────────────────────────────────────────────

  const validate = () => {
    const e = {};
    if (mode === "register" && !vals.firstName.trim()) e.firstName = "Le prénom est requis.";
    if (mode === "register" && !vals.lastName.trim()) e.lastName = "Le nom est requis.";
    if (!vals.email.trim()) e.email = "L'adresse e-mail est requise.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) e.email = "Adresse e-mail invalide.";
    if (!vals.password) e.password = "Le mot de passe est requis.";
    else if (vals.password.length < 8) e.password = "8 caractères minimum.";
    if (mode === "register") {
      if (!vals.confirm) e.confirm = "Veuillez confirmer le mot de passe.";
      else if (vals.confirm !== vals.password) e.confirm = "Les mots de passe ne correspondent pas.";
      if (!terms) e.terms = "Vous devez accepter les conditions.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── submit ────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError("");
    try {
      if (mode === "login") {
        await login(vals.email, vals.password);
        showToast("Connexion réussie !");
        setTimeout(() => navigate(isAdmin() ? "/admin" : (fromParam || "/")), 800);
      } else {
        await register({
          first_name: vals.firstName,
          last_name: vals.lastName,
          email: vals.email,
          password: vals.password,
          password_confirmation: vals.confirm,
        });
        showToast("Compte créé avec succès !");
        setTimeout(() => navigate("/"), 800);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(" ")
          : "Une erreur est survenue.");
      setApiError(msg);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setErrors({});
    setApiError("");
    setVals({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  };

  // ── tabs style ─────────────────────────────────────────────────────────────

  const tabStyle = (active) => ({
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: active ? "var(--surface, #0B1028)" : "transparent",
    color: active ? "#F9F9F9" : "var(--muted, #A8C0E0)",
    fontFamily: "Sora, sans-serif",
    fontWeight: active ? 600 : 400,
    fontSize: "14px",
    cursor: "pointer",
    transition: "all .25s",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,.35)" : "none",
  });

  const isLogin = mode === "login";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "var(--text, #F9F9F9)",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Cinematic background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 100% at 72% 12%, #17286D 0%, #0A0F2C 50%, #000 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(115deg,rgba(168,192,224,.05) 0 2px,transparent 2px 26px)", opacity: .45, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "-12%", right: "6%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,rgba(58,110,165,.5),rgba(23,40,109,.18) 45%,transparent 70%)", filter: "blur(20px)", animation: "none", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-18%", left: "-6%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(94,148,206,.26),transparent 65%)", filter: "blur(30px)", pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 5, padding: "26px 32px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Logo />
          </Link>
          <Link
            to="/"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--muted, #A8C0E0)", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      {/* Center */}
      <main style={{ position: "relative", zIndex: 5, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 24px 64px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: 452,
            background: "rgba(11,16,40,.62)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            border: "1px solid rgba(168,192,224,.18)",
            borderRadius: 24,
            padding: "38px 36px",
            boxShadow: "0 40px 110px rgba(0,0,0,.6)",
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 26 }}>
            <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 27, letterSpacing: "-.01em", margin: "0 0 7px", color: "var(--text, #F9F9F9)" }}>
              {isLogin ? "Bon retour parmi nous" : "Créer un compte"}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(221,230,240,.55)", margin: 0 }}>
              {isLogin ? "Connectez-vous pour accéder à votre espace." : "Rejoignez Baobab Cinéma en quelques secondes."}
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 5, padding: 5, borderRadius: 14, background: "var(--surface2, #121A3C)", border: "1px solid rgba(168,192,224,.14)", marginBottom: 28 }}>
            <button type="button" onClick={() => { setMode("login"); setErrors({}); setApiError(""); setVals({ firstName: "", lastName: "", email: "", password: "", confirm: "" }); }} style={tabStyle(isLogin)}>
              Connexion
            </button>
            <button type="button" onClick={() => { setMode("register"); setErrors({}); setApiError(""); setVals({ firstName: "", lastName: "", email: "", password: "", confirm: "" }); }} style={tabStyle(!isLogin)}>
              Inscription
            </button>
          </div>

          {/* API error */}
          {apiError && (
            <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 12, background: "rgba(224,138,125,.12)", border: "1px solid rgba(224,138,125,.35)", color: "#E08A7D", fontSize: 13.5, display: "flex", gap: 8, alignItems: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Name fields (register only) */}
            {!isLogin && (
              <div style={{ display: "flex", gap: 12 }}>
                <FloatingField label="Prénom" value={vals.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
                <FloatingField label="Nom" value={vals.lastName} onChange={set("lastName")} error={errors.lastName} autoComplete="family-name" />
              </div>
            )}

            {/* Email */}
            <FloatingField label="Adresse e-mail" type="email" value={vals.email} onChange={set("email")} error={errors.email} autoComplete="email" />

            {/* Password */}
            <FloatingField
              label="Mot de passe"
              type={showPw ? "text" : "password"}
              value={vals.password}
              onChange={set("password")}
              error={errors.password}
              autoComplete={isLogin ? "current-password" : "new-password"}
            >
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Masquer" : "Afficher"}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, borderRadius: 9, border: "none", background: "transparent", color: "var(--muted, #A8C0E0)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </FloatingField>

            {/* Confirm (register only) */}
            {!isLogin && (
              <FloatingField
                label="Confirmer le mot de passe"
                type={showPw ? "text" : "password"}
                value={vals.confirm}
                onChange={set("confirm")}
                error={errors.confirm}
                autoComplete="new-password"
              />
            )}

            {/* Remember / Forgot (login only) */}
            {isLogin && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: -2 }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "var(--muted, #A8C0E0)", cursor: "pointer" }}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ width: 17, height: 17, accentColor: "#3A6EA5", cursor: "pointer" }} />
                  Se souvenir de moi
                </label>
                <button type="button" style={{ background: "none", border: "none", color: "#5E94CE", fontSize: 13.5, fontWeight: 500, cursor: "pointer", padding: 0 }}>
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Terms (register only) */}
            {!isLogin && (
              <div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, lineHeight: 1.5, color: "var(--muted, #A8C0E0)", cursor: "pointer" }}>
                  <input type="checkbox" checked={terms} onChange={(e) => { setTerms(e.target.checked); setErrors((er) => ({ ...er, terms: "" })); }} style={{ width: 17, height: 17, marginTop: 1, accentColor: "#3A6EA5", cursor: "pointer", flexShrink: 0 }} />
                  <span>J'accepte les{" "}
                    <a href="#" style={{ color: "#5E94CE" }}>conditions d'utilisation</a>
                    {" "}et la{" "}
                    <a href="#" style={{ color: "#5E94CE" }}>politique de confidentialité</a>.
                  </span>
                </label>
                {errors.terms && <ErrorMsg>{errors.terms}</ErrorMsg>}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                width: "100%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: 16,
                borderRadius: 13,
                border: "none",
                background: "var(--accent, #3A6EA5)",
                color: "#fff",
                fontFamily: "Sora, sans-serif",
                fontWeight: 600,
                fontSize: 15.5,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 14px 36px rgba(58,110,165,.42)",
                transition: "all .25s",
              }}
            >
              {loading ? "Chargement…" : isLogin ? "Se connecter" : "Créer mon compte"}
              {!loading && <ArrowRight size={17} strokeWidth={2.2} />}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0 20px" }}>
            <span style={{ flex: 1, height: 1, background: "rgba(168,192,224,.16)" }} />
            <span style={{ fontSize: 12, color: "rgba(221,230,240,.45)", fontFamily: "ui-monospace, monospace", letterSpacing: ".06em" }}>OU</span>
            <span style={{ flex: 1, height: 1, background: "rgba(168,192,224,.16)" }} />
          </div>

          {/* Guest */}
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: 14,
              borderRadius: 13,
              border: "1px solid rgba(168,192,224,.18)",
              background: "transparent",
              color: "var(--text, #F9F9F9)",
              fontFamily: "Sora, sans-serif",
              fontWeight: 600,
              fontSize: 14.5,
              cursor: "pointer",
              transition: "all .25s",
            }}
          >
            <UserCircle2 size={17} strokeWidth={1.8} />
            Continuer en tant qu'invité
          </button>

          {/* Switch */}
          <p style={{ textAlign: "center", fontSize: 13.5, color: "var(--muted, #A8C0E0)", margin: "22px 0 0" }}>
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button type="button" onClick={switchMode} style={{ background: "none", border: "none", color: "#5E94CE", font: "600 13.5px Inter, sans-serif", cursor: "pointer", padding: 0 }}>
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 120, display: "flex", alignItems: "center", gap: 13, padding: "15px 22px", borderRadius: 14, background: "var(--surface2, #121A3C)", border: "1px solid rgba(94,148,206,.4)", boxShadow: "0 20px 60px rgba(0,0,0,.5)", whiteSpace: "nowrap" }}>
          <span style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(58,110,165,.25)", color: "#5E94CE", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </span>
          <span style={{ fontSize: 14.5, fontWeight: 500, color: "var(--text, #F9F9F9)" }}>{toast}</span>
        </div>
      )}
    </div>
  );
}

// ─── floating label field ─────────────────────────────────────────────────────

function FloatingField({ label, type = "text", value, onChange, error, children, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value !== "";

  return (
    <div>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          placeholder=" "
          style={{
            width: "100%",
            background: "var(--surface2, #121A3C)",
            border: `1px solid ${error ? "#E08A7D" : focused ? "#5E94CE" : "rgba(168,192,224,.16)"}`,
            boxShadow: error
              ? "0 0 0 4px rgba(224,138,125,.12)"
              : focused
              ? "0 0 0 4px rgba(94,148,206,.13)"
              : "none",
            borderRadius: 13,
            padding: children ? "23px 50px 9px 16px" : "23px 16px 9px",
            color: "var(--text, #F9F9F9)",
            font: "15px Inter, system-ui, sans-serif",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color .25s, box-shadow .25s",
          }}
        />
        <label
          style={{
            position: "absolute",
            left: 16,
            top: floated ? 8 : 16,
            fontSize: floated ? 10.5 : 15,
            letterSpacing: floated ? ".04em" : "normal",
            textTransform: floated ? "uppercase" : "none",
            color: floated ? "#5E94CE" : "rgba(221,230,240,.55)",
            pointerEvents: "none",
            transition: "all .2s cubic-bezier(.16,.84,.3,1)",
          }}
        >
          {label}
        </label>
        {children}
      </div>
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </div>
  );
}

// ─── error message ────────────────────────────────────────────────────────────

function ErrorMsg({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, marginLeft: 2, fontSize: 12.5, color: "#E08A7D" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>
      </svg>
      {children}
    </span>
  );
}