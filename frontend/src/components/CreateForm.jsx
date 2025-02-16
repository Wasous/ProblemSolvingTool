import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateForm = () => {
  // Helper para formatear la fecha en YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split('T')[0];
  const today = new Date();
  const defaultStartDate = formatDate(today);
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(today.getMonth() + 1);
  const defaultEndDate = formatDate(oneMonthLater);

  // Campos del formulario básico
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [methodology, setMethodology] = useState('DMAIC');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [priority, setPriority] = useState('Medium');

  // Nuevo: Los tags se manejarán por su modelo independiente
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  // Estados para la selección del líder
  const [owner, setOwner] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [ownerSearchTerm, setOwnerSearchTerm] = useState('');
  const [ownerSearchResults, setOwnerSearchResults] = useState([]);

  // Estados para miembros del equipo
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  // Cargar etiquetas disponibles
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tags', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableTags(res.data.tags || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [token]);

  // Función de búsqueda para líder
  const handleOwnerSearch = useCallback(async () => {
    if (!ownerSearchTerm.trim()) {
      setOwnerSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/search?term=${ownerSearchTerm}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOwnerSearchResults(response.data.users);
    } catch (error) {
      console.error("Error buscando líder:", error);
    }
  }, [ownerSearchTerm, token]);

  useEffect(() => {
    if (ownerSearchTerm.trim() !== '') {
      handleOwnerSearch();
    } else {
      setOwnerSearchResults([]);
    }
  }, [ownerSearchTerm, handleOwnerSearch]);

  // Función de búsqueda para miembros del equipo
  const handleTeamSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/search?term=${searchTerm}&limit=10`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Error buscando miembros:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      handleTeamSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Añadir miembro del equipo al hacer click en el nombre
  const handleAddTeamMember = (user) => {
    if (!teamMembers.some(member => member.id === user.id)) {
      setTeamMembers(prevMembers => [...prevMembers, user]);
    }
  };

  // Eliminar miembro del equipo
  const handleRemoveTeamMember = (userId) => {
    setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== userId));
  };

  // Manejo de selección de etiquetas: al hacer click en una etiqueta disponible se añade o elimina de las seleccionadas
  const toggleTagSelection = (tag) => {
    if (selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Crear una nueva etiqueta y agregarla a las listas de availableTags y selectedTags
  const handleCreateTag = async () => {
    if (!newTag.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/tags', { name: newTag }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const createdTag = res.data.tag; // Suponemos que el endpoint devuelve { tag: { id, name } }
      setAvailableTags([...availableTags, createdTag]);
      setSelectedTags([...selectedTags, createdTag]);
      setNewTag('');
    } catch (error) {
      console.error("Error creating new tag:", error);
    }
  };

  // Crear Proyecto: Se crea el proyecto y luego se asocian los miembros del equipo.
  // Se envían también los tags seleccionados como array de IDs.
  const handleCreateProject = async () => {
    const payload = {
      name: projectName,
      description,
      methodology,
      stakeholders,
      start_date: startDate,
      end_date: endDate,
      priority,
      status: "Not Started",  // Valor predeterminado
      owner_id: owner ? owner.id : null,
      tags: selectedTags.map(tag => tag.id)  // Enviar array de IDs de tags
    };

    try {
      const res = await axios.post('http://localhost:5000/api/projects', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const { projectId } = res.data;

      // Asociar cada miembro del equipo al proyecto
      for (const member of teamMembers) {
        await axios.post(`http://localhost:5000/api/projects/${projectId}/team`, {
          userIdToAdd: member.id,
          role: 'Member'
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }

      navigate('/DMAIC'); // Redirige a la siguiente etapa del proceso
    } catch (error) {
      console.error('Error al crear el proyecto y asociar miembros:', error);
    }
  };

  return (
    <main className="container mx-auto p-4 flex-grow">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Create a New Project</h2>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateProject();
          }}
        >
          {/* LEFT COLUMN: Campos del formulario y búsquedas */}
          <div className="space-y-4">
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
            {/* Tags Section */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="flex flex-wrap space-x-2">
                {availableTags.map(tag => (
                  <button
                    type="button"
                    key={tag.id}
                    className={`px-2 py-1 rounded-full border ${selectedTags.some(t => t.id === tag.id) ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}
                    onClick={() => toggleTagSelection(tag)}
                  >
                    {tag.name}
                  </button>
                ))}
                {/* Input para crear nueva etiqueta */}
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="New tag"
                    className="px-2 py-1 border rounded"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
                    onClick={handleCreateTag}
                  >
                    Add
                  </button>
                </div>
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Selected Tags:</p>
                  <div className="flex flex-wrap space-x-2 mt-1">
                    {selectedTags.map(tag => (
                      <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Leader Search */}
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
                    <li
                      key={user.id}
                      className="cursor-pointer hover:bg-gray-100 p-1"
                      onClick={() => {
                        setOwner(user);
                        setOwnerSearchTerm(user.username);
                        setOwnerSearchResults([]);
                      }}
                    >
                      {user.username}
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
            {/* Team Members Search */}
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
                    <li
                      key={user.id}
                      className="cursor-pointer hover:bg-gray-100 p-1"
                      onClick={() => {
                        handleAddTeamMember(user);
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                    >
                      {user.username}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* RIGHT COLUMN: Team Preview */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 shadow-md bg-slate-300 border-slate-400">
              <h3 className="text-lg font-semibold mb-2">Team Preview</h3>
              {owner && (
                <div className="mb-4 p-2 border-b">
                  <span className="font-medium">Leader:</span> {owner.username}
                </div>
              )}
              {teamMembers.length > 0 ? (
                <ul className="space-y-2">
                  {teamMembers.map((member) => (
                    <li key={member.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                      <span>{member.username}</span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveTeamMember(member.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No team members selected.</p>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateForm;
