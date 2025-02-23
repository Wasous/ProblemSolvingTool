import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as apiLogout, refreshToken as apiRefreshToken } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

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
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('currentUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);

    const login = (token, userId, userName) => {
        setAccessToken(token);
        setUser({ id: userId, username: userName });
        localStorage.setItem('accessToken', token);
        localStorage.setItem('currentUser', JSON.stringify({ id: userId, username: userName }));
    };

    const refreshAccessToken = async () => {
        try {
            const { accessToken: newToken } = await apiRefreshToken();
            if (!newToken) {
                throw new Error('No se recibió nuevo token');
            }
            setAccessToken(newToken);
            localStorage.setItem('accessToken', newToken);
            return true;
        } catch (error) {
            console.error('Error al refrescar token:', error);
            await logout();
            return false;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
        } catch (error) {
            console.error('Error durante logout:', error);
        }
        setAccessToken(null);
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                if (isTokenExpired(token)) {
                    await refreshAccessToken();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const isAuthenticated = accessToken && !isTokenExpired(accessToken);

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated,
                user,
                login,
                logout,
                refreshAccessToken
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);