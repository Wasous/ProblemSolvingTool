const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,    // Nombre de la base de datos
    process.env.DB_USER,    // Usuario
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST,  // Dirección del servidor
        dialect: 'postgres',        // Base de datos que estás usando
        logging: false,             // Desactivar logs de SQL
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

module.exports = { sequelize, connectDB };
