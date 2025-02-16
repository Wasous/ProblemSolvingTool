import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ project, projectId, isOwner, onProjectUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState({ ...project });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProject({ ...editedProject, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            // Puedes reemplazar fetch con axios si lo prefieres para mantener la consistencia.
            const res = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedProject)
            });

            if (!res.ok) {
                console.error('Error updating project');
                return;
            }

            if (onProjectUpdate) {
                onProjectUpdate(projectId, editedProject);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-white shadow rounded-lg p-4 mb-4">
            {isEditing ? (
                <div className="flex-grow">
                    {/* Modo edición */}
                    <input
                        type="text"
                        name="name"
                        value={editedProject.name || ''}
                        onChange={handleInputChange}
                        placeholder="Project Name"
                        className="text-lg font-semibold text-gray-800 w-full mb-2 border border-gray-300 rounded px-2 py-1"
                    />
                    <textarea
                        name="description"
                        value={editedProject.description || ''}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="text-sm text-gray-600 w-full mb-2 border border-gray-300 rounded px-2 py-1"
                    />
                    {/* Aquí podrías agregar otros campos a editar */}
                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={handleSaveChanges}
                            className="bg-blue-500 text-white text-sm py-1 px-4 rounded"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleEditToggle}
                            className="bg-gray-300 text-gray-700 text-sm py-1 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Columna Izquierda: Detalles del Proyecto */}
                    <div className="flex-grow">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                            {isOwner && (
                                <span className="text-xl text-blue-600" title="Project Owner">
                                    &#10026;
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">{project.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {project.start_date} - {project.end_date}
                        </p>
                        <div className="flex space-x-2 mt-2">
                            {(project.tags || []).map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-700 text-xs font-medium py-1 px-2 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {project.status && (
                            <div className="text-sm text-gray-500 mt-2">{project.status}</div>
                        )}
                    </div>
                    {/* Columna Derecha: Acciones */}
                    <div className="flex flex-col justify-end items-end mt-4 md:mt-0">
                        <button
                            onClick={handleEditToggle}
                            className="bg-blue-500 text-white text-sm py-1 px-4 rounded mb-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleEditToggle}
                            className="bg-amber-600 text-white text-sm py-1 px-4 rounded"
                        >
                            Open
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

ProjectCard.propTypes = {
    project: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        start_date: PropTypes.string,
        end_date: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        status: PropTypes.string
    }).isRequired,
    projectId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
    onProjectUpdate: PropTypes.func.isRequired
};

export default ProjectCard;
