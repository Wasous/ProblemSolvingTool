import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as apiLogout, refreshToken as apiRefreshToken } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
    const [loading, setLoading] = useState(true);

    // 🔐 Login: Save token in state AND localStorage
    const login = (token) => {
        setAccessToken(token);
        localStorage.setItem('accessToken', token); // ✅ Save in localStorage
    };

    // 🔄 Refresh token when app loads
    const refreshAccessToken = async () => {
        try {
            const { accessToken } = await apiRefreshToken();
            setAccessToken(accessToken);
            localStorage.setItem('accessToken', accessToken); // ✅ Keep it saved
        } catch (error) {
            console.error('No se pudo refrescar el token', error);
            logout();
        }
    };

    // ❌ Logout: Remove token
    const logout = async () => {
        await apiLogout();
        setAccessToken(null);
        localStorage.removeItem('accessToken'); // ✅ Clear storage
    };

    // 🚀 On app startup, refresh the token
    useEffect(() => {
        refreshAccessToken().finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ accessToken, login, logout, refreshAccessToken }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 🎯 Hook to use auth state anywhere
export const useAuth = () => useContext(AuthContext);
