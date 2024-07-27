import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8051/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('Error response:', error.response);

      if (error.response.status === 401) {
        if (window.handleSessionExpiration) {
          window.handleSessionExpiration(); // Call the function to show the session expired dialog
        }
      } else {
        toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'An error occurred'}`, {
          autoClose: 2000,
          theme: 'colored'
        });
      }
    } else if (error.request) {
      console.error('Error request:', error.request);
      toast.error('No response received from server', {
        autoClose: 2000,
        theme: 'colored'
      });
    } else {
      console.error('Error message:', error.message);
      toast.error(`Error: ${error.message}`, {
        autoClose: 2000,
        theme: 'colored'
      });
    }

    return Promise.reject(error);
  }
);

export default api;
