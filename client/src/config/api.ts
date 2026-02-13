import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', // Empty string ensures relative paths work correctly (e.g. /api/todos)
  withCredentials: true,
});

export default api;
