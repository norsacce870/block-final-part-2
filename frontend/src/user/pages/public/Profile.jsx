import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Ticket, CalendarDays, ShieldCheck, LogOut,
  Pencil, Check, X, Download, Clock, Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/user/context/ThemeProvider";
import Navbar from "@/user/components/public/Navbar";
import Footer from "@/user/components/public/Footer";
import api from "@/api/axios";
import { generateTicketPDF } from "@/utils/generateTicketPDF";

// ─── wrapper ──────────────────────────────────────────────────────────────────

export default function Profile() {
  return (
    <ThemeProvider>
      <ProfileContent />
    </ThemeProvider>
  );
}

// ─── status config ────────────────────────────────────────────────────────────

const STATUS = {
  confirmed: { label: "Confirmée",  color: "#7FB98E", bg: "rgba(127,185,142,.16)" },
  pending:   { label: "En attente", color: "#E0A458", bg: "rgba(224,164,88,.16)" },
  expired:   { label: "Expirée",    color: "#8A93A8", bg: "rgba(138,147,168,.16)" },
  cancelled: { label: "Annulée",    color: "#E08A7D", bg: "rgba(224,138,125,.16)" },
};

// ─── main content ─────────────────────────────────────────────────────────────

function ProfileContent() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("infos");

  // bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // info editing
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({ first_name: "", last_name: "", email: "" });
  const [infoBackup, setInfoBackup] = useState(null);
  const [infoError, setInfoError] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);

  // password
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);

  // toast
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (user) {
      setInfo({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    setBookingsLoading(true);
    api
      .get("/bookings")
      .then((res) => {
        const all = res.data?.data ?? res.data ?? [];
        // Filter to current user's bookings only (defensive: API may already do this)
        const mine = all.filter((b) => String(b.user_id) === String(user?.id));
        setBookings(mine.length ? mine : all);
      })
      .catch(() => {})
      .finally(() => setBookingsLoading(false));
  }, [user]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const handleLogout = async () => {
    navigate("/"); // navigate first — PrivateRoute never triggers
    await logout();
  };

  // ── cancel booking ────────────────────────────────────────────────────────

  const cancelBooking = async (bookingId) => {
    if (!confirm("Annuler cette réservation ? Les places seront libérées.")) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b.id_booking !== bookingId));
      showToast("Réservation annulée.");
    } catch {
      showToast("Impossible d'annuler cette réservation.");
    }
  };

  const startEdit = () => {
    setInfoBackup({ ...info });
    setEditing(true);
    setInfoError("");
  };

  const cancelEdit = () => {
    setInfo(infoBackup);
    setEditing(false);
    setInfoError("");
  };

  const saveInfo = async () => {
    if (!info.first_name.trim() || !info.last_name.trim()) {
      setInfoError("Le prénom et le nom sont requis.");
      return;
    }
    setInfoSaving(true);
    try {
      // TODO: set up PUT /api/user (or /api/profile) in your Laravel routes
      await api.put("/user", {
        first_name: info.first_name,
        last_name: info.last_name,
        email: info.email,
      });
      setEditing(false);
      showToast("Informations mises à jour !");
    } catch (err) {
      setInfoError(
        err?.response?.data?.message || "Erreur lors de la sauvegarde."
      );
    } finally {
      setInfoSaving(false);
    }
  };

  // ── password ─────────────────────────────────────────────────────────────

  const savePw = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.current) errs.current = "Requis.";
    if (!pw.next || pw.next.length < 8) errs.next = "8 caractères minimum.";
    if (pw.next !== pw.confirm) errs.confirm = "Les mots de passe ne correspondent pas.";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;

    setPwSaving(true);
    try {
      // TODO: set up PUT /api/user/password in your Laravel routes
      await api.put("/user/password", {
        current_password: pw.current,
        password: pw.next,
        password_confirmation: pw.confirm,
      });
      setPw({ current: "", next: "", confirm: "" });
      showToast("Mot de passe mis à jour !");
    } catch (err) {
      setPwErrors({
        current: err?.response?.data?.message || "Erreur. Vérifiez votre mot de passe actuel.",
      });
    } finally {
      setPwSaving(false);
    }
  };

  // ── derived ───────────────────────────────────────────────────────────────

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase() || "?";
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    : null;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  // ── tabs config ───────────────────────────────────────────────────────────

  const TABS = [
    { id: "infos",        label: "Informations",  icon: User },
    { id: "reservations", label: "Réservations",  icon: CalendarDays },
    { id: "billets",      label: "Billets",        icon: Ticket },
    { id: "securite",     label: "Sécurité",       icon: ShieldCheck },
  ];

  return (
    <div
      className="relative min-h-screen font-sans"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      {/* ── Profile header ── */}
      <header
        className="relative overflow-hidden pb-0 pt-[104px]"
        style={{
          background: "linear-gradient(180deg, #0A0F2C 0%, var(--bg) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Ambient orb */}
        <div
          className="pointer-events-none absolute right-[8%] top-[-40%] h-[680px] w-[680px] rounded-full blur-[20px]"
          style={{ background: "radial-gradient(circle,rgba(58,110,165,.3),transparent 66%)" }}
        />

        <div className="relative mx-auto max-w-[1280px] px-4 pb-8 sm:px-8">
          <div className="flex flex-wrap items-end gap-6">
            {/* Initials avatar */}
            <div
              className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-[28px] border font-['Sora'] text-[38px] font-bold text-white shadow-[0_24px_60px_rgba(23,40,109,.5)]"
              style={{
                background: "linear-gradient(145deg, #3A6EA5, #17286D)",
                borderColor: "rgba(94,148,206,.4)",
              }}
            >
              {initials}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-[220px] pb-1">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1
                  className="font-['Sora'] text-[clamp(26px,3.6vw,40px)] font-bold leading-none tracking-tight"
                  style={{ color: "var(--text)" }}
                >
                  {fullName || "Mon profil"}
                </h1>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold"
                  style={{
                    background: "rgba(94,148,206,.18)",
                    borderColor: "rgba(94,148,206,.4)",
                    color: "#DDE6F0",
                  }}
                >
                  <Star size={12} fill="#5E94CE" stroke="none" />
                  {user?.role === "admin" ? "Administrateur" : "Membre"}
                </span>
              </div>
              <p className="text-[14.5px]" style={{ color: "rgba(221,230,240,.55)" }}>
                {user?.email}
                {memberSince && ` · Membre depuis ${memberSince}`}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3.5 pb-1">
              {[
                { value: bookings.length, label: "Réservations" },
                { value: confirmed, label: "Confirmées" },
                { value: bookings.filter((b) => b.status === "pending").length, label: "En attente" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border px-5 py-3.5 text-center"
                  style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div className="font-['Sora'] text-[26px] font-bold" style={{ color: "var(--text)" }}>
                    {s.value}
                  </div>
                  <div className="mt-0.5 text-[11.5px]" style={{ color: "rgba(221,230,240,.55)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Dashboard grid ── */}
      <main className="mx-auto max-w-[1280px] px-4 pb-24 pt-10 sm:px-8">
        <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-[240px_1fr]">

          {/* Sidebar */}
          <aside>
            <nav
              className="flex flex-row gap-1.5 overflow-x-auto rounded-[18px] border p-2.5 min-[900px]:flex-col"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className="flex shrink-0 items-center gap-3 whitespace-nowrap rounded-[12px] px-4 py-3 text-[14px] font-medium transition-all"
                    style={{
                      background: active ? "linear-gradient(135deg, rgba(58,110,165,.28), rgba(23,40,109,.18))" : "transparent",
                      color: active ? "var(--text)" : "var(--muted)",
                      border: active ? "1px solid rgba(94,148,206,.28)" : "1px solid transparent",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                    {label}
                  </button>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-[14px] font-medium transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--muted)", background: "transparent" }}
            >
              <LogOut size={17} strokeWidth={1.8} />
              Se déconnecter
            </button>
          </aside>

          {/* Content */}
          <section>
            {/* ── Informations ── */}
            {tab === "infos" && (
              <div
                className="rounded-[20px] border p-8"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <h2 className="font-['Sora'] text-[22px] font-semibold" style={{ color: "var(--text)" }}>
                    Informations personnelles
                  </h2>
                  {!editing ? (
                    <button
                      type="button"
                      onClick={startEdit}
                      className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{ borderColor: "var(--border)", color: "var(--muted)", background: "transparent" }}
                    >
                      <Pencil size={14} />
                      Modifier
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FloatField label="Prénom" value={info.first_name} disabled={!editing}
                    onChange={(v) => setInfo((i) => ({ ...i, first_name: v }))} />
                  <FloatField label="Nom" value={info.last_name} disabled={!editing}
                    onChange={(v) => setInfo((i) => ({ ...i, last_name: v }))} />
                  <FloatField label="Adresse e-mail" type="email" value={info.email} disabled={!editing}
                    onChange={(v) => setInfo((i) => ({ ...i, email: v }))} className="sm:col-span-2" />
                </div>

                {infoError && (
                  <p className="mt-4 text-sm" style={{ color: "#E08A7D" }}>{infoError}</p>
                )}

                {editing && (
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={saveInfo}
                      disabled={infoSaving}
                      className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors disabled:opacity-60"
                      style={{ backgroundColor: "var(--accent)", border: "none" }}
                    >
                      <Check size={15} />
                      {infoSaving ? "Enregistrement…" : "Enregistrer"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-colors"
                      style={{ borderColor: "var(--border)", color: "var(--text)", background: "transparent" }}
                    >
                      <X size={15} />
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Réservations ── */}
            {tab === "reservations" && (
              <div className="flex flex-col gap-4">
                {bookingsLoading ? (
                  <Placeholder>Chargement…</Placeholder>
                ) : bookings.length === 0 ? (
                  <Placeholder>Aucune réservation pour l'instant.</Placeholder>
                ) : (
                  bookings.map((b) => {
                    const st = STATUS[b.status] ?? STATUS.expired;
                    return (
                      <article
                        key={b.id_booking}
                        className="flex items-center gap-5 rounded-[18px] border p-5"
                        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                      >
                        {/* Poster placeholder */}
                        <div
                          className="h-24 w-[66px] shrink-0 rounded-[11px] border"
                          style={{
                            backgroundImage: "repeating-linear-gradient(125deg,rgba(168,192,224,.08) 0 2px,transparent 2px 16px),linear-gradient(160deg,#17286D,#0A0F2C 78%)",
                            borderColor: "var(--border)",
                          }}
                        />

                        <div className="flex-1 min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2.5">
                            <h3 className="font-['Sora'] text-[18px] font-semibold" style={{ color: "var(--text)" }}>
                              {b.screening?.film?.title || "Film inconnu"}
                            </h3>
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold"
                              style={{ background: st.bg, borderColor: `${st.color}55`, color: st.color }}
                            >
                              <span className="h-[6px] w-[6px] rounded-full" style={{ background: st.color }} />
                              {st.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 text-[13px]" style={{ color: "var(--muted)" }}>
                            {b.screening?.date && (
                              <span className="flex items-center gap-1.5">
                                <CalendarDays size={14} strokeWidth={1.8} />
                                {new Date(b.screening.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                              </span>
                            )}
                            {b.screening?.time && (
                              <span className="flex items-center gap-1.5">
                                <Clock size={14} strokeWidth={1.8} />
                                {b.screening.time}
                              </span>
                            )}
                            {b.screening?.room?.name && (
                              <span className="flex items-center gap-1.5">
                                <Ticket size={14} strokeWidth={1.8} />
                                {b.screening.room.name}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              {b.seats_count} place{b.seats_count > 1 ? "s" : ""}
                            </span>
                          </div>

                          {/* Expiry info + cancel */}
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            {b.expires_at && b.status === "pending" && (
                              <span className="text-[12px]" style={{ color: "rgba(224,164,88,.85)" }}>
                                ⏱ Expire le {new Date(b.expires_at).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                            {(b.status === "pending" || b.status === "confirmed") && (
                              <button
                                type="button"
                                onClick={() => cancelBooking(b.id_booking)}
                                className="ml-auto text-[12.5px] font-medium rounded-xl border px-6 py-3 text-sm transition-colors"
                                style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text)", cursor: "pointer" }}
                              >
                                Annuler la réservation
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            )}

            {/* ── Billets ── */}
            {tab === "billets" && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {bookingsLoading ? (
                  <Placeholder>Chargement…</Placeholder>
                ) : bookings.filter((b) => b.status === "confirmed").length === 0 ? (
                  <Placeholder>Aucun billet confirmé pour l'instant.</Placeholder>
                ) : (
                  bookings
                    .filter((b) => b.status === "confirmed")
                    .map((b) => (
                      <article
                        key={b.id_booking}
                        className="relative overflow-hidden rounded-[18px] border"
                        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
                      >
                        {/* Ticket header */}
                        <div
                          className="px-6 py-5"
                          style={{ background: "linear-gradient(135deg,rgba(23,40,109,.55),transparent)" }}
                        >
                          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: "#5E94CE" }}>
                            Billet · #{String(b.id_booking).padStart(4, "0")}
                          </div>
                          <h3 className="font-['Sora'] text-[20px] font-bold" style={{ color: "var(--text)" }}>
                            {b.screening?.film?.title || "Film inconnu"}
                          </h3>
                        </div>

                        {/* Tear line */}
                        <div className="relative mx-6">
                          <div className="h-px border-t border-dashed" style={{ borderColor: "var(--border)" }} />
                          <span className="absolute -left-[33px] top-[-9px] h-[18px] w-[18px] rounded-full" style={{ backgroundColor: "var(--bg)" }} />
                          <span className="absolute -right-[33px] top-[-9px] h-[18px] w-[18px] rounded-full" style={{ backgroundColor: "var(--bg)" }} />
                        </div>

                        {/* Ticket details */}
                        <div className="flex items-center gap-4 px-6 py-5">
                          <div className="grid flex-1 grid-cols-2 gap-3.5">
                            {[
                              ["Date", b.screening?.date ? new Date(b.screening.date).toLocaleDateString("fr-FR") : "—"],
                              ["Heure", b.screening?.time || "—"],
                              ["Salle", b.screening?.room?.name || "—"],
                              ["Places", `${b.seats_count}`],
                            ].map(([lbl, val]) => (
                              <div key={lbl}>
                                <div className="text-[10.5px] uppercase tracking-[.08em]" style={{ color: "rgba(221,230,240,.5)" }}>{lbl}</div>
                                <div className="mt-0.5 text-[14px] font-semibold" style={{ color: "var(--text)" }}>{val}</div>
                              </div>
                            ))}
                          </div>
                          {/* QR placeholder */}
                          <div
                            className="h-[74px] w-[74px] shrink-0 rounded-xl p-2"
                            style={{ background: "#F9F9F9" }}
                          >
                            <div
                              className="h-full w-full rounded"
                              style={{
                                backgroundImage: "repeating-linear-gradient(0deg,#0A0F2C 0 3px,transparent 3px 6px),repeating-linear-gradient(90deg,#0A0F2C 0 3px,transparent 3px 6px)",
                              }}
                            />
                          </div>
                        </div>

                        {/* Download (placeholder — PDF generation to be implemented) */}
                        <div className="px-6 pb-6">
                          <button
                            type="button"
                            onClick={() => generateTicketPDF(b)}
                            className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-[14px] font-semibold text-white"
                            style={{ backgroundColor: "var(--accent)", border: "none" }}
                          >
                            <Download size={16} />
                            Télécharger le billet (PDF)
                          </button>
                        </div>
                      </article>
                    ))
                )}
              </div>
            )}

            {/* ── Sécurité ── */}
            {tab === "securite" && (
              <div
                className="max-w-[520px] rounded-[20px] border p-8"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <h2 className="mb-1.5 font-['Sora'] text-[22px] font-semibold" style={{ color: "var(--text)" }}>
                  Mot de passe
                </h2>
                <p className="mb-7 text-[13.5px]" style={{ color: "rgba(221,230,240,.55)" }}>
                  Choisissez un mot de passe d'au moins 8 caractères.
                </p>

                <form onSubmit={savePw} className="flex flex-col gap-4">
                  <PwField label="Mot de passe actuel" value={pw.current} autoComplete="current-password"
                    onChange={(v) => { setPw((p) => ({ ...p, current: v })); setPwErrors((e) => ({ ...e, current: "" })); }}
                    error={pwErrors.current} />
                  <PwField label="Nouveau mot de passe" value={pw.next} autoComplete="new-password"
                    onChange={(v) => { setPw((p) => ({ ...p, next: v })); setPwErrors((e) => ({ ...e, next: "" })); }}
                    error={pwErrors.next} />
                  <PwField label="Confirmer le nouveau mot de passe" value={pw.confirm} autoComplete="new-password"
                    onChange={(v) => { setPw((p) => ({ ...p, confirm: v })); setPwErrors((e) => ({ ...e, confirm: "" })); }}
                    error={pwErrors.confirm} />

                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="mt-1 self-start rounded-xl px-7 py-3.5 text-[14.5px] font-semibold text-white transition-all disabled:opacity-60"
                    style={{ backgroundColor: "var(--accent)", border: "none", boxShadow: "0 10px 28px rgba(58,110,165,.35)" }}
                  >
                    {pwSaving ? "Mise à jour…" : "Mettre à jour"}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-7 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-3.5 whitespace-nowrap rounded-2xl border px-6 py-4 shadow-[0_20px_60px_rgba(0,0,0,.5)]"
          style={{ backgroundColor: "var(--surface2)", borderColor: "rgba(94,148,206,.4)" }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
            style={{ background: "rgba(58,110,165,.25)", color: "#5E94CE" }}
          >
            <Check size={15} strokeWidth={2.5} />
          </span>
          <span className="text-[14.5px] font-medium" style={{ color: "var(--text)" }}>{toast}</span>
        </div>
      )}
    </div>
  );
}

// ─── floating label input (read/write) ───────────────────────────────────────

function FloatField({ label, type = "text", value, onChange, disabled, error, className = "" }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value !== "";

  return (
    <div className={className}>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder=" "
          style={{
            width: "100%",
            background: disabled ? "transparent" : "var(--surface2, #121A3C)",
            border: `1px solid ${error ? "#E08A7D" : focused ? "#5E94CE" : "var(--border)"}`,
            boxShadow: focused && !disabled ? "0 0 0 4px rgba(94,148,206,.13)" : "none",
            borderRadius: 13,
            padding: "23px 16px 9px",
            color: "var(--text)",
            font: "15px Inter, system-ui, sans-serif",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color .25s, box-shadow .25s",
            cursor: disabled ? "default" : "text",
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
            color: floated && !disabled ? "#5E94CE" : "rgba(221,230,240,.55)",
            pointerEvents: "none",
            transition: "all .2s cubic-bezier(.16,.84,.3,1)",
          }}
        >
          {label}
        </label>
      </div>
      {error && (
        <span style={{ display: "block", marginTop: 6, marginLeft: 2, fontSize: 12.5, color: "#E08A7D" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── password field ───────────────────────────────────────────────────────────

function PwField({ label, value, onChange, error, autoComplete }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const floated = focused || value !== "";

  return (
    <div>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          placeholder=" "
          style={{
            width: "100%",
            background: "var(--surface2, #121A3C)",
            border: `1px solid ${error ? "#E08A7D" : focused ? "#5E94CE" : "var(--border)"}`,
            boxShadow: focused ? "0 0 0 4px rgba(94,148,206,.13)" : "none",
            borderRadius: 13,
            padding: "23px 50px 9px 16px",
            color: "var(--text)",
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
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 34, height: 34, border: "none", background: "transparent", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {show
              ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
              : <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>
            }
          </svg>
        </button>
      </div>
      {error && (
        <span style={{ display: "block", marginTop: 6, marginLeft: 2, fontSize: 12.5, color: "#E08A7D" }}>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── empty state placeholder ──────────────────────────────────────────────────

function Placeholder({ children }) {
  return (
    <div
      className="rounded-[20px] border p-12 text-center text-sm"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--muted)" }}
    >
      {children}
    </div>
  );
}