import React from 'react';

const ProjectCard = ({ projectName, description, timeline, tags, teamMembers, status }) => {
    return (
        <div className="flex items-center bg-white shadow rounded-lg p-4 mb-2">
            {/* Checkbox */}
            <input type="checkbox" className="mr-4 h-4 w-4 rounded border-gray-300" />

            {/* Project Name and Description */}
            <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{projectName}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>

            {/* Timeline */}
            <div className="text-sm text-gray-500 mx-4">
                {timeline}
            </div>

            {/* Tags */}
            <div className="flex space-x-2 mx-4">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="bg-blue-100 text-blue-700 text-xs font-medium py-1 px-2 rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Team Members */}
            <div className="flex -space-x-2 mx-4">
                {teamMembers.map((member, index) => (
                    <img
                        key={index}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                    />
                ))}
            </div>

            {/* Status */}
            <span
                className={`text-xs font-medium py-1 px-2 rounded-full ${status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                    }`}
            >
                {status}
            </span>
        </div>
    );
};

export default ProjectCard;
