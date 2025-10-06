const BASE_URL = 'https://wedding-photo-api.family-function.workers.dev';

// IMPORTANT: Store your secret key securely, for example, in an environment variable.
// For Create React App, you can use a .env file with REACT_APP_API_SECRET_KEY=...
const API_SECRET_KEY = process.env.REACT_APP_API_SECRET_KEY || 'your-default-secret-key';

/**
 * A helper function for making authenticated API requests to the Cloudflare Worker.
 * @param {string} endpoint - The API endpoint to call (e.g., '/albums').
 * @param {RequestInit} [options] - Optional fetch options.
 * @returns {Promise<any>} - A promise that resolves with the JSON response.
 * @throws {Error} - Throws an error for non-OK responses.
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    ...options.headers,
    'X-Custom-Auth-Key': API_SECRET_KEY,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`API Error: ${response.status} ${response.statusText}`, errorBody);
    throw new Error(`Failed to fetch from ${endpoint}. Server responded with ${response.status}.`);
  }

  // The worker might return JSON or an image blob.
  // We assume JSON here for album/photo lists.
  return response.json();
}

/**
 * Fetches the list of all photo albums.
 * @returns {Promise<Array<{id: string, title: string, cover: string}>>}
 */
export const fetchAlbums = () => apiFetch('/albums');

/**
 * Fetches all photos for a specific album.
 * The 'src' will be a pre-signed URL from the worker.
 * @param {string} albumId - The ID of the album.
 * @returns {Promise<Array<{src: string, width: number, height: number}>>}
 */
export const fetchAlbumPhotos = (albumId) => apiFetch(`/albums/${albumId}`);

/**
 * Constructs the full URL for an image path received from the API.
 * @param {string} relativePath - The relative path of the photo (e.g., 'albums/postwedding/4.png').
 * @returns {string} - The full, absolute URL to the image resource on the worker.
 */
export const getImageUrl = (relativePath) => `${BASE_URL}/${relativePath}`;