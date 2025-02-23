// routes/dmaicRoutes.js
const express = require('express');
const router = express.Router();
const { DmaicStage } = require('../models');
const { authenticateToken, verifyProjectAccess } = require('../middleware/auth');

// Get DMAIC stage data
router.get('/:projectId/:stage', authenticateToken, verifyProjectAccess, async (req, res) => {
    try {
        const { projectId, stage } = req.params;

        const dmaicStage = await DmaicStage.findOne({
            where: {
                project_id: projectId,
                stage_name: stage
            }
        });

        if (!dmaicStage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        res.status(200).json({ dmaicStage });
    } catch (error) {
        console.error('Error fetching DMAIC stage:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update DMAIC stage data
router.put('/:projectId/:stage', authenticateToken, verifyProjectAccess, async (req, res) => {
    try {
        const { projectId, stage } = req.params;
        const { data, completed } = req.body;
        const { userId } = req.user;

        const dmaicStage = await DmaicStage.findOne({
            where: {
                project_id: projectId,
                stage_name: stage
            }
        });

        if (!dmaicStage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        // Update the stage data
        if (data) {
            dmaicStage.data = {
                ...dmaicStage.data,
                ...data,
                history: [
                    ...(dmaicStage.data.history || []),
                    {
                        action: 'update',
                        timestamp: new Date().toISOString(),
                        userId: userId
                    }
                ]
            };
        }

        // Update completion status if provided
        if (typeof completed === 'boolean') {
            dmaicStage.completed = completed;

            if (completed) {
                // Add completion to history
                dmaicStage.data.history.push({
                    action: 'completed',
                    timestamp: new Date().toISOString(),
                    userId: userId
                });
            }
        }

        await dmaicStage.save();
        res.status(200).json({ dmaicStage });
    } catch (error) {
        console.error('Error updating DMAIC stage:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a tool to the stage
router.post('/:projectId/:stage/tools', authenticateToken, verifyProjectAccess, async (req, res) => {
    try {
        const { projectId, stage } = req.params;
        const { toolType, toolData } = req.body;
        const { userId } = req.user;

        const dmaicStage = await DmaicStage.findOne({
            where: {
                project_id: projectId,
                stage_name: stage
            }
        });

        if (!dmaicStage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        // Create new tool
        const newTool = {
            id: `${toolType}-${Date.now()}`,
            type: toolType,
            data: toolData,
            createdAt: new Date().toISOString(),
            createdBy: userId
        };

        // Add tool to stage data
        dmaicStage.data = {
            ...dmaicStage.data,
            tools: [...(dmaicStage.data.tools || []), newTool],
            history: [
                ...(dmaicStage.data.history || []),
                {
                    action: 'tool_added',
                    toolId: newTool.id,
                    toolType,
                    timestamp: new Date().toISOString(),
                    userId
                }
            ]
        };

        await dmaicStage.save();
        res.status(201).json({ tool: newTool });
    } catch (error) {
        console.error('Error adding tool:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a tool
router.put('/:projectId/:stage/tools/:toolId', authenticateToken, verifyProjectAccess, async (req, res) => {
    try {
        const { projectId, stage, toolId } = req.params;
        const { toolData } = req.body;
        const { userId } = req.user;

        const dmaicStage = await DmaicStage.findOne({
            where: {
                project_id: projectId,
                stage_name: stage
            }
        });

        if (!dmaicStage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        // Update specific tool
        const updatedTools = dmaicStage.data.tools.map(tool => {
            if (tool.id === toolId) {
                return {
                    ...tool,
                    data: toolData,
                    updatedAt: new Date().toISOString(),
                    updatedBy: userId
                };
            }
            return tool;
        });

        // Update stage data
        dmaicStage.data = {
            ...dmaicStage.data,
            tools: updatedTools,
            history: [
                ...(dmaicStage.data.history || []),
                {
                    action: 'tool_updated',
                    toolId,
                    timestamp: new Date().toISOString(),
                    userId
                }
            ]
        };

        await dmaicStage.save();
        res.status(200).json({
            tool: dmaicStage.data.tools.find(t => t.id === toolId)
        });
    } catch (error) {
        console.error('Error updating tool:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a tool
router.delete('/:projectId/:stage/tools/:toolId', authenticateToken, verifyProjectAccess, async (req, res) => {
    try {
        const { projectId, stage, toolId } = req.params;
        const { userId } = req.user;

        const dmaicStage = await DmaicStage.findOne({
            where: {
                project_id: projectId,
                stage_name: stage
            }
        });

        if (!dmaicStage) {
            return res.status(404).json({ message: 'Stage not found' });
        }

        // Filter out the tool to delete
        const updatedTools = dmaicStage.data.tools.filter(tool => tool.id !== toolId);

        // Update stage data
        dmaicStage.data = {
            ...dmaicStage.data,
            tools: updatedTools,
            history: [
                ...(dmaicStage.data.history || []),
                {
                    action: 'tool_deleted',
                    toolId,
                    timestamp: new Date().toISOString(),
                    userId
                }
            ]
        };

        await dmaicStage.save();
        res.status(200).json({ message: 'Tool deleted successfully' });
    } catch (error) {
        console.error('Error deleting tool:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;