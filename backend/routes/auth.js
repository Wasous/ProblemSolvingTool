const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const router = express.Router();

// Endpoint para iniciar sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Simulación de usuario (normalmente esto vendría de una base de datos)
    const mockUser = {
        username: 'admin',
        password: '$2a$10$W1q4y5q6w7r8u9vABCD1234Efgh5678Ijklmnopqrstuvwx', // Contraseña encriptada: "123456"
    };

    try {
        // Verificar si el usuario existe
        if (username !== mockUser.username) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, mockUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwt.sign({ username: mockUser.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Respuesta exitosa
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
