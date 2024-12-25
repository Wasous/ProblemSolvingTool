import React from 'react';
import HeaderMain from '../components/HeaderMain'; // Asegúrate de que la ruta sea correcta
import Footer from '../components/Footer'; // Asegúrate de que la ruta sea correcta
import ProjectRow from '../components/ProjectRow'; // Componente que representa una fila de proyecto

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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <HeaderMain title="Projects" />

            {/* Main Content */}
            <main className="container mx-auto p-4 flex-grow">
                <h1 className="text-2xl font-bold mb-4">Project List</h1>
                <div className="space-y-4">
                    {projects.map((project, index) => (
                        <ProjectRow key={index} {...project} />
                    ))}
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProjectsList;
