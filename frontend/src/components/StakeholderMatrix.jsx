import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardContainer from './CardContainer';
import { FaUserPlus, FaTrashAlt, FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';

const StakeholderMatrix = ({ data, onSave, onDelete }) => {
    const [editionMode, setEditionMode] = useState(data.editionMode || false);
    const [editableData, setEditableData] = useState(data);
    const [originalData, setOriginalData] = useState(data);

    // For stakeholder editing
    const [editingStakeholderId, setEditingStakeholderId] = useState(null);
    const [stakeholderForm, setStakeholderForm] = useState({
        name: '',
        role: '',
        interest: 'low',
        power: 'low',
        strategy: '',
    });

    // Save changes
    const handleSave = () => {
        const updatedData = {
            ...editableData,
            editionMode: false
        };

        setEditionMode(false);
        setOriginalData(updatedData);

        if (onSave) {
            onSave(updatedData);
        }
    };

    // Cancel edits
    const handleCancel = () => {
        setEditableData(originalData);
        setEditionMode(false);
        setEditingStakeholderId(null);
    };

    // Update project description
    const handleDescriptionChange = (value) => {
        setEditableData((prevData) => ({
            ...prevData,
            description: value
        }));
    };

    // Add new stakeholder
    const addStakeholder = () => {
        const newStakeholder = {
            id: `stakeholder-${Date.now()}`,
            name: stakeholderForm.name,
            role: stakeholderForm.role,
            interest: stakeholderForm.interest,
            power: stakeholderForm.power,
            strategy: stakeholderForm.strategy,
        };

        const updatedStakeholders = [...(editableData.stakeholders || []), newStakeholder];

        setEditableData((prevData) => ({
            ...prevData,
            stakeholders: updatedStakeholders
        }));

        // Reset form
        setStakeholderForm({
            name: '',
            role: '',
            interest: 'low',
            power: 'low',
            strategy: '',
        });
    };

    // Update stakeholder
    const updateStakeholder = () => {
        if (!editingStakeholderId) return;

        const updatedStakeholders = (editableData.stakeholders || []).map(stakeholder =>
            stakeholder.id === editingStakeholderId
                ? { ...stakeholder, ...stakeholderForm }
                : stakeholder
        );

        setEditableData((prevData) => ({
            ...prevData,
            stakeholders: updatedStakeholders
        }));

        setEditingStakeholderId(null);
        setStakeholderForm({
            name: '',
            role: '',
            interest: 'low',
            power: 'low',
            strategy: '',
        });
    };

    // Edit stakeholder
    const editStakeholder = (stakeholder) => {
        setEditingStakeholderId(stakeholder.id);
        setStakeholderForm({
            name: stakeholder.name,
            role: stakeholder.role,
            interest: stakeholder.interest,
            power: stakeholder.power,
            strategy: stakeholder.strategy,
        });
    };

    // Delete stakeholder
    const deleteStakeholder = (stakeholderId) => {
        const updatedStakeholders = (editableData.stakeholders || []).filter(
            stakeholder => stakeholder.id !== stakeholderId
        );

        setEditableData((prevData) => ({
            ...prevData,
            stakeholders: updatedStakeholders
        }));

        if (editingStakeholderId === stakeholderId) {
            setEditingStakeholderId(null);
            setStakeholderForm({
                name: '',
                role: '',
                interest: 'low',
                power: 'low',
                strategy: '',
            });
        }
    };

    // Handle form input changes
    const handleFormChange = (field, value) => {
        setStakeholderForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Get stakeholders for a specific quadrant
    const getStakeholdersForQuadrant = (power, interest) => {
        return (editableData.stakeholders || []).filter(
            stakeholder => stakeholder.power === power && stakeholder.interest === interest
        );
    };

    return (
        <CardContainer
            title={editableData.title || 'Stakeholder Matrix'}
            type="STAKEHOLDER_MATRIX"
            editionMode={editionMode}
            setEditionMode={setEditionMode}
            onSave={handleSave}
            onDelete={onDelete}
            onCancel={handleCancel}
            createdAt={data.createdAt}
            updatedAt={data.updatedAt}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={editionMode ? 'editing' : 'viewing'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Description section */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Project Context</h3>

                        {editionMode ? (
                            <textarea
                                value={editableData.description || ''}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 min-h-24 text-gray-700"
                                placeholder="Describe the project context and stakeholder relevance..."
                            />
                        ) : (
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-gray-700">
                                {editableData.description || (
                                    <span className="text-gray-400 italic">No context provided.</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Matrix visualization */}
                    <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-700 mb-2">Stakeholder Matrix</h3>

                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            {/* Header row - Interest */}
                            <div className="grid grid-cols-2 text-center">
                                <div className="col-span-1"></div>
                                <div className="grid grid-cols-2">
                                    <div className="p-2 font-medium text-gray-700 bg-yellow-50 border-b border-l border-gray-300">Low Interest</div>
                                    <div className="p-2 font-medium text-gray-700 bg-yellow-100 border-b border-l border-gray-300">High Interest</div>
                                </div>
                            </div>

                            {/* Content rows */}
                            <div className="grid grid-cols-2">
                                {/* Power labels - left column */}
                                <div className="col-span-1 grid grid-rows-2">
                                    <div className="p-2 font-medium text-gray-700 bg-blue-100 border-b border-r border-gray-300 flex items-center justify-center">
                                        <div className="transform -rotate-90">High Power</div>
                                    </div>
                                    <div className="p-2 font-medium text-gray-700 bg-blue-50 border-r border-gray-300 flex items-center justify-center">
                                        <div className="transform -rotate-90">Low Power</div>
                                    </div>
                                </div>

                                {/* Matrix quadrants - right column */}
                                <div className="col-span-1 grid grid-cols-2 grid-rows-2">
                                    {/* Top row */}
                                    <div className="p-4 bg-gray-100 border-b border-l border-gray-300">
                                        <h4 className="text-sm font-bold mb-2">Keep Satisfied</h4>
                                        <div className="space-y-2">
                                            {getStakeholdersForQuadrant('high', 'low').map((stakeholder) => (
                                                <div
                                                    key={stakeholder.id}
                                                    className="p-2 bg-white rounded border border-gray-200 shadow-sm text-sm"
                                                >
                                                    <div className="font-medium">{stakeholder.name}</div>
                                                    <div className="text-xs text-gray-600">{stakeholder.role}</div>
                                                    {editionMode && (
                                                        <div className="flex justify-end mt-1 space-x-1">
                                                            <button
                                                                onClick={() => editStakeholder(stakeholder)}
                                                                className="p-1 text-blue-500 hover:text-blue-700 text-xs"
                                                            >
                                                                <FaPencilAlt />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteStakeholder(stakeholder.id)}
                                                                className="p-1 text-red-500 hover:text-red-700 text-xs"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-100 border-b border-l border-gray-300">
                                        <h4 className="text-sm font-bold mb-2">Manage Closely</h4>
                                        <div className="space-y-2">
                                            {getStakeholdersForQuadrant('high', 'high').map((stakeholder) => (
                                                <div
                                                    key={stakeholder.id}
                                                    className="p-2 bg-white rounded border border-gray-200 shadow-sm text-sm"
                                                >
                                                    <div className="font-medium">{stakeholder.name}</div>
                                                    <div className="text-xs text-gray-600">{stakeholder.role}</div>
                                                    {editionMode && (
                                                        <div className="flex justify-end mt-1 space-x-1">
                                                            <button
                                                                onClick={() => editStakeholder(stakeholder)}
                                                                className="p-1 text-blue-500 hover:text-blue-700 text-xs"
                                                            >
                                                                <FaPencilAlt />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteStakeholder(stakeholder.id)}
                                                                className="p-1 text-red-500 hover:text-red-700 text-xs"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom row */}
                                    <div className="p-4 bg-gray-50 border-l border-gray-300">
                                        <h4 className="text-sm font-bold mb-2">Monitor</h4>
                                        <div className="space-y-2">
                                            {getStakeholdersForQuadrant('low', 'low').map((stakeholder) => (
                                                <div
                                                    key={stakeholder.id}
                                                    className="p-2 bg-white rounded border border-gray-200 shadow-sm text-sm"
                                                >
                                                    <div className="font-medium">{stakeholder.name}</div>
                                                    <div className="text-xs text-gray-600">{stakeholder.role}</div>
                                                    {editionMode && (
                                                        <div className="flex justify-end mt-1 space-x-1">
                                                            <button
                                                                onClick={() => editStakeholder(stakeholder)}
                                                                className="p-1 text-blue-500 hover:text-blue-700 text-xs"
                                                            >
                                                                <FaPencilAlt />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteStakeholder(stakeholder.id)}
                                                                className="p-1 text-red-500 hover:text-red-700 text-xs"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 border-l border-gray-300">
                                        <h4 className="text-sm font-bold mb-2">Keep Informed</h4>
                                        <div className="space-y-2">
                                            {getStakeholdersForQuadrant('low', 'high').map((stakeholder) => (
                                                <div
                                                    key={stakeholder.id}
                                                    className="p-2 bg-white rounded border border-gray-200 shadow-sm text-sm"
                                                >
                                                    <div className="font-medium">{stakeholder.name}</div>
                                                    <div className="text-xs text-gray-600">{stakeholder.role}</div>
                                                    {editionMode && (
                                                        <div className="flex justify-end mt-1 space-x-1">
                                                            <button
                                                                onClick={() => editStakeholder(stakeholder)}
                                                                className="p-1 text-blue-500 hover:text-blue-700 text-xs"
                                                            >
                                                                <FaPencilAlt />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteStakeholder(stakeholder.id)}
                                                                className="p-1 text-red-500 hover:text-red-700 text-xs"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stakeholder management */}
                    {editionMode && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <h3 className="text-md font-medium text-gray-700 mb-4">
                                {editingStakeholderId ? 'Edit Stakeholder' : 'Add New Stakeholder'}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={stakeholderForm.name}
                                        onChange={(e) => handleFormChange('name', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Stakeholder name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role/Department</label>
                                    <input
                                        type="text"
                                        value={stakeholderForm.role}
                                        onChange={(e) => handleFormChange('role', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        placeholder="Role or department"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Power Level</label>
                                    <select
                                        value={stakeholderForm.power}
                                        onChange={(e) => handleFormChange('power', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="low">Low</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest Level</label>
                                    <select
                                        value={stakeholderForm.interest}
                                        onChange={(e) => handleFormChange('interest', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="low">Low</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Strategy</label>
                                <textarea
                                    value={stakeholderForm.strategy}
                                    onChange={(e) => handleFormChange('strategy', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md min-h-16"
                                    placeholder="How to engage with this stakeholder..."
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                {editingStakeholderId ? (
                                    <>
                                        <button
                                            onClick={() => setEditingStakeholderId(null)}
                                            className="px-3 py-1 text-gray-600 hover:text-gray-800 flex items-center"
                                        >
                                            <FaTimes className="mr-1" /> Cancel
                                        </button>
                                        <button
                                            onClick={updateStakeholder}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                                            disabled={!stakeholderForm.name}
                                        >
                                            <FaCheck className="mr-1" /> Update
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={addStakeholder}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                                        disabled={!stakeholderForm.name}
                                    >
                                        <FaUserPlus className="mr-1" /> Add Stakeholder
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stakeholder strategies */}
                    {!editionMode && editableData.stakeholders && editableData.stakeholders.length > 0 && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <h3 className="text-md font-medium text-gray-700 mb-4">Engagement Strategies</h3>

                            <div className="space-y-3">
                                {editableData.stakeholders.map((stakeholder) => (
                                    stakeholder.strategy && (
                                        <div key={`strategy-${stakeholder.id}`} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between">
                                                <div className="font-medium text-gray-800">{stakeholder.name}</div>
                                                <div className="text-sm text-gray-500">{stakeholder.role}</div>
                                            </div>
                                            <div className="mt-1 text-sm">{stakeholder.strategy}</div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </CardContainer>
    );
};

export default StakeholderMatrix;