import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButton from '../components/FloatingButton';
import { useAuth } from '../contexts/AuthContext';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';
import DmaicNavigation from '../components/DmaicNavigation';
import ContentArea from '../components/ContentArea';
//import { getCurrentPhase, sortDmaicStages } from '../utils/dmaicUtils';

const DMAIC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  // Project state
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // Panel states
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true); // Right panel open by default

  // Current DMAIC stage
  const [currentStage, setCurrentStage] = useState('Define');
  const [dmaicStages, setDmaicStages] = useState([]);

  // Card states for each phase
  const [defineCards, setDefineCards] = useState([]);
  const [measureCards, setMeasureCards] = useState([]);
  const [analyzeCards, setAnalyzeCards] = useState([]);
  const [improveCards, setImproveCards] = useState([]);
  const [controlCards, setControlCards] = useState([]);

  // Load project data
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

        // Check if current user is owner
        const userId = JSON.parse(localStorage.getItem('currentUser'))?.id;
        setIsOwner(projectData.owner_id === userId);

        // Map DMAIC stages
        if (projectData.dmaicStages && projectData.dmaicStages.length > 0) {
          const mappedStages = projectData.dmaicStages.map(stage => ({
            name: stage.stage_name,
            started: true,
            completed: stage.completed
          }));

          // Order stages correctly
          const orderedStages = ['Define', 'Measure', 'Analyze', 'Improve', 'Control']
            .map(stageName =>
              mappedStages.find(s => s.name === stageName) ||
              { name: stageName, started: false, completed: false }
            );

          setDmaicStages(orderedStages);

          // Set current stage based on first incomplete stage
          const firstIncompleteStage = orderedStages.find(stage => !stage.completed);
          if (firstIncompleteStage) {
            setCurrentStage(firstIncompleteStage.name);
          }

          // Load cards for each phase
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

  // Load cards from stage data
  const loadCardsFromStageData = (stages) => {
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

  const handleSavePhase = async (phaseData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/dmaic/${projectId}/${currentStage}`,
        {
          data: {
            ...phaseData,
            history: [
              ...(phaseData.history || []),
              {
                action: 'update',
                timestamp: new Date().toISOString(),
                userId: project.owner_id
              }
            ]
          }
        },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      // Update local state with new data
      setProject(prev => ({
        ...prev,
        dmaicStages: prev.dmaicStages.map(stage =>
          stage.stage_name === currentStage ? response.data.dmaicStage : stage
        )
      }));

      return response.data;
    } catch (error) {
      console.error('Error saving phase data:', error);
      throw error;
    }
  };

  // Save changes to server
  const saveStageData = async (stageName, cards) => {
    try {
      const stageData = { cards };
      const completed = false;

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
    }
  };

  // Mark current phase as complete and move to next
  const completeCurrentPhase = async () => {
    try {
      const currentStageIndex = dmaicStages.findIndex(stage => stage.name === currentStage);
      const nextStage = dmaicStages[currentStageIndex + 1]?.name;

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/dmaic/${projectId}/${currentStage}`,
        {
          data: { cards: getCardsForStage(currentStage) },
          completed: true
        },
        {
          headers: { 'Authorization': `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      // Update local state
      setProject(prev => ({
        ...prev,
        dmaicStages: prev.dmaicStages.map(stage =>
          stage.stage_name === currentStage ? response.data.dmaicStage : stage
        )
      }));

      const updatedStages = dmaicStages.map(stage =>
        stage.name === currentStage
          ? { ...stage, completed: true }
          : stage.name === nextStage
            ? { ...stage, started: true }
            : stage
      );

      setDmaicStages(updatedStages);

      if (nextStage) {
        setCurrentStage(nextStage);
      }
    } catch (error) {
      console.error("Error completing phase:", error);
      alert("Failed to complete phase. Please try again.");
    }
  };

  // Add a new card
  const handleAddCard = (type) => {
    const newId = Date.now();
    let newCard;

    if (type === 'IS_IS_NOT') {
      newCard = {
        id: newId,
        type: 'IS_IS_NOT',
        data: {
          title: "",
          problemStatement: "",
          is: { what: "", where: "", when: "", who: "", howMuch: "" },
          isNot: { what: "", where: "", when: "", who: "", howMuch: "" },
          editionMode: true,
        },
      };
    } else if (type === 'RICH_TEXT') {
      newCard = {
        id: newId,
        type: 'RICH_TEXT',
        data: {
          title: "",
          content: "<p>Texto nuevo</p>",
          editionMode: true,
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

    const updatedCards = getCardsForStage(currentStage).concat(newCard);
    updateCardsForStage(currentStage, updatedCards);
    saveStageData(currentStage, updatedCards);
  };

  // Get cards for current stage
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

  // Update cards for a specific stage
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

  // Delete a card
  const handleDeleteCard = (id) => {
    const currentCards = getCardsForStage(currentStage);
    const updatedCards = currentCards.filter((card) => card.id !== id);
    updateCardsForStage(currentStage, updatedCards);
    saveStageData(currentStage, updatedCards);
  };

  // Save card changes
  const handleSaveCard = (id, newData) => {
    const currentCards = getCardsForStage(currentStage);
    const updatedCards = currentCards.map((card) =>
      card.id === id ? { ...card, data: newData } : card
    );
    updateCardsForStage(currentStage, updatedCards);
    saveStageData(currentStage, updatedCards);
  };

  // Check if requirements are complete
  const checkRequirementsComplete = () => {
    const currentCards = getCardsForStage(currentStage);
    // This is a simplified check - you might want more sophisticated validation
    return currentCards.length >= 2;
  };

  // Get completion percentage
  const getCompletionPercentage = () => {
    if (!dmaicStages || dmaicStages.length === 0) return 0;
    const completedStages = dmaicStages.filter(stage => stage.completed).length;
    return Math.round((completedStages / dmaicStages.length) * 100);
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Main Header */}
      <Header title={project?.name || "DMAIC Process"} />

      {/* DMAIC Phase Navigation */}
      <DmaicNavigation
        stages={dmaicStages}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        completionPercentage={getCompletionPercentage()}
      />

      <div className="flex flex-grow relative">
        {/* Left Panel - Project Info */}
        <LeftPanel
          isOpen={leftPanelOpen}
          project={project}
          isOwner={isOwner}
          dmaicStages={dmaicStages}
        />

        {/* Left Panel Toggle Button */}
        <button
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-r-md p-2 z-20"
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          aria-label={leftPanelOpen ? "Close project info panel" : "Open project info panel"}
        >
          {leftPanelOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>

        {/* Main Content Area */}
        <ContentArea
          currentStage={currentStage}
          currentCards={getCardsForStage(currentStage)}
          handleAddCard={handleAddCard}
          handleDeleteCard={handleDeleteCard}
          handleSaveCard={handleSaveCard}
          leftPanelOpen={leftPanelOpen}
          rightPanelOpen={rightPanelOpen}
        />

        {/* Right Panel - Phase Requirements */}
        <RightPanel
          isOpen={rightPanelOpen}
          currentStage={currentStage}
          projectData={project}
          onSave={handleSavePhase}         // Add this
          onPhaseComplete={completeCurrentPhase}
          handleAddCard={handleAddCard}    // Keep your existing prop
          requirementsComplete={checkRequirementsComplete()}  // Keep your existing prop
        />

        {/* Right Panel Toggle Button */}
        <button
          className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-l-md p-2 z-20"
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          aria-label={rightPanelOpen ? "Close requirements panel" : "Open requirements panel"}
        >
          {rightPanelOpen ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Floating Action Button */}
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