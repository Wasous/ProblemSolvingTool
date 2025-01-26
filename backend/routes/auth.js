const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// "BD" en memoria
const users = [];
// Almacena refresh tokens (en un proyecto real iría en DB)
let refreshTokens = [];

// REGISTER
const User = require('../models/user');

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario
        await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const accessToken = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { username: user.username },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso', accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// REFRESH
router.post('/refresh', (req, res) => {
    // El cliente nos envía el refreshToken (puede ser en el body, headers, cookie, etc.)
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'No se envió el refreshToken' });
    }

    // Verificar si el refreshToken existe en nuestro "almacén"
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ message: 'Refresh token inválido o revocado' });
    }

    // Validar el refreshToken con jwt
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, userData) => {
        if (err) {
            return res.status(403).json({ message: 'Token expirado o inválido' });
        }

        // Generar un nuevo access token
        const newAccessToken = jwt.sign(
            { username: userData.username },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({
            accessToken: newAccessToken
        });
    });
});

// LOGOUT (opcional)
router.delete('/logout', (req, res) => {
    // El cliente envía el refreshToken
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'No se envió el refreshToken' });
    }

    // Eliminar el refreshToken del array
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    res.status(200).json({ message: 'Se cerró la sesión (refresh token eliminado)' });
});

module.exports = router;
