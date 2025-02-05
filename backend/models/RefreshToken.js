// models/RefreshToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const RefreshToken = sequelize.define('RefreshToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deviceInfo: {
        type: DataTypes.STRING, // Opcional: para almacenar detalles del dispositivo
        allowNull: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = RefreshToken;
