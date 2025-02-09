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
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID, // <--- CAMBIAR A UUID
        allowNull: false,
        references: {
            model: 'Users', // Nombre de la tabla real
            key: 'id',
        }
    },
    deviceInfo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

module.exports = RefreshToken;
