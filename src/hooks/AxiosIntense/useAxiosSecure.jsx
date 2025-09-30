import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContexts/AuthContexts';
import axios from 'axios';

const useAxiosSecure = () => {
   const {user}=useContext(AuthContext);
   const instance=axios.create({
    baseURL:import.meta.env.VITE_API_URL || "http://localhost:3000",
    headers:{
            Authorization:`Bearer ${user?.accessToken}`

            
        }
   })
   return instance
}
export default useAxiosSecure;