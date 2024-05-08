export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.BACKEND_URI
    : 'http://localhost:3000'
