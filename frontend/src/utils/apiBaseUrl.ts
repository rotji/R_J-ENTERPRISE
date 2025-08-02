/**
 * This file determines the base URL for API requests.
 *
 * In a production environment, it uses the `VITE_API_BASE_URL_PROD` environment variable.
 * If this is not set, it defaults to a relative path (empty string), which assumes the API
 * is served from the same domain as the frontend.
 *
 * To set this variable for your production deployment, create a `.env.production` file
 * in the `frontend` directory and add the following line:
 * VITE_API_BASE_URL_PROD="https://your-backend-api.com"
 *
 * In development, it uses the `VITE_API_BASE_URL` from `.env.development`.
 */
const apiBaseUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PROD || '' // Fallback to a relative path
    : import.meta.env.VITE_API_BASE_URL;

export default apiBaseUrl;