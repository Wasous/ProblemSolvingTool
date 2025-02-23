const crypto = require('crypto');
const { Op } = require('sequelize');
const { RefreshToken, TokenActivity } = require('../models');

const generateFingerprint = (req) => {
    const components = [
        req.headers['user-agent'] || '',
        req.ip,
        req.headers['accept-language'] || '',
        // You could add more unique identifiers
    ];
    return crypto
        .createHash('sha256')
        .update(components.join('|'))
        .digest('hex');
};

const checkForSuspiciousActivity = async (token) => {
    try {
        // Check for multiple refresh attempts in short time
        const recentAttempts = await TokenActivity.count({
            where: {
                refreshTokenId: token.id,
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 5 * 60 * 1000) // last 5 minutes
                }
            }
        });
        if (recentAttempts > 5) return true;

        // Check for multiple IP addresses
        const uniqueIPs = await TokenActivity.count({
            where: { refreshTokenId: token.id },
            distinct: true,
            col: 'ipAddress'
        });
        if (uniqueIPs > 2) return true;

        return false;
    } catch (error) {
        console.error('Error checking for suspicious activity:', error);
        return true; // Fail safe: return suspicious if error occurs
    }
};

const revokeTokenFamily = async (familyId) => {
    try {
        await RefreshToken.update(
            {
                isRevoked: true,
                isUsed: true
            },
            {
                where: {
                    family: familyId,
                    isRevoked: false
                }
            }
        );
    } catch (error) {
        console.error('Error revoking token family:', error);
        throw error;
    }
};

const logSecurityEvent = async (data) => {
    try {
        await TokenActivity.create({
            refreshTokenId: data.tokenId,
            activity: data.type,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent
        });
    } catch (error) {
        console.error('Error logging security event:', error);
        // Don't throw - logging should not break the flow
    }
};

module.exports = {
    generateFingerprint,
    checkForSuspiciousActivity,
    revokeTokenFamily,
    logSecurityEvent
};