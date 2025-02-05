// models/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sslEnabled = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        dialect: 'postgres',
        logging: false,
        dialectOptions: sslEnabled
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                }
            }
            : {},
    }
);

module.exports = sequelize;
