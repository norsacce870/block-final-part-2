import jsPDF from "jspdf";

// Baobab Cinéma color palette
const C = {
  bg:       [10,  15,  44],   // #0A0F2C
  surface:  [11,  16,  40],   // #0B1028
  surface2: [18,  26,  60],   // #121A3C
  accent:   [58,  110, 165],  // #3A6EA5
  accent2:  [94,  148, 206],  // #5E94CE
  text:     [249, 249, 249],  // #F9F9F9
  muted:    [168, 192, 224],  // #A8C0E0
  faint:    [120, 140, 180],
  white:    [255, 255, 255],
};

/**
 * Generates and downloads a PDF ticket for a confirmed booking.
 * @param {Object} booking — A booking object from the API (with screening.film and screening.room loaded)
 */
export function generateTicketPDF(booking) {
  const film     = booking.screening?.film;
  const room     = booking.screening?.room;
  const date     = booking.screening?.date;
  const time     = booking.screening?.time?.slice(0, 5);
  const seats    = booking.seats_count;
  const ref      = String(booking.id_booking).padStart(4, "0");

  const dateLabel = date
    ? new Date(date + "T00:00:00").toLocaleDateString("fr-FR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric",
      })
    : "—";

  // A6 landscape — classic cinema ticket proportions
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a6" });
  const W = doc.internal.pageSize.getWidth();  // 148
  const H = doc.internal.pageSize.getHeight(); // 105

  // ── Background ──────────────────────────────────────────────────────────────
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, W, H, "F");

  // Left accent strip
  doc.setFillColor(...C.accent);
  doc.rect(0, 0, 4, H, "F");

  // Header band
  doc.setFillColor(...C.surface2);
  doc.rect(4, 0, W - 4, 26, "F");

  // ── Logo / cinema name ───────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.white);
  doc.text("BAOBAB", 12, 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.muted);
  doc.setCharSpace(4);
  doc.text("CINÉMA", 12.5, 16);
  doc.setCharSpace(0);

  // Booking reference (top right)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...C.faint);
  doc.text(`BILLET · #${ref}`, W - 10, 9, { align: "right" });

  // Status badge
  doc.setFillColor(...C.accent);
  doc.roundedRect(W - 36, 13, 28, 7, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.white);
  doc.text("CONFIRMÉ", W - 22, 17.8, { align: "center" });

  // ── Film title ───────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...C.text);
  const title = film?.title || "Film";
  doc.text(title.length > 22 ? title.slice(0, 21) + "…" : title, 12, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  const subParts = [film?.category?.name, film?.duration_min ? `${Math.floor(film.duration_min / 60)}h${film.duration_min % 60 ? (film.duration_min % 60) : ""}` : null].filter(Boolean);
  if (subParts.length) doc.text(subParts.join("  ·  "), 12, 47);

  // ── Tear line ────────────────────────────────────────────────────────────────
  doc.setDrawColor(...C.surface2);
  doc.setLineWidth(0.4);
  doc.setLineDash([2, 2], 0);
  doc.line(12, 53, W - 18, 53);
  doc.setLineDash([], 0);

  // Notches
  doc.setFillColor(...C.bg);
  doc.circle(4, 53, 3, "F");
  doc.circle(W - 4, 53, 3, "F");

  // ── Info grid ─────────────────────────────────────────────────────────────────
  const infoItems = [
    { label: "DATE",   value: dateLabel },
    { label: "HEURE",  value: time || "—" },
    { label: "SALLE",  value: room?.name || "—" },
    { label: "PLACES", value: String(seats) },
  ];

  const col1X = 12;
  const col2X = 75;
  let rowY = 63;

  infoItems.forEach((item, i) => {
    const x = i % 2 === 0 ? col1X : col2X;
    if (i === 2) rowY = 80;

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...C.faint);
    doc.setCharSpace(1.5);
    doc.text(item.label, x, rowY - 4);
    doc.setCharSpace(0);

    // Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(i === 0 ? 8 : 11);
    doc.setTextColor(...C.text);
    doc.text(item.value, x, rowY + (i === 0 ? 3.5 : 2));
  });

  // ── Barcode placeholder (right side) ──────────────────────────────────────────
  const bcX = W - 36;
  const bcY = 58;
  const bcW = 24;
  const bcH = 30;

  doc.setFillColor(...C.white);
  doc.roundedRect(bcX - 2, bcY - 2, bcW + 4, bcH + 4, 1.5, 1.5, "F");

  // Draw barcode strips
  doc.setFillColor(...C.bg);
  const strips = [2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 1, 3, 2];
  let cx = bcX;
  const unitW = bcW / strips.reduce((a, b) => a + b, 0);
  strips.forEach((w, i) => {
    const bw = w * unitW;
    if (i % 2 === 0) {
      doc.rect(cx, bcY, bw, bcH - 4, "F");
    }
    cx += bw;
  });

  // ── Footer ────────────────────────────────────────────────────────────────────
  doc.setFillColor(...C.surface2);
  doc.rect(4, H - 13, W - 4, 13, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...C.faint);
  doc.text("Présentez ce billet à l'entrée · Annulation gratuite jusqu'à 2h avant la séance", W / 2 + 2, H - 6, { align: "center" });

  doc.setFontSize(5.5);
  doc.setTextColor(...C.accent2);
  doc.text("baobab-cinema.fr", W - 10, H - 3, { align: "right" });

  // ── Save ─────────────────────────────────────────────────────────────────────
  const filename = `billet-${ref}-${(film?.title || "film").toLowerCase().replace(/\s+/g, "-").slice(0, 20)}.pdf`;
  doc.save(filename);
}