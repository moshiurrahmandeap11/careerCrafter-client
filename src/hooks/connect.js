import { io } from "socket.io-client";
export function connectWS(){
    return io(import.meta.env.VITE_API_URL || "http://localhost:3000")
}