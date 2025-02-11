import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as apiLogout, refreshToken as apiRefreshToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode';  // Ensure default import

// Helper function to check token expiration
const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        return true;
    }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const tokenFromStorage = localStorage.getItem('accessToken');

    const [accessToken, setAccessToken] = useState(tokenFromStorage || null);
    const [loading, setLoading] = useState(true);

    // Login: Save token in state and localStorage
    const login = (token, userId, userName) => {
        setAccessToken(token);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('currentUser', JSON.stringify({ id: userId, username: userName }));
    };

    // Refresh token when app loads or when needed
    const refreshAccessToken = async () => {
        try {
            const { accessToken: newToken } = await apiRefreshToken();
            setAccessToken(newToken);
            localStorage.setItem('accessToken', newToken);
        } catch (error) {
            console.error('No se pudo refrescar el token', error);
            logout();
        }
    };

    // Logout: Remove token from state and storage
    const logout = async () => {
        await apiLogout();
        setAccessToken(null);
        localStorage.removeItem('accessToken');
    };

    // On app startup, attempt to refresh the token
    useEffect(() => {
        refreshAccessToken().finally(() => setLoading(false));
    }, []);

    // Compute isAuthenticated by checking that we have a token and it's not expired.
    const isAuthenticated = accessToken && !isTokenExpired(accessToken);
    // console.log("isTokenExpired(accessToken):", isTokenExpired(accessToken));

    return (
        <AuthContext.Provider value={{ accessToken, isAuthenticated, login, logout, refreshAccessToken }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
