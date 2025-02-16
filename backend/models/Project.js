// models/Project.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const User = require('./user'); // para la FK owner_id

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        defaultValue: 'DMAIC',
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATEONLY,
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
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    problemStatement: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rootCause: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    kpis: {
        type: DataTypes.JSONB, // Permite almacenar múltiples KPIs
        allowNull: true,
    },
    budget: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Podrías agregar otros campos según lo requieras...
});

module.exports = Project;

