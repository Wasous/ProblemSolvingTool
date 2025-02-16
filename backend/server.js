// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const { connectDB, sequelize } = require('./models');

// Rutas de Autenticación
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/user');
const tagRoutes = require('./routes/tagRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        //await sequelize.sync({ force: true });
        console.log('Base de datos sincronizada.');

        app.use(cookieParser());
        app.use(cors({
            origin: process.env.CLIENT_URL || 'http://localhost:5173', // Cambia por la URL de tu frontend
            credentials: true
        }));
        app.use(express.json());

        // Rutas de autenticación
        app.use('/api/auth', authRoutes);

        // Rutas de proyectos (incluye creación de proyectos, DMAIC, etc.)
        app.use('/api/projects', projectRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/tag', tagRoutes);

        // Ruta de prueba
        app.get('/', (req, res) => {
            res.send('Backend funcionando correctamente :)');
        });

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();
