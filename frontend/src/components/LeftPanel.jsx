import React from 'react';
import { FaEdit, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const LeftPanel = ({
    isOpen,
    project,
    isOwner,
    dmaicStages
}) => {
    return (
        <div className={`bg-white shadow-lg fixed top-32 bottom-0 z-10 transition-all duration-300 overflow-y-auto
      ${isOpen ? 'left-0 w-80' : 'left-0 w-0'}`}>
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Project Details</h2>

                {/* Project Info */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Basic Information
                        </h3>
                        <div className="space-y-2">
                            <p className="flex justify-between">
                                <span className="text-gray-500">Name:</span>
                                <span className="font-medium text-gray-800">{project?.name}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-500">Methodology:</span>
                                <span className="font-medium text-gray-800">{project?.methodology}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-500">Priority:</span>
                                <span className="font-medium text-gray-800">{project?.priority}</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Timeline
                        </h3>
                        <div className="space-y-2">
                            <p className="flex justify-between">
                                <span className="text-gray-500">Start Date:</span>
                                <span className="font-medium text-gray-800">
                                    {project?.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                                </span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-500">Target End:</span>
                                <span className="font-medium text-gray-800">
                                    {project?.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Team
                        </h3>
                        <div className="space-y-2">
                            <p className="flex justify-between items-center">
                                <span className="text-gray-500">Owner:</span>
                                <span className="font-medium text-gray-800">{project?.owner?.username || 'Not assigned'}</span>
                            </p>
                            <div>
                                <p className="text-gray-500 mb-2">Team Members:</p>
                                <div className="grid grid-cols-1 gap-1">
                                    {project?.teamMembers?.map((member, idx) => (
                                        <div key={idx} className="bg-gray-100 px-3 py-1 rounded text-sm flex justify-between">
                                            <span>{member.User?.username}</span>
                                            <span className="text-gray-500 text-xs">{member.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phase Summary */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Phase Summary
                        </h3>
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
                    </div>

                    {/* Edit Section (if owner) */}
                    {isOwner && (
                        <div className="pt-4 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                                Admin Actions
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded flex items-center justify-center">
                                    <FaEdit className="mr-2" /> Edit Project Details
                                </button>
                                <button className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded flex items-center justify-center">
                                    <FaUsers className="mr-2" /> Manage Team
                                </button>
                                <button className="w-full bg-blue-100 text-blue-700 px-4 py-2 rounded flex items-center justify-center">
                                    <FaCalendarAlt className="mr-2" /> Update Timeline
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeftPanel;