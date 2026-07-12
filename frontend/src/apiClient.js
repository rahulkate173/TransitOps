/**
 * apiClient.js
 * Centralized axios instance that auto-attaches the JWT access token
 * from the Redux store to every outgoing request.
 *
 * Import this instead of plain `axios` in every service file.
 */
import axios from "axios";
import { store } from "./store";

const apiClient = axios.create({
    withCredentials: true, // still send cookies (refresh token)
});

// Request interceptor — runs before every request
apiClient.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
