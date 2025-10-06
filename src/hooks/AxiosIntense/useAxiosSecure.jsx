import { useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContexts/AuthContexts";

const useAxiosSecure = () => {
  const { user } = useContext(AuthContext);

  // useMemo 
  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
      headers: {
        Authorization: user?.accessToken ? `Bearer ${user.accessToken}` : "",
      },
    });

    // Optional: response interceptor
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("Unauthorized or Forbidden - handle logout here");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [user?.accessToken]);

  return axiosSecure;
};

export default useAxiosSecure;
