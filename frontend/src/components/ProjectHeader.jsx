import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCalendarAlt, FaUser, FaUsers, FaClock } from 'react-icons/fa';
import DmaicMenu from './DmaicMenu';

const ProjectHeader = ({ project, currentStage, setCurrentStage, dmaicStages }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!project) return null;

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Get completion percentage
    const getCompletionPercentage = () => {
        if (!dmaicStages || dmaicStages.length === 0) return 0;
        const completedStages = dmaicStages.filter(stage => stage.completed).length;
        return Math.round((completedStages / dmaicStages.length) * 100);
    };

    // Get requirements for current phase
    const getCurrentPhaseRequirements = () => {
        // This could be expanded based on your specific requirements for each phase
        const requirements = {
            'Define': ['Problem statement', 'Project scope', 'Business case'],
            'Measure': ['Data collection plan', 'Baseline metrics', 'Data validation'],
            'Analyze': ['Root cause analysis', 'Data visualization', 'Process analysis'],
            'Improve': ['Solution development', 'Implementation plan', 'Risk assessment'],
            'Control': ['Control plan', 'Documentation', 'Handover plan']
        };

        return requirements[currentStage] || [];
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm w-full">
            {/* Collapsed view - always visible */}
            <div className="px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    {/* DMAIC Phase Menu */}
                    <div className="hidden md:block">
                        <DmaicMenu
                            stages={dmaicStages}
                            currentStage={currentStage}
                            setCurrentStage={setCurrentStage}
                        />
                    </div>

                    {/* Current phase indicator (mobile) */}
                    <div className="md:hidden flex items-center">
                        <span className="text-sm font-medium text-gray-600">Phase:</span>
                        <span className="ml-2 bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
                            {currentStage}
                        </span>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center space-x-4">
                    <div className="hidden sm:flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${getCompletionPercentage()}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-600">{getCompletionPercentage()}%</span>
                    </div>

                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <span className="text-sm mr-1">{isExpanded ? 'Hide details' : 'Show details'}</span>
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>

            {/* Expanded view - only visible when expanded */}
            {isExpanded && (
                <div className="px-4 py-3 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 border-t border-gray-200">
                    {/* Project info column */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Details</h3>
                        <div className="space-y-2">
                            <p className="flex items-center text-sm text-gray-600">
                                <FaUser className="mr-2 text-gray-400" />
                                <span className="font-medium mr-2">Owner:</span>
                                {project.owner?.username || 'Not assigned'}
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <FaCalendarAlt className="mr-2 text-gray-400" />
                                <span className="font-medium mr-2">Timeline:</span>
                                {formatDate(project.start_date)} - {formatDate(project.end_date)}
                            </p>
                            <p className="flex items-center text-sm text-gray-600">
                                <FaClock className="mr-2 text-gray-400" />
                                <span className="font-medium mr-2">Last updated:</span>
                                {new Date(project.updatedAt).toLocaleString()}
                            </p>
                            {project.teamMembers && (
                                <div className="flex items-start text-sm text-gray-600">
                                    <FaUsers className="mr-2 mt-1 text-gray-400" />
                                    <div>
                                        <span className="font-medium mr-2">Team:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {project.teamMembers.map((member, idx) => (
                                                <span key={idx} className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">
                                                    {member.User?.username}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Current phase requirements */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            {currentStage} Phase Requirements
                        </h3>
                        <ul className="space-y-1">
                            {getCurrentPhaseRequirements().map((req, idx) => (
                                <li key={idx} className="flex items-start text-sm">
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5 mr-2"></div>
                                    <span className="text-gray-600">{req}</span>
                                </li>
                            ))}
                        </ul>
                        <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                            View completion criteria
                        </button>
                    </div>

                    {/* Phase summary column */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Phase Summary</h3>
                        <div className="space-y-2">
                            {dmaicStages?.map((stage, idx) => (
                                <div key={idx} className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${stage.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    <span className={`text-sm ${stage.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                                        {stage.name}
                                    </span>
                                    {stage.completed && (
                                        <span className="ml-auto text-xs text-gray-500">Completed</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4">
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                                View project summary report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectHeader;