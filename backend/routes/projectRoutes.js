const express = require('express');
const router = express.Router();
const { Project, Team, DmaicStage, User, Tag } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// =============================================================
// 1. Crear un proyecto (POST /api/projects)
// =============================================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { userId: owner_id } = req.user;
        if (!owner_id) {
            return res.status(400).json({ message: 'No se puede determinar el user_id del token.' });
        }

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

        // Crear la estructura DMAIC inicial con la nueva estructura de datos
        const dmaicStages = [
            {
                stage_name: 'Define',
                project_id: newProject.id,
                completed: false,
                data: {
                    requirements: {
                        problem: { completed: false },
                        scope: { completed: false },
                        impact: { completed: false },
                        stakeholders: { completed: false },
                        team: { completed: false }
                    },
                    inputs: {},
                    tools: [],
                    attachments: [],
                    history: [{
                        action: 'created',
                        timestamp: new Date().toISOString(),
                        userId: owner_id
                    }]
                }
            },
            {
                stage_name: 'Measure',
                project_id: newProject.id,
                completed: false,
                data: {
                    requirements: {
                        metrics: { completed: false },
                        'data-plan': { completed: false },
                        process: { completed: false },
                        variables: { completed: false }
                    },
                    inputs: {},
                    tools: [],
                    attachments: [],
                    history: [{
                        action: 'created',
                        timestamp: new Date().toISOString(),
                        userId: owner_id
                    }]
                }
            },
            {
                stage_name: 'Analyze',
                project_id: newProject.id,
                completed: false,
                data: {
                    requirements: {
                        'root-cause': { completed: false },
                        'data-analysis': { completed: false },
                        validation: { completed: false },
                        opportunities: { completed: false }
                    },
                    inputs: {},
                    tools: [],
                    attachments: [],
                    history: [{
                        action: 'created',
                        timestamp: new Date().toISOString(),
                        userId: owner_id
                    }]
                }
            },
            {
                stage_name: 'Improve',
                project_id: newProject.id,
                completed: false,
                data: {
                    requirements: {
                        solutions: { completed: false },
                        implementation: { completed: false },
                        pilot: { completed: false },
                        results: { completed: false }
                    },
                    inputs: {},
                    tools: [],
                    attachments: [],
                    history: [{
                        action: 'created',
                        timestamp: new Date().toISOString(),
                        userId: owner_id
                    }]
                }
            },
            {
                stage_name: 'Control',
                project_id: newProject.id,
                completed: false,
                data: {
                    requirements: {
                        'control-plan': { completed: false },
                        monitoring: { completed: false },
                        documentation: { completed: false },
                        handover: { completed: false }
                    },
                    inputs: {},
                    tools: [],
                    attachments: [],
                    history: [{
                        action: 'created',
                        timestamp: new Date().toISOString(),
                        userId: owner_id
                    }]
                }
            }
        ];

        await DmaicStage.bulkCreate(dmaicStages);

        // Agregar al owner en la tabla Team con rol 'Owner'
        await Team.create({
            project_id: newProject.id,
            user_id: owner_id,
            role: 'Owner',
        });

        // Si se incluyen etiquetas, asociarlas al proyecto
        if (tags && Array.isArray(tags) && tags.length > 0) {
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
        const { userId } = req.user;
        if (!userId) {
            return res.status(400).json({ message: 'No se puede determinar el user_id del token.' });
        }

        const teams = await Team.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Project,
                    include: [
                        { model: User, as: 'owner' },
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
// 4. Guardar progreso en DMAIC (PUT /api/projects/dmaic/:projectId/:stage)
// =============================================================
router.put('/dmaic/:projectId/:stage', authenticateToken, async (req, res) => {
    try {
        const { projectId, stage } = req.params;
        const { data, completed } = req.body;
        const { userId } = req.user;

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

        // Actualizar datos y mantener historial
        if (data) {
            dmaicStage.data = {
                ...dmaicStage.data,
                ...data,
                history: [
                    ...(dmaicStage.data.history || []),
                    {
                        action: 'update',
                        timestamp: new Date().toISOString(),
                        userId
                    }
                ]
            };
        }

        // Actualizar estado de completado
        if (typeof completed === 'boolean') {
            dmaicStage.completed = completed;
            if (completed) {
                dmaicStage.data.history.push({
                    action: 'completed',
                    timestamp: new Date().toISOString(),
                    userId
                });
            }
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
        const { userId } = req.user;

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
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'username']
                },
                {
                    model: Team,
                    as: 'teamMembers',
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username']
                        }
                    ]
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
// =============================================================
router.delete('/:projectId/team/:userId', authenticateToken, async (req, res) => {
    try {
        const { projectId, userId } = req.params;
        const { userId: currentUserId } = req.user;

        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

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