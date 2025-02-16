const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Tag = require('../models/Tag');

// Middleware para verificar el token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Falta el token en la cabecera Authorization' });
    }
    const token = authHeader.split(' ')[1]; // Se espera el formato: "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        req.user = userData;
        next();
    });
}

// GET /api/tags - Obtener todas las etiquetas disponibles
router.get('/', authenticateToken, async (req, res) => {
    try {
        const tags = await Tag.findAll({ order: [['name', 'ASC']] });
        res.status(200).json({ tags });
    } catch (error) {
        console.error('Error al obtener tags:', error);
        res.status(500).json({ message: 'Error interno al obtener tags' });
    }
});

// POST /api/tags - Crear una nueva etiqueta
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'El nombre de la etiqueta es obligatorio' });
        }

        // Verificar si la etiqueta ya existe
        const existingTag = await Tag.findOne({ where: { name } });
        if (existingTag) {
            return res.status(409).json({ message: 'La etiqueta ya existe' });
        }

        const newTag = await Tag.create({ name });
        res.status(201).json({ message: 'Etiqueta creada exitosamente', tag: newTag });
    } catch (error) {
        console.error('Error al crear etiqueta:', error);
        res.status(500).json({ message: 'Error interno al crear etiqueta' });
    }
});

module.exports = router;
