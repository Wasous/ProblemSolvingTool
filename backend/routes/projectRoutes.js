const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Project, Team, DmaicStage, User, Tag } = require('../models');


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
        console.log("Token verificado, userData:", userData);
        req.user = userData;
        next();
    });
}

// =============================================================
// 1. Crear un proyecto (POST /api/projects)
// =============================================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        // Extraemos el userId del token y lo asignamos a owner_id
        const { userId: owner_id } = req.user;
        if (!owner_id) {
            return res.status(400).json({ message: 'No se puede determinar el user_id del token.' });
        }

        // Extraemos los campos del body, incluyendo "tags"
        const { name, description, methodology, start_date, end_date, priority, tags } = req.body;

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

        // Crear la estructura DMAIC inicial
        const stages = ['Define', 'Measure', 'Analyze', 'Improve', 'Control'];
        const dmaicStages = stages.map(stage => ({
            project_id: newProject.id,
            stage_name: stage,
            completed: false,
            data: {},
        }));
        await DmaicStage.bulkCreate(dmaicStages);

        // Agregar al owner en la tabla Team con rol 'Owner'
        await Team.create({
            project_id: newProject.id,
            user_id: owner_id,
            role: 'Owner',
        });

        // Si se incluyen etiquetas en el payload, asociarlas al proyecto
        if (tags && Array.isArray(tags) && tags.length > 0) {
            // Se asume que "tags" es un array de IDs de etiquetas
            await newProject.setTags(tags);
        }

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
// =============================================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { userId: userId } = req.user;
        console.log(userId)
        if (!userId) {
            return res.status(400).json({ message: 'No se puede determinar el user_id del token.' });
        }

        const teams = await Team.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Project,
                    include: [
                        { model: DmaicStage, as: 'dmaicStages' },
                        { model: Tag, as: 'tags' }
                    ],
                },
            ],
        });

        const projects = teams.map(t => ({
            project: t.Project,
            role: t.role,
        }));

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Error al obtener proyectos del usuario:', error);
        res.status(500).json({ message: 'Error interno al obtener proyectos' });
    }
});

// =============================================================
// 3. Asociar usuarios a un proyecto (POST /api/projects/:id/team)
// =============================================================
router.post('/:id/team', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const { userIdToAdd, role } = req.body;
        const { userId: currentUserId } = req.user;

        // Verificar si el proyecto existe
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Verificar que el usuario actual sea el Owner del proyecto
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
        const { data, completed } = req.body;

        const { userId: userId } = req.user;
        const teamMember = await Team.findOne({
            where: { project_id: projectId, user_id: userId },
        });
        if (!teamMember) {
            return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
        }

        const dmaicStage = await DmaicStage.findOne({
            where: { project_id: projectId, stage_name: stage },
        });
        if (!dmaicStage) {
            return res.status(404).json({ message: 'Fase DMAIC no encontrada para este proyecto' });
        }

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
// =============================================================
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const { userId: userId } = req.user;

        // Verificar si el usuario es miembro del proyecto
        const teamMember = await Team.findOne({
            where: { project_id: projectId, user_id: userId },
        });
        if (!teamMember) {
            return res.status(403).json({ message: 'No tienes acceso a este proyecto' });
        }

        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: Team,
                    include: [User],
                    as: 'teamMembers',
                },
                {
                    model: DmaicStage,
                    as: 'dmaicStages',
                },
                {
                    model: Tag,
                    as: 'tags',
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

// =============================================================
// 6. Eliminar un miembro del equipo (DELETE /api/projects/:projectId/team/:userId)
//    -> Solo el owner del proyecto puede eliminar miembros
// =============================================================
router.delete('/:projectId/team/:userId', authenticateToken, async (req, res) => {
    try {
        const { projectId, userId } = req.params;
        const { userId: currentUserId } = req.user;

        // Verificar si el proyecto existe
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }
        // Solo el owner puede eliminar miembros
        if (project.owner_id !== currentUserId) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar miembros de este proyecto' });
        }

        const deletionCount = await Team.destroy({
            where: { project_id: projectId, user_id: userId }
        });
        if (deletionCount === 0) {
            return res.status(404).json({ message: 'Miembro no encontrado en el proyecto' });
        }

        res.status(200).json({ message: 'Miembro eliminado del proyecto' });
    } catch (error) {
        console.error('Error al eliminar miembro del proyecto:', error);
        res.status(500).json({ message: 'Error interno al eliminar miembro' });
    }
});

module.exports = router;
