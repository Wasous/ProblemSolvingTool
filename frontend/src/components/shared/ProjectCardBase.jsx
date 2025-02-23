// components/shared/ProjectCardBase.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp, FaTag, FaCalendarAlt, FaFlag, FaUser, FaUsers, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getCurrentPhase, sortDmaicStages } from '../../utils/dmaicUtils';

export const formatTimeAgo = (dateString) => {
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

export const DMAICStageIndicator = ({ stages }) => {
    const stageColors = {
        Define: 'bg-blue-500',
        Measure: 'bg-green-500',
        Analyze: 'bg-amber-500',
        Improve: 'bg-purple-500',
        Control: 'bg-red-500',
        Completed: 'bg-gray-500'
    };

    const sortedStages = sortDmaicStages(stages);
    const currentStage = getCurrentPhase(stages);

    return (
        <div className="flex space-x-1 mt-2">
            {sortedStages?.map((stage, index) => (
                <div
                    key={index}
                    className={`h-2 flex-1 rounded-full ${stage.completed
                            ? stageColors[stage.stage_name]
                            : stage.stage_name === currentStage
                                ? `${stageColors[stage.stage_name]} opacity-50`
                                : 'bg-gray-200'
                        }`}
                    title={`${stage.stage_name}: ${stage.completed ? 'Completed' : stage.stage_name === currentStage ? 'In Progress' : 'Not Started'
                        }`}
                />
            ))}
        </div>
    );
};

DMAICStageIndicator.propTypes = {
    stages: PropTypes.arrayOf(
        PropTypes.shape({
            stage_name: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

const ProjectCardBase = ({
    project,
    isOwner,
    showExpanded = false,
    onExpand,
    renderCustomHeader,
    renderCustomContent,
    renderCustomActions,
}) => {
    const navigate = useNavigate();
    const priorityColors = {
        High: 'text-red-600',
        Medium: 'text-amber-600',
        Low: 'text-green-600'
    };

    const defaultHeader = (
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{project.name}</h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FaUser className="text-xs" />
                    <span>{project.owner?.username || 'Unknown Owner'}</span>
                </div>
                <p className={`text-sm font-medium mt-1 ${priorityColors[project.priority] || 'text-gray-600'}`}>
                    <FaFlag className="inline mr-1 text-xs" /> {project.priority || 'No Priority'}
                </p>
            </div>
            {onExpand && (
                <button onClick={onExpand} className="text-gray-400 hover:text-gray-800">
                    {showExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            )}
        </div>
    );

    const defaultContent = showExpanded && (
        <>
            <p className="text-sm text-gray-700 line-clamp-3">{project.description || 'No description provided'}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
                <FaCalendarAlt className="mr-1" />
                {project.start_date || 'TBD'} - {project.end_date || 'TBD'}
            </p>
        </>
    );

    const defaultActions = (
        <div className="flex justify-end mt-4 space-x-2">
            {isOwner && (
                <button
                    onClick={() => navigate(`/edit-project/${project.id}`)}
                    className="bg-amber-600 text-white text-xs py-1 px-3 rounded"
                >
                    Edit
                </button>
            )}
            <button
                onClick={() => navigate(`/DMAIC/${project.id}`)}
                className="bg-blue-500 text-white text-xs py-1 px-3 rounded"
            >
                Open
            </button>
        </div>
    );

    return (
        <div className={`bg-white shadow rounded-lg p-4 h-full flex flex-col transition-all duration-300 hover:shadow-lg 
      ${isOwner ? 'border-l-4 border-l-blue-500' : ''}`}>
            {renderCustomHeader ? renderCustomHeader(defaultHeader) : defaultHeader}

            <DMAICStageIndicator stages={project.dmaicStages} />

            <p className="text-sm text-gray-600 font-medium mt-3">
                Current: <span className="text-blue-600">{getCurrentPhase(project.dmaicStages)}</span>
            </p>

            <div className="flex flex-wrap mt-2">
                {(project.tags || []).slice(0, showExpanded ? project.tags?.length : 2).map((tag, index) => (
                    <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs font-medium py-1 px-2 mr-2 mb-1 rounded-full flex items-center"
                    >
                        <FaTag className="mr-1 text-xs" /> {tag.name}
                    </span>
                ))}
                {!showExpanded && project.tags?.length > 2 && (
                    <span className="text-xs text-gray-500 py-1">+{project.tags.length - 2} more</span>
                )}
            </div>

            <div className="flex items-center text-xs text-gray-500 mt-2">
                <FaClock className="mr-1" />
                <span>Updated {formatTimeAgo(project.updatedAt)}</span>
            </div>

            {renderCustomContent ? renderCustomContent(defaultContent) : defaultContent}
            {renderCustomActions ? renderCustomActions(defaultActions) : defaultActions}
        </div>
    );
};

ProjectCardBase.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        start_date: PropTypes.string,
        end_date: PropTypes.string,
        priority: PropTypes.string,
        tags: PropTypes.array,
        updatedAt: PropTypes.string,
        dmaicStages: PropTypes.array,
        owner: PropTypes.shape({
            username: PropTypes.string
        })
    }).isRequired,
    isOwner: PropTypes.bool,
    showExpanded: PropTypes.bool,
    onExpand: PropTypes.func,
    renderCustomHeader: PropTypes.func,
    renderCustomContent: PropTypes.func,
    renderCustomActions: PropTypes.func,
};

export default ProjectCardBase;