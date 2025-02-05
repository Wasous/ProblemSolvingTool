// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Project, Team, DmaicStage, User } = require('../models'); // Ajusta si tu index.js exporta estos

// =============================================================
// Middleware para verificar token y extraer user_id
// =============================================================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Falta el token en la cabecera Authorization' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }
        // Guardamos en req.user el id/email extraído del token:
        req.user = userData;
        // IMPORTANTE: si solo guardas 'email' en el token, aquí no tendrás user.id
        // Podrías buscar el usuario en DB con su email, o incluir user.id en el token al hacer login
        next();
    });
}

// =============================================================
// 1. Crear un proyecto (POST /api/projects)
// =============================================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Asumiendo que al hacer login incluyes el "user.id" en el token, 
        // sino deberás buscar el user en DB a partir de user.email
        const { id: owner_id } = req.user; // user.id proveniente del token
        if (!owner_id) {
            return res.status(400).json({ message: 'No se puede determinar el user_id del token.' });
        }

        const { name, description, methodology, start_date, end_date, priority } = req.body;

        // Validar datos mínimos
        if (!name || !methodology) {
            return res.status(400).json({ message: 'Falta nombre o metodología' });
        }

        // Crear el proyecto
        const newProject = await Project.create({
            name,
            description,
            methodology,
            owner_id,
            start_date,
            end_date,
            priority
        });

        // Opcional: crear la estructura DMAIC inicial
        const stages = ['Define', 'Measure', 'Analyze', 'Improve', 'Control'];
        const dmaicStages = stages.map(stage => ({
            project_id: newProject.id,
            stage_name: stage,
            completed: false,
            data: {},
        }));
        await DmaicStage.bulkCreate(dmaicStages);

        // Opcional: Agregar al owner también en la tabla Team con rol 'Owner'
        await Team.create({
            project_id: newProject.id,
            user_id: owner_id,
            role: 'Owner',
        });

        return res.status(201).json({
            message: 'Proyecto creado exitosamente',
            projectId: newProject.id
        });
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ message: 'Error interno al crear proyecto' });
    }
});

// =============================================================
// 2. Obtener proyectos de un usuario (GET /api/projects)
//    -> Muestra todos los proyectos en los que participa
// =============================================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Nuevamente, asumimos tenemos user.id en el JWT
        const { id: userId } = req.user;
        if (!userId) {
            return res.status(400).json({ message: 'No se puede determinar el user_id del token.' });
        }

        // Buscamos proyectos donde el usuario participa en la tabla Teams
        // para obtener la info del Proyecto y el rol
        const teams = await Team.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Project,
                    include: [{ model: DmaicStage, as: 'dmaicStages' }], // si definiste el alias
                },
            ],
        });

        // Extraer la información de proyectos de los resultados
        const projects = teams.map(t => {
            return {
                project: t.Project,
                role: t.role,
            };
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Error al obtener proyectos del usuario:', error);
        res.status(500).json({ message: 'Error interno al obtener proyectos' });
    }
});

// =============================================================
// 3. Asociar usuarios a un proyecto (POST /api/projects/:id/team)
//    -> Solo el owner del proyecto puede agregar miembros
// =============================================================
router.post('/:id/team', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const { userIdToAdd, role } = req.body;
        // userIdToAdd: ID del usuario que se sumará
        // role: 'Member' o 'Viewer' (por ejemplo)

        const { id: currentUserId } = req.user;

        // Verificar si el proyecto existe
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar que el usuario actual (del token) sea el Owner del proyecto
        if (project.owner_id !== currentUserId) {
            return res.status(403).json({ message: 'No tienes permisos para agregar miembros a este proyecto' });
        }

        // Verificar que el usuario que se quiere agregar exista
        const userToAdd = await User.findByPk(userIdToAdd);
        if (!userToAdd) {
            return res.status(404).json({ message: 'El usuario que deseas agregar no existe' });
        }

        // Evitar duplicados en Team
        const existingTeamMember = await Team.findOne({
            where: { project_id: projectId, user_id: userIdToAdd }
        });
        if (existingTeamMember) {
            return res.status(409).json({ message: 'El usuario ya forma parte del equipo de este proyecto' });
        }

        // Crear el registro en Team
        const newTeamMember = await Team.create({
            project_id: projectId,
            user_id: userIdToAdd,
            role: role || 'Member',
        });

        return res.status(201).json({
            message: 'Usuario agregado al equipo con éxito',
            teamMemberId: newTeamMember.id,
        });
    } catch (error) {
        console.error('Error al asociar usuario al proyecto:', error);
        res.status(500).json({ message: 'Error interno al asociar usuario al proyecto' });
    }
});

// =============================================================
// 4. Guardar progreso en DMAIC (PUT /api/dmaic/:projectId/:stage)
// =============================================================
router.put('/dmaic/:projectId/:stage', authenticateToken, async (req, res) => {
    try {
        const { projectId, stage } = req.params;
        // stage será 'Define' | 'Measure' | 'Analyze' | 'Improve' | 'Control'
        const { data, completed } = req.body;

        // Verificar que el usuario tenga acceso al proyecto (está en Team)
        const { id: userId } = req.user;
        const teamMember = await Team.findOne({
            where: { project_id: projectId, user_id: userId },
        });

        if (!teamMember) {
            return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
        }

        // Buscar el registro DmaicStage correspondiente
        const dmaicStage = await DmaicStage.findOne({
            where: { project_id: projectId, stage_name: stage },
        });

        if (!dmaicStage) {
            return res.status(404).json({ message: 'Fase DMAIC no encontrada para este proyecto' });
        }

        // Actualizar datos
        if (typeof data === 'object') {
            dmaicStage.data = data;
        }
        if (typeof completed === 'boolean') {
            dmaicStage.completed = completed;
        }

        await dmaicStage.save();

        return res.status(200).json({
            message: 'Progreso de DMAIC guardado exitosamente',
            dmaicStage,
        });
    } catch (error) {
        console.error('Error al guardar progreso DMAIC:', error);
        res.status(500).json({ message: 'Error interno al guardar progreso DMAIC' });
    }
});

// =============================================================
// 5. Obtener información de un proyecto (GET /api/projects/:id)
//    -> Incluye detalles del proyecto, su equipo y estado DMAIC
// =============================================================
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        // Verificar que el usuario tenga acceso
        const { id: userId } = req.user;

        // Verificamos primero si el usuario es miembro de este proyecto
        const teamMember = await Team.findOne({
            where: { project_id: projectId, user_id: userId },
        });

        if (!teamMember) {
            return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
        }

        // Cargamos info completa del proyecto
        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: Team,
                    include: [User], // Para saber quiénes están en el equipo
                    as: 'teamMembers',
                },
                {
                    model: DmaicStage,
                    as: 'dmaicStages',
                },
            ],
        });

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        return res.status(200).json({ project });
    } catch (error) {
        console.error('Error al obtener información del proyecto:', error);
        res.status(500).json({ message: 'Error interno al obtener información del proyecto' });
    }
});

module.exports = router;
