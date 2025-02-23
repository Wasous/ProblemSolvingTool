// models/TokenActivity.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const TokenActivity = sequelize.define('TokenActivity', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    refreshTokenId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'RefreshTokens',
            key: 'id',
        }
    },
    activity: {
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
    }
});

module.exports = TokenActivity;