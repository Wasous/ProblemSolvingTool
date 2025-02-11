import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateForm = () => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [methodology, setMethodology] = useState('DMAIC');
    const [stakeholders, setStakeholders] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [priority, setPriority] = useState('Medium');

    // Estados para seleccionar al líder del proyecto
    const [owner, setOwner] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null; // Evita JSON.parse(null)
    });
    const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
    const [ownerSearchResults, setOwnerSearchResults] = useState([]);

    // Estados para miembros del equipo (como antes)
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);
    const token = localStorage.getItem("accessToken");

    const navigate = useNavigate();


    const handleOwnerSearch = async () => {
        if (!ownerSearchTerm.trim()) {
            setOwnerSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?term=${ownerSearchTerm}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOwnerSearchResults(response.data.users); // Ajusta según la estructura de la respuesta
        } catch (error) {
            console.error("Error buscando líder:", error);
        }
    };

    useEffect(() => {
        if (ownerSearchTerm.trim() !== '') {
            handleOwnerSearch();
        } else {
            setOwnerSearchResults([]);
        }
    }, [ownerSearchTerm]);


    // Función de búsqueda para miembros del equipo (igual que antes)
    const handleTeamSearch = async () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/users/search?term=${searchTerm}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSearchResults(response.data.users); // Ajusta según la estructura de la respuesta
        } catch (error) {
            console.error("Error buscando miembros:", error);
            setSearchResults([]); // Evita que los resultados anteriores persistan en caso de error
        }
    };

    useEffect(() => {

        if (searchTerm.trim() !== '') {
            handleTeamSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleAddTeamMember = (user) => {
        if (!teamMembers.some((member) => member.id === user.id)) {
            setTeamMembers((prevMembers) => [...prevMembers, user]);
        }
    };

    const handleCreateProject = async () => {
        // Preparamos el payload, incluyendo owner_id. Si no se eligió otro, se usa el owner por defecto.
        const payload = {
            name: projectName,
            description,
            methodology,
            stakeholders,
            start_date: startDate,
            end_date: endDate,
            priority,
            owner_id: owner ? owner.id : null,
        };

        try {
            // Crear el proyecto en el backend
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                console.error('Error creando el proyecto');
                return;
            }

            const data = await res.json();
            const projectId = data.projectId;

            // Asociar cada miembro del equipo al proyecto
            for (const member of teamMembers) {
                await fetch(`/api/projects/${projectId}/team`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify({
                        userIdToAdd: member.id,
                        role: 'Member'
                    })
                });
            }

            navigate('/DMAIC'); // Redirige a la siguiente etapa
        } catch (error) {
            console.error('Error al crear el proyecto y asociar miembros:', error);
        }
    };

    return (
        <main className="container mx-auto p-4 flex-grow">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Create a New Project</h2>
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateProject();
                    }}
                >
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
                    {/* Project Leader Section */}
                    <div>
                        <label htmlFor="ownerSearch" className="block text-sm font-medium text-gray-700">
                            Project Leader
                        </label>
                        <input
                            type="text"
                            id="ownerSearch"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Search for a leader..."
                            value={ownerSearchTerm}
                            onChange={(e) => setOwnerSearchTerm(e.target.value)}
                        />
                        {ownerSearchResults.length > 0 && (
                            <ul className="mt-2 border rounded-md p-2">
                                {ownerSearchResults.map((user) => (
                                    <li key={user.id} className="flex justify-between items-center">
                                        <span>{user.username}</span>

                                        <button
                                            type="button"
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                            onClick={() => {
                                                setOwner(user);
                                                setOwnerSearchTerm(user.username);
                                                setOwnerSearchResults([]);
                                            }}
                                        >
                                            Select
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {owner && (
                            <p className="mt-2 text-sm">
                                Selected Leader: <strong>{owner.username}</strong>
                            </p>
                        )}
                    </div>
                    {/* Team Members Section */}
                    <div>
                        <label htmlFor="teamSearch" className="block text-sm font-medium text-gray-700">
                            Add Team Members
                        </label>
                        <input
                            type="text"
                            id="teamSearch"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <ul className="mt-2 border rounded-md p-2">
                                {searchResults.map((user) => (
                                    <li key={user.id} className="flex justify-between items-center">
                                        <span>{user.username}</span>
                                        <button
                                            type="button"
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                            onClick={() => handleAddTeamMember(user)}
                                        >
                                            +
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {teamMembers.length > 0 && (
                            <div className="mt-2">
                                <h4 className="text-sm font-medium">Selected Team Members:</h4>
                                <ul className="mt-1">
                                    {teamMembers.map((member) => (
                                        <li key={member.id}>{member.username}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400"
                            onClick={() => console.log('Cancelled')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default CreateForm;
