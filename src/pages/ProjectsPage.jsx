import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectRow from '../components/ProjectRow';

const ProjectsList = () => {
    const projects = [
        {
            projectName: 'Website Redesign',
            description: 'Update the corporate website with a modern design and responsive layout.',
            timeline: 'Jan 10, 2024 - Mar 15, 2024',
            tags: ['Design', 'UI/UX'],
            teamMembers: [
                { name: 'Alice', avatar: 'https://via.placeholder.com/32' },
                { name: 'Bob', avatar: 'https://via.placeholder.com/32' },
            ],
            status: 'In Progress',
        },
        {
            projectName: 'Mobile App Development',
            description: 'Create a mobile app for customer engagement.',
            timeline: 'Feb 1, 2024 - Aug 30, 2024',
            tags: ['Development', 'Mobile'],
            teamMembers: [
                { name: 'Charlie', avatar: 'https://via.placeholder.com/32' },
                { name: 'Diana', avatar: 'https://via.placeholder.com/32' },
            ],
            status: 'In Progress',
        },
        {
            projectName: 'Marketing Campaign',
            description: 'Launch a social media campaign to increase brand awareness.',
            timeline: 'Mar 1, 2024 - Mar 31, 2024',
            tags: ['Marketing', 'Campaign'],
            teamMembers: [
                { name: 'Eve', avatar: 'https://via.placeholder.com/32' },
                { name: 'Frank', avatar: 'https://via.placeholder.com/32' },
            ],
            status: 'Completed',
        },
    ];

    const handleProjectUpdate = (projectId, updatedData) => {
        console.log(`Updating project ${projectId}:`, updatedData);
        // Aquí podrías manejar la actualización en un estado global o enviar al backend
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-20">
            {/* Header */}
            <Header title="Projects" />

            {/* Main Content */}
            <main className="container mx-auto p-4 flex-grow">
                <h1 className="text-2xl font-bold mb-4">Project List</h1>
                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <ProjectRow
                            key={index}
                            project={project}
                            projectId={index} // Usamos el índice como ID temporal
                            onProjectUpdate={handleProjectUpdate}
                        />
                    ))}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProjectsList;
