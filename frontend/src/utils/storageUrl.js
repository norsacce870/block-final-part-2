const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const STORAGE_URL = `${API_URL.replace(/\/api\/?$/, '')}/storage/`;

export function getPosterUrl(poster) {
    return poster ? `${STORAGE_URL}${poster}` : null;
}
