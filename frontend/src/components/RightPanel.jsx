import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const RightPanel = ({
    isOpen,
    currentStage,
    handleAddCard,
    requirementsComplete,
    completeCurrentPhase
}) => {
    // Get phase requirements based on current stage
    const getPhaseRequirements = () => {
        const requirements = {
            'Define': [
                { id: 'problem-statement', name: 'Problem Statement', description: 'Clear definition of the problem to be solved' },
                { id: 'project-scope', name: 'Project Scope', description: 'Boundaries of the project and what will/won\'t be addressed' },
                { id: 'smart-goals', name: 'SMART Goals', description: 'Specific, Measurable, Achievable, Relevant, Time-bound objectives' },
                { id: 'stakeholder-analysis', name: 'Stakeholder Analysis', description: 'Identify all parties affected by the project' },
            ],
            'Measure': [
                { id: 'data-collection-plan', name: 'Data Collection Plan', description: 'How data will be gathered, by whom, and when' },
                { id: 'current-metrics', name: 'Current Metrics', description: 'Baseline measurements of the process' },
                { id: 'process-mapping', name: 'Process Mapping', description: 'Visual representation of the current process' },
            ],
            'Analyze': [
                { id: 'root-cause-analysis', name: 'Root Cause Analysis', description: 'Identification of underlying causes' },
                { id: 'data-analysis', name: 'Data Analysis', description: 'Statistical analysis of collected data' },
                { id: 'value-analysis', name: 'Value Analysis', description: 'Identification of value-adding vs. non-value-adding activities' },
            ],
            'Improve': [
                { id: 'solution-options', name: 'Solution Options', description: 'Potential improvements to address root causes' },
                { id: 'implementation-plan', name: 'Implementation Plan', description: 'How solutions will be rolled out' },
                { id: 'risk-analysis', name: 'Risk Analysis', description: 'Potential issues and mitigation strategies' },
            ],
            'Control': [
                { id: 'control-plan', name: 'Control Plan', description: 'How improvements will be maintained over time' },
                { id: 'monitoring-system', name: 'Monitoring System', description: 'Ongoing measurement of key metrics' },
                { id: 'documentation', name: 'Documentation', description: 'All process changes, training materials, and procedures' },
                { id: 'handover-plan', name: 'Handover Plan', description: 'Transition of responsibility to process owners' },
            ]
        };

        return requirements[currentStage] || [];
    };

    return (
        <div className={`bg-white shadow-lg fixed top-32 bottom-0 right-0 z-10 transition-all duration-300 overflow-y-auto
      ${isOpen ? 'w-80' : 'w-0'}`}>
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">{currentStage} Requirements</h2>

                <div className="space-y-6">
                    {/* Phase Description */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            About This Phase
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {currentStage === 'Define' && 'Define the problem, goals, and project scope clearly.'}
                            {currentStage === 'Measure' && 'Collect baseline data to understand the current state.'}
                            {currentStage === 'Analyze' && 'Identify root causes and process inefficiencies.'}
                            {currentStage === 'Improve' && 'Develop and implement solutions to address root causes.'}
                            {currentStage === 'Control' && 'Establish controls to maintain improvements over time.'}
                        </p>
                    </div>

                    {/* Requirements Checklist */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                            Required Outputs
                        </h3>
                        <div className="space-y-3">
                            {getPhaseRequirements().map((req, idx) => (
                                <div key={idx} className="flex items-start">
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5 mr-3"></div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-800">{req.name}</h4>
                                        <p className="text-xs text-gray-500">{req.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Tools */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                            Recommended Tools
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {currentStage === 'Define' && (
                                <>
                                    <button onClick={() => handleAddCard('IS_IS_NOT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        IS/IS NOT Analysis
                                    </button>
                                    <button onClick={() => handleAddCard('SIPOC')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        SIPOC Diagram
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Problem Statement Document
                                    </button>
                                </>
                            )}
                            {currentStage === 'Measure' && (
                                <>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Data Collection Plan
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Process Map
                                    </button>
                                </>
                            )}
                            {currentStage === 'Analyze' && (
                                <>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Root Cause Analysis
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        5 Why Analysis
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Fishbone Diagram
                                    </button>
                                </>
                            )}
                            {currentStage === 'Improve' && (
                                <>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Solution Matrix
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Implementation Plan
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Pilot Test Results
                                    </button>
                                </>
                            )}
                            {currentStage === 'Control' && (
                                <>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Control Plan
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Standard Operating Procedure
                                    </button>
                                    <button onClick={() => handleAddCard('RICH_TEXT')} className="text-left px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition">
                                        Training Documentation
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Complete Phase Button */}
                    <div className="pt-6 mt-8 border-t border-gray-200">
                        <button
                            onClick={completeCurrentPhase}
                            disabled={!requirementsComplete}
                            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${requirementsComplete
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <span>Complete & Continue</span>
                            <FaArrowRight className="ml-2" />
                        </button>
                        {!requirementsComplete && (
                            <p className="mt-2 text-xs text-center text-amber-600">
                                Add more content to complete this phase
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;