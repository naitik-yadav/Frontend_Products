import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the access token from local storage
    const token = localStorage.getItem('access_token'); // Updated to match the new key
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;