// routes/user.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models'); // Asegúrate de que en models/index.js exportes User

// Middleware para autenticar el token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Falta el token en la cabecera Authorization' });
    }
    const token = authHeader.split(' ')[1];
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

// Endpoint optimizado para buscar usuarios con paginación
// GET /api/users/search?term=algo&page=1&limit=10
router.get('/search', authenticateToken, async (req, res) => {
    try {
        const term = req.query.term;
        if (!term || term.trim() === '') {
            return res.status(400).json({ message: 'Falta el término de búsqueda' });
        }

        // Parámetros de paginación: página y cantidad de resultados por página
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        // Realizamos la consulta con findAndCountAll para obtener la cantidad total y los resultados de la página
        const { count, rows: users } = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    { username: { [Op.iLike]: `%${term}%` } },
                    { email: { [Op.iLike]: `%${term}%` } }
                ]
            },
            attributes: ['id', 'username', 'email'],
            limit,
            offset,
        });

        const totalPages = Math.ceil(count / limit);
        return res.status(200).json({
            users,
            meta: {
                total: count,
                totalPages,
                currentPage: page,
            }
        });
    } catch (error) {
        console.error('Error en búsqueda de usuarios:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
