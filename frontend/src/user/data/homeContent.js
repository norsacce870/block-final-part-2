import { Tv, Volume2, Armchair, Users } from "lucide-react";

// Used while the API request is in flight, and as a graceful fallback if it
// fails — replace with real data from /api/films once your backend is wired
// up. Field names match what the Accueil components expect; adjust here if
// your API serializes films differently.
export const DEMO_NOW_SHOWING = [
  {
    id_film: "demo-1",
    title: "L'Ombre du Baobab",
    category: { name: "Drame" },
    duration_min: 134,
    room: { name: "1" },
    rating: "8.7",
    synopsis:
      "Trois générations d'une même famille se retrouvent autour de l'arbre de leur enfance, le temps d'un dernier été.",
  },
  {
    id_film: "demo-2",
    title: "Sahel",
    category: { name: "Aventure" },
    duration_min: 118,
    room: { name: "3" },
    rating: "8.1",
    synopsis:
      "La traversée d'un désert immense devient une quête intérieure pour un jeune guide en perte de repères.",
  },
  {
    id_film: "demo-3",
    title: "Les Nuits de Dakar",
    category: { name: "Romance" },
    duration_min: 126,
    room: { name: "2" },
    rating: "7.9",
    synopsis:
      "Deux âmes se croisent dans le bouillonnement nocturne d'une ville qui ne dort jamais.",
  },
  {
    id_film: "demo-4",
    title: "Tempête Rouge",
    category: { name: "Thriller" },
    duration_min: 109,
    room: { name: "4" },
    rating: "8.4",
    synopsis:
      "Une journaliste découvre un secret qui pourrait faire tomber toute une ville. Le compte à rebours commence.",
  },
  {
    id_film: "demo-5",
    title: "La Dernière Séance",
    category: { name: "Comédie" },
    duration_min: 112,
    room: { name: "1" },
    rating: "7.6",
    synopsis:
      "Le dernier soir d'un cinéma de quartier réunit ceux qui l'ont fait vivre, entre rires et nostalgie.",
  },
];

export const FEATURED_FILM = {
  id_film: "demo-6",
  title: "Horizon Bleu",
  category: { name: "Science-fiction" },
  duration_min: 141,
  room: { name: "IMAX" },
  rating: "8.9",
  language: "VOSTFR",
  year: "2026",
  synopsis:
    "À la lisière du système solaire, une exploratrice intercepte un signal vieux de mille ans. Une odyssée contemplative sur la mémoire, l'éloignement et ce qui nous relie par-delà le silence.",
};

export const DEMO_UPCOMING = [
  {
    id_film: "demo-up-1",
    title: "Racines",
    release_date: "2026-09-12",
    synopsis:
      "Un homme revient au village de ses ancêtres pour comprendre d'où il vient vraiment.",
  },
  {
    id_film: "demo-up-2",
    title: "Le Fleuve",
    release_date: "2026-10-03",
    synopsis:
      "Le long d'un fleuve légendaire, le destin de tout un peuple se joue au fil de l'eau.",
  },
  {
    id_film: "demo-up-3",
    title: "Étoiles du Désert",
    release_date: "2026-10-24",
    synopsis:
      "Sous un ciel infini, une astronome et un nomade apprennent à lire les mêmes étoiles.",
  },
  {
    id_film: "demo-up-4",
    title: "Kora",
    release_date: "2026-11-14",
    synopsis:
      "La vie d'un musicien dont l'instrument porte la mémoire de toute une lignée.",
  },
];

export const CATEGORY_NAMES = [
  "Tous",
  "Action",
  "Drame",
  "Romance",
  "Science-fiction",
  "Thriller",
  "Comédie",
  "Aventure",
];

export const EXPERIENCE_FEATURES = [
  {
    icon: Tv,
    title: "Écrans IMAX",
    text: "Une image grande comme la vie, d'une netteté absolue, du premier au dernier rang.",
  },
  {
    icon: Volume2,
    title: "Son Dolby Atmos",
    text: "Un son qui vous enveloppe complètement et place chaque détail à sa juste place.",
  },
  {
    icon: Armchair,
    title: "Fauteuils premium",
    text: "Des assises inclinables, spacieuses et chaleureuses, pensées pour le confort.",
  },
  {
    icon: Users,
    title: "Un lieu de partage",
    text: "On vient ensemble, on repart avec un souvenir. Le cinéma comme une retrouvaille.",
  },
];

export const PRICING_TIERS = [
  {
    id: "standard",
    name: "Standard",
    tagline: "La séance, sans compromis.",
    price: "9",
    badge: "",
    perks: ["Écran HD", "Son stéréo", "Placement libre"],
    featured: false,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "L'expérience complète.",
    price: "14",
    badge: "Le plus choisi",
    perks: [
      "Fauteuils inclinables",
      "Écran IMAX",
      "Son Dolby Atmos",
      "Placement réservé",
    ],
    featured: true,
  },
  {
    id: "vip",
    name: "VIP Lounge",
    tagline: "Le grand jeu, rien que pour vous.",
    price: "22",
    badge: "",
    perks: [
      "Salon privé",
      "Service à la place",
      "Boissons incluses",
      "Accès prioritaire",
    ],
    featured: false,
  },
];
