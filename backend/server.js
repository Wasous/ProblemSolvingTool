const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

const { connectDB } = require('./models');
connectDB();

const User = require('./models/user');

const syncDB = async () => {
    try {
        await User.sync(); // Crea la tabla si no existe
        console.log('Tabla de usuarios sincronizada.');
    } catch (error) {
        console.error('Error al sincronizar la tabla:', error);
    }
};

connectDB();
syncDB();

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
