// models/DmaicStage.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Project = require('./Project');

const DmaicStage = sequelize.define('DmaicStage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    stage_name: {
        type: DataTypes.ENUM('Define', 'Measure', 'Analyze', 'Improve', 'Control'),
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    // data se almacena como JSONB
    data: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

// Relación
//DmaicStage.belongsTo(Project, { foreignKey: 'project_id' });

// Opcionalmente, Project.hasMany(DmaicStage, { foreignKey: 'project_id' });

module.exports = DmaicStage;
