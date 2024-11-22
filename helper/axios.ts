import axios from 'axios';
import { API_URL } from '../constants';
import { getData } from './storage';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async config => {
    const token = await getData('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;
