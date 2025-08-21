import axios from 'axios';

const api = axios.create({
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const useMock = localStorage.getItem('useMock') === 'true';
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (useMock) config.headers['X-Use-Mock'] = 'true';
  return config;
});

export default api;


