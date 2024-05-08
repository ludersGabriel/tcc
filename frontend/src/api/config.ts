export const baseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URI
  : 'http://localhost:3000'
