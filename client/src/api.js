// In dev: Vite proxies /api → localhost:5000
// In production: VITE_API_URL should be your Render URL e.g. https://portfolio-backend.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
