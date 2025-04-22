import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1'

const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Create a separate instance for file uploads
export const uploadAxios = axios.create({
  baseURL: BASE_URL, // Replace with your API base URL
  timeout: 5000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Reusable function to add interceptors
const addInterceptors = (instance) => {
  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      // You can add authorization tokens or other custom logic here
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response.data ? response.data : response;
    },
    (error) => {
      console.error('API Error:', error.response ? error.response.data : error.message);
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both instances
addInterceptors(axiosInstance);
addInterceptors(uploadAxios);

export default axiosInstance;