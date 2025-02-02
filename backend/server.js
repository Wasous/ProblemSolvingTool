const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const { connectDB, sequelize } = require('./models'); // Asegúrate de exportar sequelize en index.js
// const User = require('./models/user'); // Ya no es necesario importar User si usas sequelize.sync()

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Conectar a la base de datos
        await connectDB();

        // Sincronizar todos los modelos
        await sequelize.sync();
        console.log('Base de datos sincronizada.');

        // Middlewares
        app.use(cors());
        app.use(express.json());

        // Rutas
        app.use('/api/auth', authRoutes);

        // Ruta inicial
        app.get('/', (req, res) => {
            res.send('Backend funcionando correctamente :)');
        });

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();
