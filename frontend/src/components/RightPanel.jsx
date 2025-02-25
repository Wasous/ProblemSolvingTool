import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft, FaSave, FaCheckCircle, FaExclamationCircle, FaTools, FaListAlt, FaClipboardList } from 'react-icons/fa';
import { getPhaseRequirements, getPhaseDescription, getRecommendedTools } from '../utils/phaseRequirements';

const RightPanel = ({
    isOpen,
    setRightPanelOpen,
    currentStage,
    projectData,
    onSave,
    onPhaseComplete,
    handleAddCard,
    requirementsComplete
}) => {
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('inputs'); // 'inputs', 'requirements', or 'tools'
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (projectData?.dmaicStages) {
            const currentStageData = projectData.dmaicStages.find(
                stage => stage.stage_name === currentStage
            );
            setFormData(currentStageData?.data || {});
        }
    }, [currentStage, projectData]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    const requirements = getPhaseRequirements(currentStage);
    const phaseDescription = getPhaseDescription(currentStage);
    const recommendedTools = getRecommendedTools(currentStage);

    const getRequirementCompletionStatus = () => {
        const completedCount = requirements.filter(req => Boolean(formData[req.id])).length;
        return {
            total: requirements.length,
            completed: completedCount,
            percentage: requirements.length > 0 ? Math.round((completedCount / requirements.length) * 100) : 0
        };
    };

    const requirementStatus = getRequirementCompletionStatus();

    const renderTabs = () => (
        <div className="flex border-b mb-4">
            <button
                onClick={() => setActiveTab('inputs')}
                className={`px-4 py-2 -mb-px ${activeTab === 'inputs'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <span className="flex items-center">
                    <FaClipboardList className="mr-2" />
                    Inputs
                </span>
            </button>
            <button
                onClick={() => setActiveTab('requirements')}
                className={`px-4 py-2 -mb-px ${activeTab === 'requirements'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <span className="flex items-center">
                    <FaListAlt className="mr-2" />
                    Requirements
                </span>
            </button>
            <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 -mb-px ${activeTab === 'tools'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                <span className="flex items-center">
                    <FaTools className="mr-2" />
                    Tools
                </span>
            </button>
        </div>
    );

    const renderRequirements = () => (
        <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-6">{phaseDescription}</p>

            {requirements.map((req) => (
                <div
                    key={req.id}
                    className={`flex items-start p-4 rounded-lg ${formData[req.id] ? 'bg-green-50' : 'bg-gray-50'
                        }`}
                >
                    <div className="flex-shrink-0 mt-1">
                        {formData[req.id] ? (
                            <FaCheckCircle className="text-green-500" />
                        ) : (
                            <FaExclamationCircle className={`${req.required ? 'text-amber-500' : 'text-gray-400'
                                }`} />
                        )}
                    </div>
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                            {req.label}
                            {req.required && <span className="text-red-500">*</span>}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {formData[req.id] ? 'Completed' : 'Not yet completed'}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderTools = () => (
        <div className="space-y-4">
            {recommendedTools.map((tool) => (
                <div
                    key={tool.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-medium text-gray-900">{tool.name}</h4>
                            <p className="text-sm text-gray-500">{tool.description}</p>
                        </div>
                        <button
                            onClick={() => handleAddCard(tool.id)}
                            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderInputs = () => (
        <div className="space-y-6">
            <div className="space-y-6">
                {requirements.map((field) => (
                    <div key={field.id}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 h-32"
                            placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t space-y-4">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                    <FaSave className="mr-2" />
                    {saving ? 'Saving...' : 'Save Progress'}
                </button>

                <button
                    onClick={onPhaseComplete}
                    disabled={!requirementsComplete}
                    className={`w-full py-2 rounded-lg flex items-center justify-center ${requirementsComplete
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Complete Phase
                    <FaChevronRight className="ml-2" />
                </button>
            </div>
        </div>
    );

    // Collapsed state content
    const CollapsedContent = () => (
        <div className="h-full flex flex-col items-center py-6">
            {/* Current stage vertical text */}
            <div className="mb-6 transform -rotate-90 origin-center whitespace-nowrap">
                <h2 className="text-xl font-bold text-gray-800">
                    {currentStage} Phase
                </h2>
            </div>

            {/* Requirements progress circle */}
            <div className="mb-4 relative w-16 h-16">
                <svg className="w-16 h-16" viewBox="0 0 36 36">
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="3"
                    />
                    <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={requirementStatus.completed > 0 ? "#4ade80" : "#ccc"}
                        strokeWidth="3"
                        strokeDasharray={`${requirementStatus.percentage}, 100`}
                    />
                    <text
                        x="18"
                        y="20.5"
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="bold"
                        fill="#666"
                    >
                        {requirementStatus.completed}/{requirementStatus.total}
                    </text>
                </svg>
            </div>

            {/* Tool buttons */}
            <div className="space-y-4 flex flex-col items-center">
                <button
                    onClick={() => {
                        setRightPanelOpen(true);
                        setActiveTab('inputs');
                    }}
                    className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center hover:bg-blue-200"
                    title="Edit Inputs"
                >
                    <FaClipboardList />
                </button>
                <button
                    onClick={() => {
                        setRightPanelOpen(true);
                        setActiveTab('requirements');
                    }}
                    className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center hover:bg-green-200"
                    title="View Requirements"
                >
                    <FaListAlt />
                </button>
                <button
                    onClick={() => {
                        setRightPanelOpen(true);
                        setActiveTab('tools');
                    }}
                    className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-200"
                    title="Add Tools"
                >
                    <FaTools />
                </button>
            </div>

            {/* Complete phase button (mini version) */}
            {requirementsComplete && (
                <button
                    onClick={onPhaseComplete}
                    className="mt-6 w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
                    title="Complete Phase"
                >
                    <FaCheckCircle size={20} />
                </button>
            )}
        </div>
    );

    return (
        <div className={`fixed top-16 bottom-0 right-0 transition-all duration-300 bg-white shadow-lg z-10
            ${isOpen ? 'w-80' : 'w-20'}`}>

            {/* Toggle button */}
            <button
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white shadow-md rounded-full p-2 z-20"
                onClick={() => setRightPanelOpen(!isOpen)}
                aria-label={isOpen ? "Collapse requirements panel" : "Expand requirements panel"}
            >
                {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            {/* Panel content */}
            {isOpen ? (
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            {currentStage} Phase
                        </h2>
                    </div>

                    {renderTabs()}

                    {activeTab === 'requirements' && renderRequirements()}
                    {activeTab === 'tools' && renderTools()}
                    {activeTab === 'inputs' && renderInputs()}
                </div>
            ) : (
                <CollapsedContent />
            )}
        </div>
    );
};

export default RightPanel;