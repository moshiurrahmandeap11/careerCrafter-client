import axios from "axios";

const axiosIntense = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/v1", 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Add response interceptor for better error handling
axiosIntense.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosIntense;