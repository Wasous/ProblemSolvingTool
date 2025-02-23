// middleware/auth.js
const jwt = require('jsonwebtoken');
const { Team } = require('../models');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = userData;
        next();
    });
};

// Middleware to verify project access
const verifyProjectAccess = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const { userId } = req.user;

        const teamMember = await Team.findOne({
            where: { project_id: projectId, user_id: userId }
        });

        if (!teamMember) {
            return res.status(403).json({ message: 'No access to this project' });
        }

        req.teamMember = teamMember;
        next();
    } catch (error) {
        console.error('Error verifying project access:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    authenticateToken,
    verifyProjectAccess
};