import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Registro de usuario
export const register = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
};

// Login
export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
};

// Refrescar access token
export const refreshToken = async (refreshToken) => {
    const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
    return response.data;
};

// Logout
export const logout = async (refreshToken) => {
    const response = await axios.delete(`${API_URL}/auth/logout`, { data: { refreshToken } });
    return response.data;
};
