// server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const { sequelize, connectDB } = require('./models');

// Rutas de Autenticación
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/user');
const tagRoutes = require('./routes/tagRoutes');
const dmaicRoutes = require('./routes/dmaicRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        //await sequelize.sync({ force: true });
        console.log('Base de datos sincronizada.');
        const allowedOrigins = [
            process.env.CLIENT_URL,
            'http://localhost:5173',  // Development
            'http://localhost:3000'   // Optional: Additional development URL
        ];

        // 2. Create CORS options
        const corsOptions = {
            origin: function (origin, callback) {
                // Allow requests with no origin (like mobile apps or curl requests)
                if (!origin) return callback(null, true);

                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Specify allowed methods
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
            credentials: true,  // Allow credentials (cookies, authorization headers)
            maxAge: 86400,  // Cache preflight request results for 24 hours
            exposedHeaders: ['set-cookie'],
            preflightContinue: false,  // Pass the preflight response to the next handler
            optionsSuccessStatus: 204,  // Some legacy browsers choke on 204
        };
        app.use(cookieParser());
        app.use(cors(corsOptions));
        app.use(express.json());

        // 4. Additional security headers
        app.use((req, res, next) => {
            // Prevent browsers from trying to guess the MIME type
            res.setHeader('X-Content-Type-Options', 'nosniff');

            // Prevent clickjacking
            res.setHeader('X-Frame-Options', 'DENY');

            // Enable XSS filter in browsers
            res.setHeader('X-XSS-Protection', '1; mode=block');

            // Control browser features
            res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');

            next();
        });


        // Rutas de autenticación
        app.use('/api/auth', authRoutes);

        // Rutas de proyectos (incluye creación de proyectos, DMAIC, etc.)
        app.use('/api/projects', projectRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/tags', tagRoutes);
        app.use('/api/dmaic', dmaicRoutes);

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
