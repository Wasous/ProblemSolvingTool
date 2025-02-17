import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProjectCard from '../components/ProjectRow';
import { FaSearch, FaFilter } from 'react-icons/fa';

// Helper functions
const getCurrentPhase = (stages) => {
    if (!stages || stages.length === 0) return "N/A";
    const current = stages.find(stage => !stage.completed);
    return current ? current.stage_name : "Completed";
};

const KanbanView = ({ groupedProjects }) => {
    const [scrollLeft, setScrollLeft] = useState(0);
    const contentRef = useRef(null);
    const scrollbarRef = useRef(null);

    const handleMainScroll = (e) => {
        setScrollLeft(e.target.scrollLeft);
        if (scrollbarRef.current) {
            scrollbarRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    const handleScrollbarScroll = (e) => {
        setScrollLeft(e.target.scrollLeft);
        if (contentRef.current) {
            contentRef.current.scrollLeft = e.target.scrollLeft;
        }
    };

    return (
        <div
            className="overflow-x-auto pb-4"
            style={{ height: 'calc(100vh - 300px)' }}
        >
            <div className="flex space-x-4 p-1">
                {groupedProjects.map(group => (
                    <div key={group.phase} className="flex-none w-72">
                        <div className="bg-gray-100 rounded-lg p-4 h-full">
                            <h3 className="font-bold text-gray-700 flex items-center mb-3">
                                {group.phase}
                                <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                    {group.projects.length}
                                </span>
                            </h3>
                            <div className="space-y-3 overflow-y-auto">
                                {group.projects.map(item => (
                                    <div key={item.project.id}>
                                        <ProjectCard
                                            project={item.project}
                                            projectId={item.project.id}
                                            isOwner={item.role === 'Owner'}
                                        />
                                    </div>
                                ))}
                                {group.projects.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 italic">
                                        No projects in this phase
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProjectsList = () => {
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('date');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPhase, setFilterPhase] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const { accessToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoadingProjects(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                    withCredentials: true,
                });
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

    const filteredProjects = projects.filter(item => {
        const project = item.project;
        const nameMatch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        const tagMatch = project.tags?.some(tag =>
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) || false;
        const descriptionMatch = project.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const phaseMatch = filterPhase === 'all' ||
            getCurrentPhase(project.dmaicStages) === filterPhase;

        return (nameMatch || tagMatch || descriptionMatch) && phaseMatch;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.project.name.localeCompare(b.project.name);
            case 'priority':
                const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
                return (priorityOrder[a.project.priority] || 4) - (priorityOrder[b.project.priority] || 4);
            case 'date':
            default:
                return new Date(b.project.updatedAt) - new Date(a.project.updatedAt);
        }
    });

    const getProjectsByPhase = () => {
        const phases = ['Define', 'Measure', 'Analyze', 'Improve', 'Control', 'Completed'];
        return phases.map(phase => ({
            phase,
            projects: sortedProjects.filter(item =>
                getCurrentPhase(item.project.dmaicStages) === phase
            )
        }));
    };

    const renderProjects = () => {
        if (viewMode === 'kanban') {
            const groupedProjects = getProjectsByPhase();
            return <KanbanView groupedProjects={groupedProjects} />;
        }

        return (
            <div className={viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
                {sortedProjects.map((item) => (
                    <div key={item.project.id} className={viewMode === 'list' ? "w-full" : ""}>
                        <ProjectCard
                            project={item.project}
                            projectId={item.project.id}
                            isOwner={item.role === 'Owner'}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col pt-20">
            <Header title="Projects" />
            <main className="container mx-auto p-4 flex-grow">
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0">
                        <h1 className="text-2xl font-bold">Project List</h1>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search projects or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2 w-full sm:w-64 border rounded-md"
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>

                            <div className="flex space-x-2 items-center">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    title="Grid View"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    title="List View"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('kanban')}
                                    className={`p-1 rounded ${viewMode === 'kanban' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    title="Kanban View"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2a1 1 0 011-1h2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`p-1 rounded ${showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                                    title="Show Filters"
                                >
                                    <FaFilter className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="sortBy" className="block text-sm text-gray-600 mb-1">Sort by:</label>
                                <select
                                    id="sortBy"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border rounded p-2 text-sm"
                                >
                                    <option value="date">Last Updated</option>
                                    <option value="name">Name</option>
                                    <option value="priority">Priority</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="phaseFilter" className="block text-sm text-gray-600 mb-1">Filter by Phase:</label>
                                <select
                                    id="phaseFilter"
                                    value={filterPhase}
                                    onChange={(e) => setFilterPhase(e.target.value)}
                                    className="w-full border rounded p-2 text-sm"
                                >
                                    <option value="all">All Phases</option>
                                    <option value="Define">Define</option>
                                    <option value="Measure">Measure</option>
                                    <option value="Analyze">Analyze</option>
                                    <option value="Improve">Improve</option>
                                    <option value="Control">Control</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {loadingProjects ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : sortedProjects.length > 0 ? (
                    renderProjects()
                ) : (
                    <div className="text-center p-8 bg-white rounded-lg shadow">
                        <p className="text-lg text-gray-600">
                            {searchTerm || filterPhase !== 'all'
                                ? "No projects match your search criteria."
                                : "No se encontraron proyectos."}
                        </p>
                        <button
                            onClick={() => navigate('/newProject')}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create New Project
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default ProjectsList;