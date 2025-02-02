const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const RefreshToken = require('../models/RefreshToken');

// REGISTER
const User = require('../models/user');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Convertir el email a minúsculas
        const normalizedEmail = email.toLowerCase();

        // Verificar si ya existe un usuario con ese username o email
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email: normalizedEmail }]
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario usando el email normalizado
        await User.create({ username, email: normalizedEmail, password: hashedPassword });

        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// LOGIN
router.post('/login', async (req, res) => {
    try {
        console.log('req.body:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Se requieren email y password' });
        }

        // Convertir el email a minúsculas para la búsqueda
        const normalizedEmail = email.toLowerCase();
        console.log(normalizedEmail);
        // Buscar el usuario por email
        const user = await User.findOne({ where: { email: normalizedEmail } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const accessToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { email: user.email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        await RefreshToken.create({
            token: refreshToken,
            userId: user.id,
            deviceInfo: req.headers['user-agent'],
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        res.status(200).json({ message: 'Inicio de sesión exitoso', accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


// REFRESH
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'No se envió el refreshToken' });
    }

    try {
        // Buscar el refresh token en la base de datos
        const storedToken = await RefreshToken.findOne({ where: { token: refreshToken } });
        if (!storedToken) {
            return res.status(403).json({ message: 'Refresh token inválido o revocado' });
        }

        // Verificar el refresh token con jwt
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

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error('Error al procesar refresh token:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// LOGOUT (opcional)
router.delete('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'No se envió el refreshToken' });
    }

    try {
        // Eliminar el refresh token de la base de datos
        const deletedCount = await RefreshToken.destroy({ where: { token: refreshToken } });
        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Refresh token no encontrado' });
        }
        res.status(200).json({ message: 'Se cerró la sesión (refresh token eliminado)' });
    } catch (error) {
        console.error('Error al eliminar el refresh token:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
