// Fallback data so /films/:id always renders something reasonable before
// (or if) the real API call resolves. Dates are generated relative to today
// so the demo never looks stale.

function isoDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export const DEMO_FILM = {
  id_film: "demo-6",
  title: "Horizon Bleu",
  synopsis:
    "À la lisière du système solaire, une exploratrice intercepte un signal vieux de mille ans. Une odyssée contemplative sur la mémoire, l'éloignement et ce qui nous relie par-delà le silence.",
  duration_min: 141,
  poster: null,
  actors: "Lina Sarr, Mateo Diallo, Clara Mendès, Youssef Benali",
  director: "Aïssa N'Diaye",
  release_date: isoDate(-1),
  status: "showing",
  category: { name: "Science-fiction" },
};

const DEMO_ROOMS = {
  imax: { id_room: "room-imax", name: "Salle IMAX", capacity: 160, format: "imax", price: 14 },
  salle1: { id_room: "room-1", name: "Salle 1", capacity: 120, format: "standard", price: 9 },
  salle2: { id_room: "room-2", name: "Salle 2", capacity: 70, format: "standard", price: 9 },
  salle4: { id_room: "room-4", name: "Salle 4", capacity: 95, format: "standard", price: 9 },
};

export const DEMO_SCREENINGS = [
  { id_screening: "s1", id_film: "demo-6", date: isoDate(0), time: "14:00", seats_remaining: 142, room: DEMO_ROOMS.imax },
  { id_screening: "s2", id_film: "demo-6", date: isoDate(0), time: "20:45", seats_remaining: 24, room: DEMO_ROOMS.imax },
  { id_screening: "s3", id_film: "demo-6", date: isoDate(1), time: "17:30", seats_remaining: 58, room: DEMO_ROOMS.salle2 },
  { id_screening: "s4", id_film: "demo-6", date: isoDate(1), time: "22:30", seats_remaining: 88, room: DEMO_ROOMS.salle4 },
  { id_screening: "s5", id_film: "demo-6", date: isoDate(2), time: "14:00", seats_remaining: 110, room: DEMO_ROOMS.salle1 },
];