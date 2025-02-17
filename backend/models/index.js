// models/index.js
const sequelize = require('./db');

// Importamos los modelos
const User = require('./user');
const Project = require('./Project');
const Team = require('./Team');
const DmaicStage = require('./DmaicStage');
const RefreshToken = require('./RefreshToken');
const Tag = require('./Tag');

// Definimos las asociaciones
User.hasMany(Project, { foreignKey: 'owner_id', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

// Para Project y Team (uno a muchos)
Project.hasMany(Team, { foreignKey: 'project_id', as: 'teamMembers', onDelete: 'CASCADE' });
Team.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' });

User.hasMany(Team, { foreignKey: 'user_id', as: 'userTeams' });
Team.belongsTo(User, { foreignKey: 'user_id' });

// Para Project y DmaicStage (uno a muchos)
Project.hasMany(DmaicStage, { foreignKey: 'project_id', as: 'dmaicStages', onDelete: 'CASCADE' });
DmaicStage.belongsTo(Project, { foreignKey: 'project_id', onDelete: 'CASCADE' });

User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Para Project y Tag (relación many-to-many)
Project.belongsToMany(Tag, { through: 'ProjectTags', as: 'tags', onDelete: 'CASCADE' });
Tag.belongsToMany(Project, { through: 'ProjectTags', as: 'projects', onDelete: 'CASCADE' });

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
    RefreshToken
};
