import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Register
export const register = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password }, { withCredentials: true });
    return response.data;
};

// Login
export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
    return response.data; // Returns accessToken, refreshToken is stored in cookies
};

// Refresh access token
export const refreshToken = async () => {
    const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
    return response.data;
};

// Logout
export const logout = async () => {
    const response = await axios.delete(`${API_URL}/auth/logout`, { withCredentials: true });
    return response.data;
};
