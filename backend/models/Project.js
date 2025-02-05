// models/Project.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user'); // para la FK owner_id

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Genera un UUID v4 automático
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    methodology: {
        type: DataTypes.ENUM('DMAIC'),
        allowNull: false,
        defaultValue: 'DMAIC', // Ajusta si quieres '8D' por defecto
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATEONLY, // Sólo fecha (sin hora)
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM('High', 'Medium', 'Low'),
        allowNull: false,
        defaultValue: 'Medium',
    },
});

// Definimos la relación con el modelo User, asumiendo que User también tiene un UUID como PK.

module.exports = Project;
