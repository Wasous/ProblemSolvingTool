// models/RefreshToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        }
    },
    family: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    deviceFingerprint: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    userAgent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

module.exports = RefreshToken;