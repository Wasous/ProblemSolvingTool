// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./models');

// Rutas de Autenticación
const authRoutes = require('./routes/auth');

// Rutas de Proyectos (contiene /api/projects, /dmaic, etc.)
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        //await sequelize.sync({ force: true });
        console.log('Base de datos sincronizada.');

        app.use(cors());
        app.use(express.json());

        // Rutas de autenticación
        app.use('/api/auth', authRoutes);

        // Rutas de proyectos (incluye creación de proyectos, DMAIC, etc.)
        app.use('/api/projects', projectRoutes);

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
