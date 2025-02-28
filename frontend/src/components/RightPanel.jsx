import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
    FaChevronRight,
    FaChevronLeft,
    FaSave,
    FaCheckCircle,
    FaExclamationCircle,
    FaTools,
    FaListAlt,
    FaClipboardList
} from 'react-icons/fa';
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
    const [showCloseButton, setShowCloseButton] = useState(false);

    useEffect(() => {
        if (projectData?.dmaicStages) {
            const currentStageData = projectData.dmaicStages.find(
                stage => stage.stage_name === currentStage
            );
            setFormData(currentStageData?.data || {});
        }
    }, [currentStage, projectData]);

    // Effect to handle the close button appearance after panel animation completes
    useEffect(() => {
        let timer;
        if (isOpen) {
            // Show the close button after the panel animation completes (300ms)
            timer = setTimeout(() => {
                setShowCloseButton(true);
            }, 300);
        } else {
            // Hide the close button immediately when panel starts closing
            setShowCloseButton(false);
        }

        return () => clearTimeout(timer);
    }, [isOpen]);

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

    // Navigation items
    const navItems = [
        { id: 'inputs', label: 'Inputs', icon: FaClipboardList },
        { id: 'requirements', label: 'Reqs', icon: FaListAlt },
        { id: 'tools', label: 'Tools', icon: FaTools }
    ];

    // Handle tab click - in sidebar
    const handleTabClick = (tab) => {
        if (activeTab === tab) {
            // If clicking the active tab, close the panel and deselect the tab
            setRightPanelOpen(false);
            setActiveTab(null);
        } else {
            // If clicking a different tab, open the panel and select that tab
            setRightPanelOpen(true);
            setActiveTab(tab);
        }
    };

    // Close panel function
    const handleClosePanel = () => {
        setRightPanelOpen(false);
        setActiveTab(null);
    };

    return (
        <div className="fixed top-16 bottom-0 right-0 flex z-40">
            {/* Main Panel Content */}
            <div className={`
                bg-white border-l border-gray-200 shadow-md overflow-hidden
                transition-all duration-300
                ${isOpen ? 'w-80' : 'w-0'}
            `}>
                {isOpen && (
                    <>
                        {/* Close button with transition */}
                        <button
                            onClick={handleClosePanel}
                            className={`
                                absolute top-3 left-3 text-gray-500 hover:text-gray-700 
                                p-1 rounded-full hover:bg-gray-100
                                transition-opacity duration-200
                                ${showCloseButton ? 'opacity-100' : 'opacity-0'}
                            `}
                            title="Close panel"
                            aria-hidden={!showCloseButton}
                            tabIndex={showCloseButton ? 0 : -1}
                        >
                            <FaChevronRight size={16} />
                        </button>

                        <div className="p-5 h-full overflow-y-auto no-scrollbar pt-12">
                            {/* Use Radix UI Tabs */}
                            {activeTab && (
                                <Tabs.Root value={activeTab} defaultValue={activeTab}>
                                    <div className="mb-4">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            {currentStage} Phase
                                        </h2>
                                        <p className="text-sm text-gray-600">{phaseDescription}</p>
                                    </div>

                                    <Tabs.Content value="inputs">
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
                                    </Tabs.Content>

                                    <Tabs.Content value="requirements">
                                        <div className="space-y-4">
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
                                    </Tabs.Content>

                                    <Tabs.Content value="tools">
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
                                    </Tabs.Content>
                                </Tabs.Root>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Sidebar Navigation - Matching Left Panel Style */}
            <div className="w-16 bg-white border-l border-gray-200 flex flex-col items-center py-4 shadow-sm">
                {/* Navigation Tabs */}
                <div className="flex flex-col w-full">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => handleTabClick(item.id)}
                            className={`
                                group w-full py-3 flex flex-col items-center justify-center outline-none
                                transition-all duration-200 relative outline-none border-none focus:outline-none focus:ring-0 rounded-none
                                ${activeTab === item.id
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-500 hover:text-gray-900 bg-transparent hover:bg-gray-50'}
                            `}
                            aria-label={item.label}
                        >
                            {/* Icon */}
                            <item.icon className="text-xl" />

                            {/* Enhanced Tooltip */}
                            <div className="absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                {item.label}
                            </div>
                            <span className="text-xs mt-1">{item.label}</span>
                            {/* Active indicator bar */}
                            {activeTab === item.id && (
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-indigo-600"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Toggle open/close button */}
                <button
                    className="mt-auto w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors mb-4 group relative"
                    onClick={() => setRightPanelOpen(!isOpen)}
                    aria-label={isOpen ? "Collapse panel" : "Expand panel"}
                >
                    {isOpen ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}

                    {/* Tooltip for toggle button */}
                    <div className="absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {isOpen ? "Collapse panel" : "Expand panel"}
                    </div>
                </button>
            </div>
        </div>
    );
};

export default RightPanel;