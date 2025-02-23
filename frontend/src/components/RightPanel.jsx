import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaSave, FaCheckCircle, FaExclamationCircle, FaTools } from 'react-icons/fa';
import { getPhaseRequirements, getPhaseDescription, getRecommendedTools } from '../utils/phaseRequirements';

const RightPanel = ({
    isOpen,
    currentStage,
    projectData,
    onSave,
    onPhaseComplete,
    onAddTool
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

    const checkRequirements = () => {
        const requiredFields = requirements.filter(req => req.required);
        return requiredFields.every(req => Boolean(formData[req.id]));
    };

    const renderTabs = () => (
        <div className="flex border-b mb-4">
            <button
                onClick={() => setActiveTab('inputs')}
                className={`px-4 py-2 -mb-px ${activeTab === 'inputs'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                Inputs
            </button>
            <button
                onClick={() => setActiveTab('requirements')}
                className={`px-4 py-2 -mb-px ${activeTab === 'requirements'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                Requirements
            </button>
            <button
                onClick={() => setActiveTab('tools')}
                className={`px-4 py-2 -mb-px ${activeTab === 'tools'
                    ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
            >
                Tools
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
                            onClick={() => onAddTool(tool.id)}
                            className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className={`fixed top-16 bottom-0 right-0 w-96 bg-white shadow-lg transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
            } overflow-y-auto z-10`}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {currentStage} Phase
                    </h2>
                </div>

                {renderTabs()}

                {activeTab === 'requirements' && renderRequirements()}
                {activeTab === 'tools' && renderTools()}
                {activeTab === 'inputs' && (
                    <div className="space-y-6">
                        <div className="space-y-6">
                            {Object.entries(getPhaseRequirements(currentStage)).map(([key, field]) => (
                                <div key={key}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        value={formData[key] || ''}
                                        onChange={(e) => handleChange(key, e.target.value)}
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
                                disabled={!checkRequirements()}
                                className={`w-full py-2 rounded-lg flex items-center justify-center ${checkRequirements()
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                Complete Phase
                                <FaChevronRight className="ml-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RightPanel;