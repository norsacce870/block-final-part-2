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

export default function () {
  const filmsRes = http.get(`${BASE_URL}/films`);
  check(filmsRes, { 'GET /films = 200': (r) => r.status === 200 });

  const categoriesRes = http.get(`${BASE_URL}/categories`);
  check(categoriesRes, { 'GET /categories = 200': (r) => r.status === 200 });

  const screeningsRes = http.get(`${BASE_URL}/screenings`);
  check(screeningsRes, { 'GET /screenings = 200': (r) => r.status === 200 });

  sleep(1); // pause d'1s entre chaque itération d'un VU, pour simuler un comportement humain
}

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
