const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { User, RefreshToken } = require('../models');
const {
    generateFingerprint,
    checkForSuspiciousActivity,
    revokeTokenFamily,
    logSecurityEvent
} = require('../utils/securityUtils');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        const normalizedEmail = email.toLowerCase();

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Se requieren email y password' });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ where: { email: normalizedEmail } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const accessToken = jwt.sign(
            { email: user.email, userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const tokenFamily = uuidv4();
        const deviceFingerprint = generateFingerprint(req);

        const refreshToken = jwt.sign(
            {
                email: user.email,
                userId: user.id,
                family: tokenFamily
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        const savedToken = await RefreshToken.create({
            token: refreshToken,
            userId: user.id,
            family: tokenFamily,
            deviceFingerprint,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            isUsed: false,
            isRevoked: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        await logSecurityEvent({
            type: 'login',
            tokenId: savedToken.id,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            accessToken,
            userId: user.id,
            userName: user.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// REFRESH
router.post('/refresh', async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;
    const currentFingerprint = generateFingerprint(req);

    if (!oldRefreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    let storedToken = null;
    try {
        storedToken = await RefreshToken.findOne({
            where: { token: oldRefreshToken },
            include: [{
                model: TokenActivity,
                limit: 5,
                order: [['createdAt', 'DESC']]
            }]
        });

        if (!storedToken) {
            throw new Error('Token not found');
        }

        // Verify token hasn't expired in database
        if (new Date() > storedToken.expiresAt) {
            await revokeTokenFamily(storedToken.family);
            throw new Error('Token expired');
        }

        // Verify token hasn't been revoked
        if (storedToken.isRevoked) {
            throw new Error('Token has been revoked');
        }

        // Verify device fingerprint
        if (storedToken.deviceFingerprint !== currentFingerprint) {
            await revokeTokenFamily(storedToken.family);
            await logSecurityEvent({
                type: 'suspicious_device',
                tokenId: storedToken.id,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });
            throw new Error('Invalid device fingerprint');
        }

        // Check for token reuse
        if (storedToken.isUsed) {
            await revokeTokenFamily(storedToken.family);
            await logSecurityEvent({
                type: 'token_reuse',
                tokenId: storedToken.id,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });
            throw new Error('Token reuse detected');
        }

        // Check for suspicious activity
        const isSuspicious = await checkForSuspiciousActivity(storedToken);
        if (isSuspicious) {
            await revokeTokenFamily(storedToken.family);
            throw new Error('Suspicious activity detected');
        }

        // Mark current token as used BEFORE issuing new ones
        await storedToken.update({ isUsed: true });

        // Generate new tokens
        const userData = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { email: userData.email, userId: userData.userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshToken = jwt.sign(
            { email: userData.email, userId: userData.userId, family: storedToken.family },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Store new refresh token
        await RefreshToken.create({
            token: newRefreshToken,
            userId: userData.userId,
            family: storedToken.family,
            deviceFingerprint: currentFingerprint,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            isUsed: false,
            isRevoked: false,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        // Set new refresh token cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Refresh token error:', error);

        // If we have a token, try to revoke its family
        if (storedToken) {
            await revokeTokenFamily(storedToken.family).catch(console.error);
        }

        // Clear the cookie in any error case
        res.clearCookie('refreshToken');

        return res.status(401).json({
            message: 'Invalid refresh token, please login again'
        });
    }
});

// LOGOUT
router.delete('/logout', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(200).json({ message: 'Already logged out' });
    }

    try {
        // Get the token family and revoke all related tokens
        const storedToken = await RefreshToken.findOne({
            where: { token: refreshToken }
        });

        if (storedToken) {
            // Revoke all tokens in the family
            await revokeTokenFamily(storedToken.family);

            // Log the logout
            await logSecurityEvent({
                type: 'logout',
                tokenId: storedToken.id,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent']
            });
        }

        res.clearCookie('refreshToken');
        return res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Error during logout' });
    }
});

module.exports = router;