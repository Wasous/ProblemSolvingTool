import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Función helper: calcula la fase actual del proceso DMAIC
// Se asume que la fase actual es la primera que NO se ha completado
const getCurrentPhase = (stages) => {
    if (!stages || stages.length === 0) return "N/A";
    const current = stages.find(stage => !stage.completed);
    return current ? current.stage_name : "Completed";
};

const ProjectCard = ({ project, projectId, isOwner }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const toggleExpanded = () => setExpanded(!expanded);

    const handleOpenProject = () => {
        // Navega a la página de DMAIC para este proyecto, pasando el projectId
        navigate(`/DMAIC/${projectId}`);
    };

    const handleEditProject = () => {
        // Navega a una página de edición de proyecto (puedes crearla)
        navigate(`/edit-project/${projectId}`);
    };

    return (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            {/* Encabezado de la card */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
                    {isOwner && (
                        <span className="text-blue-600" title="Project Owner">
                            👑
                        </span>
                    )}
                </div>
                <button onClick={toggleExpanded} className="text-gray-600 hover:text-gray-800">
                    {expanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {/* Información básica visible siempre */}
            <div className="mt-2">
                <p className="text-sm text-gray-600">
                    Current Phase: {getCurrentPhase(project.dmaicStages)}
                </p>
                <div className="flex flex-wrap mt-2">
                    {(project.tags || []).map((tag, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 text-blue-700 text-xs font-medium py-1 px-2 mr-2 mb-2 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Vista expandida: resumen adicional */}
            {expanded && (
                <div className="mt-4 border-t pt-4">
                    <p className="text-sm text-gray-700">{project.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {project.start_date} - {project.end_date}
                    </p>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            onClick={handleEditProject}
                            className="bg-amber-600 text-white text-sm py-1 px-4 rounded"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleOpenProject}
                            className="bg-blue-500 text-white text-sm py-1 px-4 rounded"
                        >
                            Open Project
                        </button>
                    </div>
                </div>
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
        dmaicStages: PropTypes.arrayOf(
            PropTypes.shape({
                stage_name: PropTypes.string.isRequired,
                completed: PropTypes.bool.isRequired,
            })
        ),
    }).isRequired,
    projectId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
};

export default ProjectCard;
