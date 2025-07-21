// Returns the correct API base URL for the current environment
const apiBaseUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_BASE_URL_PROD
    : import.meta.env.VITE_API_BASE_URL;

export default apiBaseUrl;