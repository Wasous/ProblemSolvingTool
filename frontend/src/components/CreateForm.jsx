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
        // Si el miembro es el owner, saltar (ya se agregó como Owner)
        if (owner && member.id === owner.id) continue;

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
    <main className="container mx-auto p-4 max-w-5xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Project</h2>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleCreateProject();
        }} className="space-y-8">
          {/* Basic Info Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Methodology
                </label>
                <div className="flex gap-4">
                  {['DMAIC', '8D'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      className={`flex-1 py-2 rounded-lg border transition ${methodology === method
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      onClick={() => setMethodology(method)}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`flex-1 py-2 px-3 rounded-lg border transition ${priority === p
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      onClick={() => setPriority(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Team Members</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leader Selection */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Leader
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Search for a leader..."
                    value={ownerSearchTerm}
                    onChange={(e) => setOwnerSearchTerm(e.target.value)}
                  />

                  {ownerSearchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
                      {ownerSearchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition"
                          onClick={() => {
                            setOwner(user);
                            setOwnerSearchTerm(user.username);
                            setOwnerSearchResults([]);
                          }}
                        >
                          {user.username}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {owner && (
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-700">Selected: {owner.username}</span>
                  </div>
                )}
              </div>

              {/* Team Members Selection */}
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Members
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Search for team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />

                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition"
                          onClick={() => {
                            handleAddTeamMember(user);
                            setSearchTerm('');
                            setSearchResults([]);
                          }}
                        >
                          {user.username}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{member.username}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="text-gray-400 hover:text-red-500 transition px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Tags</h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => toggleTagSelection(tag)}
                    className={`px-3 py-1 rounded-full border transition ${selectedTags.some(t => t.id === tag.id)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new tag"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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