import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectRow from '../components/ProjectRow';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    // Cargar proyectos desde el endpoint al montar el componente
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoadingProjects(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    withCredentials: true,
                });
                console.log(res.data.projects);
                setProjects(res.data.projects || []);
            } catch (error) {
                console.error("Error al obtener proyectos:", error);
                setProjects([]);
            } finally {
                setLoadingProjects(false);
            }
        };

        if (accessToken) {
            fetchProjects();
        }
    }, [accessToken]);

    const handleProjectUpdate = (projectId, updatedData) => {
        console.log(`Updating project ${projectId}:`, updatedData);
        // Aquí podrías actualizar el estado global o enviar la actualización al backend
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-20">
            <Header title="Projects" />
            <main className="container mx-auto p-4 flex-grow">
                <h1 className="text-2xl font-bold mb-4">Project List</h1>
                <div className="space-y-4">
                    {loadingProjects ? (
                        // Aquí se muestra un spinner o mensaje de carga
                        <div className="flex justify-center items-center">
                            <span className="text-xl font-bold">Loading projects...</span>
                        </div>
                    ) : projects.length > 0 ? (
                        projects.map((item) => {
                            // Cada elemento devuelto tiene la forma: { project: {...}, role: 'Owner' or 'Member' }
                            const { project, role } = item;
                            const isOwner = role === 'Owner';
                            return (
                                <ProjectRow
                                    key={project.id}
                                    project={project}
                                    projectId={project.id}
                                    isOwner={isOwner}
                                    onProjectUpdate={handleProjectUpdate}
                                />
                            );
                        })
                    ) : (
                        <p>No se encontraron proyectos.</p>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProjectsList;
