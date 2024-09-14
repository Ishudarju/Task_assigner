import axios from 'axios';

const Instance = axios.create({
  baseURL: "http://localhost:3001", // Correct usage
  headers: { 'Content-Type': 'application/json' }
});

Instance.interceptors.request.use(
  (config) => {
    // Retrieve token from local storage
    const token = localStorage.getItem('auth-token');
    // If token exists, set it in the Authorization header
    if (token) {
      config.headers['Authorization'] = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default Instance;
