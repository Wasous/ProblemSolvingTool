const { Sequelize } = require('sequelize');
require('dotenv').config();

// Convertir el puerto a número, ya que por defecto viene como string desde el .env
const port = parseInt(process.env.DB_PORT, 10);

// Verificar si se requiere conexión SSL
const sslEnabled = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(
    process.env.DB_NAME,    // Nombre de la base de datos
    process.env.DB_USER,    // Usuario
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST,  // Dirección del servidor
        port,                       // Puerto de la base de datos
        dialect: 'postgres',        // Base de datos que estás usando
        logging: false,             // Desactivar logs de SQL
        dialectOptions: sslEnabled ? {
            ssl: {
                require: true,
                // Si tu certificado es auto firmado o necesitas aceptar certificados no verificados
                rejectUnauthorized: false,
            }
        } : {}
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
