import React, { useState } from 'react';

const CreateForm = () => {
    // Hooks deben estar dentro del componente
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [methodology, setMethodology] = useState('DMAIC');
    const [stakeholders, setStakeholders] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [priority, setPriority] = useState('Medium');

    const handleCreateProject = () => {
        console.log({ projectName, description, methodology, stakeholders, startDate, endDate, priority });
        alert('Project created successfully!');
    };

    return (
        <main className="container mx-auto p-4 flex-grow">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Create a New Project</h2>
                <form className="space-y-4">
                    {/* Project Name */}
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                            Project Name
                        </label>
                        <input
                            type="text"
                            id="projectName"
                            className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                    {/* Methodology */}
                    <div>
                        <label htmlFor="methodology" className="block text-sm font-medium text-gray-700">
                            Select Methodology
                        </label>
                        <select
                            id="methodology"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={methodology}
                            onChange={(e) => setMethodology(e.target.value)}
                        >
                            <option value="DMAIC">DMAIC</option>
                            <option value="8D">8D</option>
                        </select>
                    </div>
                    {/* Stakeholders */}
                    <div>
                        <label htmlFor="stakeholders" className="block text-sm font-medium text-gray-700">
                            Stakeholders
                        </label>
                        <input
                            type="text"
                            id="stakeholders"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={stakeholders}
                            onChange={(e) => setStakeholders(e.target.value)}
                        />
                    </div>
                    {/* Start and End Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Priority */}
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                            Priority
                        </label>
                        <select
                            id="priority"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </form>
                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
                        onClick={() => console.log('Cancelled')}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                        onClick={handleCreateProject}
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </main>
    );
};

export default CreateForm;

