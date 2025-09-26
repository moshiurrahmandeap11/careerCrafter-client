import axios from "axios";

const axiosIntense = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosIntense;
