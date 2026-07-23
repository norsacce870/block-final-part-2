/**
 * Test de charge k6 — endpoints principaux (films, screenings, categories)
 *
 * Objectif : mesurer le temps de réponse (p50/p95/p99) sous charge modérée,
 * pour compléter les mesures ponctuelles déjà faites via Telescope/Sentry
 * avec de vraies statistiques agrégées sur plusieurs utilisateurs simultanés.
 *
 * Lancer avec :
 *   k6 run k6-load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'https://backend-production-9734.up.railway.app/api';

export const options = {
  scenarios: {
    charge_moderee: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 10 },  // montée progressive à 10 utilisateurs
        { duration: '30s', target: 10 },  // maintien à 10 utilisateurs
        { duration: '10s', target: 0 },   // retour à 0
      ],
    },
  },
  thresholds: {
    // Seuils indicatifs — à ajuster selon ce qui est jugé acceptable pour le projet
    http_req_duration: ['p(95)<1000'], // 95% des requêtes sous 1 seconde
    http_req_failed: ['rate<0.05'],    // moins de 5% d'erreurs
  },
};

// Date du jour au format YYYY-MM-DD, pour coller au filtre `date` envoyé
// par la page Séances (voir Seances.jsx).
function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function () {
  // ── Accueil : films filtrés par statut côté serveur (status=showing /
  // coming_soon) au lieu du catalogue complet — cf. Accueil.jsx.
  const nowShowingRes = http.get(`${BASE_URL}/films?status=showing&page=1`);
  check(nowShowingRes, { 'GET /films?status=showing = 200': (r) => r.status === 200 });

  const upcomingRes = http.get(`${BASE_URL}/films?status=coming_soon&page=1`);
  check(upcomingRes, { 'GET /films?status=coming_soon = 200': (r) => r.status === 200 });

  const categoriesRes = http.get(`${BASE_URL}/categories`);
  check(categoriesRes, { 'GET /categories = 200': (r) => r.status === 200 });

  sleep(1);

  // ── Séances : séances filtrées par date côté serveur — cf. Seances.jsx.
  const screeningsRes = http.get(`${BASE_URL}/screenings?date=${today()}`);
  check(screeningsRes, { 'GET /screenings?date= = 200': (r) => r.status === 200 });

  sleep(1);

  // ── FilmDetail : séances filtrées par film à partir du premier film à
  // l'affiche récupéré ci-dessus — cf. FilmDetail.jsx.
  let filmId = null;
  try {
    const body = nowShowingRes.json();
    const list = body.data ?? body;
    filmId = list?.[0]?.id_film ?? null;
  } catch (e) {
    filmId = null;
  }

  if (filmId) {
    const filmScreeningsRes = http.get(`${BASE_URL}/screenings?id_film=${filmId}`);
    check(filmScreeningsRes, { 'GET /screenings?id_film= = 200': (r) => r.status === 200 });
  }

  sleep(1); // pause entre chaque itération d'un VU, pour simuler un comportement humain
}

/**
 * Note : les endpoints authentifiés (/bookings, /dashboard/stats, désormais
 * paginés eux aussi — voir BookingController.php et DashboardController.php)
 * ne sont pas couverts ici : ce script n'a pas de session ni d'identifiants
 * de test valides. Si besoin, ajouter un scénario avec un POST /login (ou
 * équivalent Sanctum) préalable pour les inclure.
 */

/**
 * À la fin du test, k6 affiche un résumé avec :
 *   - http_req_duration (avg, min, med, max, p(90), p(95))
 *   - http_req_failed (taux d'échec)
 *   - le nombre total de requêtes effectuées
 *
 * Copier ce résumé (ou faire une capture) pour l'intégrer à
 * audit-performance-baobab.docx, en particulier les valeurs p(95) par
 * endpoint — directement comparables aux mesures Sentry déjà documentées
 * (PERF-08, PERF-09) mais cette fois sous charge réelle plutôt qu'en usage
 * isolé.
 */
