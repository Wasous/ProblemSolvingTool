// models/index.js
const sequelize = require('./db');

// Importamos los modelos
const User = require('./user');
const Project = require('./Project');
const Team = require('./Team');
const DmaicStage = require('./DmaicStage');

// Definimos las asociaciones
User.hasMany(Project, { foreignKey: 'owner_id', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

Project.hasMany(Team, { foreignKey: 'project_id', as: 'teamMembers' });
Team.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(Team, { foreignKey: 'user_id', as: 'userTeams' });
Team.belongsTo(User, { foreignKey: 'user_id' });

Project.hasMany(DmaicStage, { foreignKey: 'project_id', as: 'dmaicStages' });
DmaicStage.belongsTo(Project, { foreignKey: 'project_id' });

// Conexión a la base de datos
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

// Exportamos
module.exports = {
    sequelize,
    connectDB,
    User,
    Project,
    Team,
    DmaicStage,
};
