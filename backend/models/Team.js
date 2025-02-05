// models/Team.js
const { DataTypes } = require('sequelize');
const Project = require('./Project');
const User = require('./user');
const sequelize = require('./db');

const Team = sequelize.define('Team', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    role: {
        type: DataTypes.ENUM('Owner', 'Member', 'Viewer'),
        allowNull: false,
        defaultValue: 'Member',
    },
    // Si Project y User son UUID, ajusta sus tipos:
    project_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
});

// Opcionalmente, en Project podemos indicar: Project.hasMany(Team, { foreignKey: 'project_id' });
// Y en User, User.hasMany(Team, { foreignKey: 'user_id' });

module.exports = Team;
