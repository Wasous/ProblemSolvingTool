import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp, FaTag, FaCalendarAlt, FaFlag, FaUser, FaUsers, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getCurrentPhase, sortDmaicStages } from '../utils/dmaicUtils';

// Date formatting helper.
const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
};

const DMAICStageIndicator = ({ stages }) => {
    console.log('DMAICStageIndicator received stages:', stages);
    
    const stageColors = {
        Define: 'bg-blue-500',
        Measure: 'bg-green-500',
        Analyze: 'bg-amber-500',
        Improve: 'bg-purple-500',
        Control: 'bg-red-500',
        Completed: 'bg-gray-500'
    };

    // Use the shared utility function to sort the stages
    const sortedStages = sortDmaicStages(stages);
    console.log('DMAICStageIndicator sorted stages:', sortedStages.map(s => s.stage_name));
    
    const currentStage = getCurrentPhase(stages);
    console.log('DMAICStageIndicator calculated currentStage:', currentStage);

    return (
        <div className="flex space-x-1 mt-2">
            {sortedStages && sortedStages.map((stage, index) => (
                <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${stage.completed
                        ? stageColors[stage.stage_name]
                        : stage.stage_name === currentStage
                            ? `${stageColors[stage.stage_name]} opacity-50`
                            : 'bg-gray-200'
                        }`}
                    title={`${stage.stage_name}: ${stage.completed ? 'Completed' : stage.stage_name === currentStage ? 'In Progress' : 'Not Started'}`}
                />
            ))}
        </div>
    );
};

const ProjectCard = ({ project, projectId, isOwner, teamMembers = [] }) => {
    console.log('ProjectCard rendering with project:', projectId, project.name);
    console.log('Project dmaicStages:', project.dmaicStages);
    
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleOpenProject = () => navigate(`/DMAIC/${projectId}`);
    const handleEditProject = () => navigate(`/edit-project/${projectId}`);

    const owner = project.owner?.username || 'Unknown Owner';

    const priorityColors = {
        High: 'text-red-600',
        Medium: 'text-amber-600',
        Low: 'text-green-600'
    };

    return (
        <div className={`bg-white shadow rounded-lg p-4 h-full flex flex-col transition-all duration-300 hover:shadow-lg 
            ${isOwner ? 'border-l-4 border-l-blue-500' : ''}`}>
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{project.name}</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <FaUser className="text-xs" />
                        <span>{owner}</span>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${priorityColors[project.priority] || 'text-gray-600'}`}>
                        <FaFlag className="inline mr-1 text-xs" /> {project.priority || 'No Priority'}
                    </p>
                </div>
                <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-800">
                    {expanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            <DMAICStageIndicator stages={project.dmaicStages} />

            <p className="text-sm text-gray-600 font-medium mt-3">
                Current: <span className="text-blue-600">{getCurrentPhase(project.dmaicStages)}</span>
            </p>

            <div className="flex flex-wrap mt-2">
                {(project.tags || []).slice(0, expanded ? project.tags.length : 2).map((tag, index) => (
                    <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs font-medium py-1 px-2 mr-2 mb-1 rounded-full flex items-center"
                    >
                        <FaTag className="mr-1 text-xs" /> {tag.name}
                    </span>
                ))}
                {!expanded && project.tags && project.tags.length > 2 && (
                    <span className="text-xs text-gray-500 py-1">+{project.tags.length - 2} more</span>
                )}
            </div>

            <div className="flex items-center text-xs text-gray-500 mt-2">
                <FaClock className="mr-1" />
                <span>Updated {formatTimeAgo(project.updatedAt)}</span>
            </div>

            {expanded && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex-grow">
                    <p className="text-sm text-gray-700 line-clamp-3">{project.description || 'No description provided'}</p>

                    {teamMembers?.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                                <FaUsers className="mr-2" /> Team Members
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {teamMembers.map((member, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 text-xs py-1 px-2 rounded-full">
                                        {member.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {project.start_date || 'TBD'} - {project.end_date || 'TBD'}
                    </p>
                </div>
            )}

            <div className={`flex justify-end mt-${expanded ? '4' : 'auto'} pt-2 space-x-2 ${!expanded && 'mt-auto'}`}>
                {isOwner && (
                    <button
                        onClick={handleEditProject}
                        className="bg-amber-600 text-white text-xs py-1 px-3 rounded"
                    >
                        Edit
                    </button>
                )}
                <button
                    onClick={handleOpenProject}
                    className="bg-blue-500 text-white text-xs py-1 px-3 rounded"
                >
                    Open
                </button>
            </div>
        </div>
    );
};

ProjectCard.propTypes = {
    project: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        start_date: PropTypes.string,
        end_date: PropTypes.string,
        priority: PropTypes.string,
        tags: PropTypes.array,
        updatedAt: PropTypes.string,
        dmaicStages: PropTypes.arrayOf(
            PropTypes.shape({
                stage_name: PropTypes.string.isRequired,
                completed: PropTypes.bool.isRequired,
            })
        ),
        owner: PropTypes.shape({
            username: PropTypes.string
        })
    }).isRequired,
    projectId: PropTypes.string.isRequired,
    isOwner: PropTypes.bool,
    teamMembers: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        })
    )
};

export default ProjectCard;