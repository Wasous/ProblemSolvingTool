import { useState } from 'react';
import PropTypes from 'prop-types';

const ProjectCard = ({ project, projectId, onProjectUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState({ ...project });

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProject({ ...editedProject, [name]: value });
    };

    const handleTagChange = (index, value) => {
        const updatedTags = [...editedProject.tags];
        updatedTags[index] = value;
        setEditedProject({ ...editedProject, tags: updatedTags });
    };

    const handleAddTag = () => {
        setEditedProject({ ...editedProject, tags: [...editedProject.tags, ''] });
    };

    const handleRemoveTag = (index) => {
        const updatedTags = editedProject.tags.filter((_, i) => i !== index);
        setEditedProject({ ...editedProject, tags: updatedTags });
    };

    const handleSaveChanges = async () => {
        try {
            await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProject),
            });

            if (onProjectUpdate) {
                onProjectUpdate(projectId, editedProject);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <div className="flex bg-white shadow rounded-lg p-4 mb-2 w-full">
            {isEditing ? (
                <div className="flex-grow">
                    {/* Edit Fields */}
                    <input
                        type="text"
                        name="projectName"
                        value={editedProject.projectName}
                        onChange={handleInputChange}
                        placeholder="Project Name"
                        className="text-lg font-semibold text-gray-800 w-full mb-2 border border-gray-300 rounded px-2 py-1"
                    />
                    <textarea
                        name="description"
                        value={editedProject.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        className="text-sm text-gray-600 w-full mb-2 border border-gray-300 rounded px-2 py-1"
                    />
                    <input
                        type="text"
                        name="timeline"
                        value={editedProject.timeline}
                        onChange={handleInputChange}
                        placeholder="Timeline"
                        className="text-sm text-gray-500 w-full mb-2 border border-gray-300 rounded px-2 py-1"
                    />

                    {/* Tags */}
                    <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
                        {editedProject.tags.map((tag, index) => (
                            <div key={index} className="flex items-center mb-1">
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => handleTagChange(index, e.target.value)}
                                    className="text-sm text-gray-800 w-full border border-gray-300 rounded px-2 py-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(index)}
                                    className="ml-2 text-red-500"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="text-blue-500 text-sm mt-2"
                        >
                            Add Tag
                        </button>
                    </div>

                    {/* Status */}
                    <select
                        name="status"
                        value={editedProject.status}
                        onChange={handleInputChange}
                        className="text-sm text-gray-800 w-full mb-2 border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Not Started">Not Started</option>
                    </select>

                    {/* Save and Cancel Buttons */}
                    <button
                        onClick={handleSaveChanges}
                        className="bg-blue-500 text-white text-sm py-1 px-4 rounded mr-2"
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
            ) : (
                <>
                    <div className="flex-grow">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{project.projectName}</h3>
                                <p className="text-sm text-gray-600">{project.description}</p>
                                <p className="text-sm text-gray-500">{project.timeline}</p>
                                <div className="flex space-x-2 mt-2">
                                    {project.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-700 text-xs font-medium py-1 px-2 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-500 mt-2">{project.status}</div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 bg-gray-100 p-4 rounded-lg flex flex-col items-end">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Summary</h4>
                        <p className="text-sm text-gray-600">
                            Define: has been completed with the following problem statement: bla bla bla
                        </p>
                        <div className='flex space-x-2'>
                            <button
                                onClick={handleEditToggle}
                                className="bg-blue-500 text-white text-sm py-1 px-4 rounded mt-4"
                            >
                                Open
                            </button>
                            <button
                                onClick={handleEditToggle}
                                className="bg-amber-600 text-white text-sm py-1 px-4 rounded mt-4"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

ProjectCard.propTypes = {
    project: PropTypes.shape({
        projectName: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        timeline: PropTypes.string.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
        status: PropTypes.string.isRequired
    }).isRequired,
    projectId: PropTypes.string.isRequired,
    onProjectUpdate: PropTypes.func.isRequired
};

export default ProjectCard;
