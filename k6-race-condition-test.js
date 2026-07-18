/**
 * Test de charge k6 — PERF-05 : race condition sur seats_remaining
 *
 * Objectif : vérifier si des réservations concurrentes sur une même séance
 * peuvent provoquer une surréservation (plus de billets vendus que de places
 * réellement disponibles), à cause de l'absence de transaction/verrou
 * identifiée dans BookingController::store().
 *
 * Prérequis avant de lancer :
 *   1. Créer (ou identifier) une séance de test avec un nombre de places
 *      CONNU et FAIBLE (ex. 5 places), pour rendre la surréservation facile
 *      à observer avec un nombre raisonnable d'utilisateurs simultanés.
 *   2. Créer plusieurs comptes de test (ou un seul réutilisé — Sanctum
 *      autorise plusieurs tokens actifs par utilisateur, donc un seul compte
 *      suffit pour ce test, chaque VU se connectera indépendamment).
 *   3. Remplacer les valeurs ci-dessous (BASE_URL, TEST_EMAIL, TEST_PASSWORD,
 *      SCREENING_ID) par les vraies valeurs de ton environnement.
 *
 * Lancer avec :
 *   k6 run k6-race-condition-test.js
 *
 * Ou via Docker :
 *   docker run --rm -i grafana/k6 run - < k6-race-condition-test.js
 */

import http from 'k6/http';
import { check } from 'k6';

// ── Configuration à adapter ──────────────────────────────────────────────
const BASE_URL = 'http://localhost/api';
const TEST_EMAIL = 'k6test@baobab.local';
const TEST_PASSWORD = 'K6TestPassword123';
const SCREENING_ID = 3; // remplacer par l'ID réel de la séance de test (2 places)
const SEATS_PER_BOOKING = 1;

// ── Scénario : 40 utilisateurs virtuels, chacun tente une réservation
//    en même temps, sur une séance qui n'a que 2 places ──────────────────
export const options = {
  scenarios: {
    concurrent_booking: {
      executor: 'per-vu-iterations',
      vus: 40,
      iterations: 1,
      maxDuration: '60s',
    },
  },
};

export default function () {
  // 1. Connexion (chaque VU obtient son propre token)
  const loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, { 'login réussi': (r) => r.status === 200 });

  if (loginRes.status !== 200) {
    console.error(`VU échec login: ${loginRes.status} ${loginRes.body}`);
    return;
  }

  const token = JSON.parse(loginRes.body).token;

  // 2. Tentative de réservation, quasi simultanée pour tous les VUs
  // Timestamps encadrant la requête, pour vérifier si les requêtes des
  // différents VUs se sont réellement chevauchées dans le temps (concurrence
  // réelle côté serveur) ou si elles ont été traitées l'une après l'autre
  // (sérialisation par le nombre limité de workers PHP-FPM/Apache, ce qui
  // fausserait l'interprétation d'un résultat "pas de race condition").
  const startedAt = Date.now();
  const bookingRes = http.post(`${BASE_URL}/bookings`, JSON.stringify({
    id_screening: SCREENING_ID,
    seats_count: SEATS_PER_BOOKING,
  }), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const finishedAt = Date.now();

  console.log(`VU${__VU} réservation -> status=${bookingRes.status} start=${startedAt} end=${finishedAt} duration=${finishedAt - startedAt}ms body=${bookingRes.body}`);

  check(bookingRes, {
    'réservation acceptée (201) ou refusée proprement (422)': (r) => r.status === 201 || r.status === 422,
  });
}

/**
 * Après le test :
 *   1. Compte le nombre de réponses 201 (réservations acceptées) dans les logs.
 *   2. Va vérifier en base (phpMyAdmin ou tinker) la valeur de seats_remaining
 *      pour SCREENING_ID :
 *        - Si (places initiales - nombre de 201) == seats_remaining final
 *          et que seats_remaining >= 0 : pas de race condition détectée
 *          (bonne nouvelle, mais peut aussi vouloir dire que la charge/latence
 *          réseau a suffi à sérialiser les requêtes — relancer avec plus de VUs
 *          ou un nombre de places encore plus faible si un doute persiste).
 *        - Si seats_remaining est négatif, ou si le nombre de 201 dépasse le
 *          nombre de places initiales : PERF-05 confirmé en conditions réelles.
 *   3. Documenter le résultat exact (nombre de 201, valeur finale de
 *      seats_remaining) dans audit-performance-baobab.docx.
 */