import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import IsIsNotCard from '../components/IsIsNot';
import FloatingButton from '../components/FloatingButton';
import RichTextCard from '../components/RichTextCard';
import SipocCard from '../components/Sipoc';
import { useAuth } from '../contexts/AuthContext';

const DMAIC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  
  // Estado para el proyecto
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del stage actual
  const [currentStage, setCurrentStage] = useState('Define');

  // Stages DMAIC con sus estados (se actualizará con datos del proyecto)
  const [dmaicStages, setDmaicStages] = useState([]);

  // Estados para las cards de cada fase
  const [defineCards, setDefineCards] = useState([]);
  const [measureCards, setMeasureCards] = useState([]);
  const [analyzeCards, setAnalyzeCards] = useState([]);
  const [improveCards, setImproveCards] = useState([]);
  const [controlCards, setControlCards] = useState([]);

  // Cargar datos del proyecto al montar el componente
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError('No project ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          withCredentials: true,
        });
        
        const projectData = response.data.project;
        setProject(projectData);
        
        // Mapear etapas DMAIC del proyecto
        if (projectData.dmaicStages && projectData.dmaicStages.length > 0) {
          const mappedStages = projectData.dmaicStages.map(stage => ({
            name: stage.stage_name,
            started: true, // Todas las etapas están disponibles inicialmente
            completed: stage.completed
          }));
          
          // Ordenar las etapas en el orden correcto
          const orderedStages = ['Define', 'Measure', 'Analyze', 'Improve', 'Control']
            .map(stageName => 
              mappedStages.find(s => s.name === stageName) || 
              { name: stageName, started: false, completed: false }
            );
            
          setDmaicStages(orderedStages);
          
          // Establecer el stage actual basado en la primera etapa no completada
          const firstIncompleteStage = orderedStages.find(stage => !stage.completed);
          if (firstIncompleteStage) {
            setCurrentStage(firstIncompleteStage.name);
          }
          
          // Cargar tarjetas para cada fase desde stage.data
          loadCardsFromStageData(projectData.dmaicStages);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError("Failed to load project data. Please try again.");
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId, accessToken]);
  
  // Función para cargar tarjetas desde los datos de cada etapa
  const loadCardsFromStageData = (stages) => {
    // Para cada etapa, buscar sus datos y convertirlos en tarjetas
    stages.forEach(stage => {
      const stageData = stage.data || {};
      const cardsArray = stageData.cards || [];
      
      switch (stage.stage_name) {
        case 'Define':
          setDefineCards(cardsArray.length > 0 ? cardsArray : []); 
          break;
        case 'Measure':
          setMeasureCards(cardsArray.length > 0 ? cardsArray : []);
          break;
        case 'Analyze':
          setAnalyzeCards(cardsArray.length > 0 ? cardsArray : []);
          break;
        case 'Improve':
          setImproveCards(cardsArray.length > 0 ? cardsArray : []);
          break;
        case 'Control':
          setControlCards(cardsArray.length > 0 ? cardsArray : []);
          break;
        default:
          break;
      }
    });
  };

  // Función para guardar los cambios en el servidor
  const saveStageData = async (stageName, cards) => {
    try {
      const stageData = { cards };
      const completed = false; // Esto podría ser un parámetro adicional
      
      await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/dmaic/${projectId}/${stageName}`,
        { data: stageData, completed },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      
      console.log(`${stageName} stage data saved successfully`);
    } catch (error) {
      console.error(`Error saving ${stageName} stage data:`, error);
      // Podrías mostrar un toast o notificación aquí
    }
  };

  // Función para añadir una nueva tarjeta
  const handleAddCard = (type) => {
    const newId = Date.now(); // ID único
    let newCard;

    if (type === 'IS_IS_NOT') {
      newCard = {
        id: newId,
        type: 'IS_IS_NOT',
        data: {
          title: "",
          is: { what: "", where: "", when: "", who: "", howMuch: "" },
          isNot: { what: "", where: "", when: "", who: "", howMuch: "" },
          editionMode: true, // Arranca en edición
        },
      };
    } else if (type === 'RICH_TEXT') {
      newCard = {
        id: newId,
        type: 'RICH_TEXT',
        data: {
          title: "",
          content: "<p>Texto nuevo</p>",
          editionMode: true, // Arranca en edición
        },
      };
    } else if (type === 'SIPOC') {
      newCard = {
        id: newId,
        type: 'SIPOC',
        data: {
          title: "",
          suppliers: "",
          inputs: "",
          process: "",
          outputs: "",
          customers: "",
          editionMode: true,
        },
      };
    }

    // Actualizar el array correspondiente al currentStage
    const updatedCards = getCardsForStage(currentStage).concat(newCard);
    updateCardsForStage(currentStage, updatedCards);
    
    // Guardar en el servidor
    saveStageData(currentStage, updatedCards);
  };

  // Función para obtener las tarjetas de la etapa actual
  const getCardsForStage = (stageName) => {
    switch (stageName) {
      case 'Define': return defineCards;
      case 'Measure': return measureCards;
      case 'Analyze': return analyzeCards;
      case 'Improve': return improveCards;
      case 'Control': return controlCards;
      default: return [];
    }
  };
  
  // Función para actualizar las tarjetas de una etapa
  const updateCardsForStage = (stageName, cards) => {
    switch (stageName) {
      case 'Define': setDefineCards(cards); break;
      case 'Measure': setMeasureCards(cards); break;
      case 'Analyze': setAnalyzeCards(cards); break;
      case 'Improve': setImproveCards(cards); break;
      case 'Control': setControlCards(cards); break;
      default: break;
    }
  };

  // Función para eliminar una tarjeta
  const handleDeleteCard = (id) => {
    const currentCards = getCardsForStage(currentStage);
    const updatedCards = currentCards.filter((card) => card.id !== id);
    updateCardsForStage(currentStage, updatedCards);
    
    // Guardar en el servidor
    saveStageData(currentStage, updatedCards);
  };

  // Función para actualizar una tarjeta (al guardar cambios)
  const handleSaveCard = (id, newData) => {
    const currentCards = getCardsForStage(currentStage);
    const updatedCards = currentCards.map((card) => 
      card.id === id ? { ...card, data: newData } : card
    );
    updateCardsForStage(currentStage, updatedCards);
    
    // Guardar en el servidor
    saveStageData(currentStage, updatedCards);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col pt-28 items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading project data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col pt-28 items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/projects')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <Header
        title={project?.name || "DMAIC Process"}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        dmaicStages={dmaicStages} />

      {(() => {
        const currentCards = getCardsForStage(currentStage);
        
        if (currentCards.length === 0) {
          return (
            <div className="container mx-auto p-8 text-center">
              <p className="text-gray-600 mb-4">No items found for this stage. Use the + button to add content.</p>
            </div>
          );
        }
        
        return (
          <>
            {/* Render de todas las cards del stage actual */}
            {currentCards.map((card) => {
              switch (card.type) {
                case 'IS_IS_NOT':
                  return (
                    <IsIsNotCard
                      key={card.id}
                      data={card.data}
                      onDelete={() => handleDeleteCard(card.id)}
                      onSave={(newData) => handleSaveCard(card.id, newData)}
                    />
                  );
                case 'RICH_TEXT':
                  return (
                    <RichTextCard
                      key={card.id}
                      initialValue={card.data}
                      onDelete={() => handleDeleteCard(card.id)}
                      onSave={(newContent) =>
                        handleSaveCard(card.id, { ...card.data, content: newContent })
                      }
                    />
                  );
                case 'SIPOC':
                  return (
                    <SipocCard
                      key={card.id}
                      data={card.data}
                      onDelete={() => handleDeleteCard(card.id)}
                      onSave={(newData) => handleSaveCard(card.id, newData)}
                    />
                  );
                default:
                  return null;
              }
            })}
          </>
        );
      })()}
      
      {/* Botón para añadir nuevas tarjetas */}
      <FloatingButton
        addIsIsNot={() => handleAddCard('IS_IS_NOT')}
        addRichText={() => handleAddCard('RICH_TEXT')}
        addSipoc={() => handleAddCard('SIPOC')}
      />

      <Footer />
    </div>
  );
};

export default DMAIC;