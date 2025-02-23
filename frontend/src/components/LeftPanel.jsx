import React from 'react';
import { FaUser, FaCalendarAlt, FaTag, FaCheckCircle, FaClock } from 'react-icons/fa';

const LeftPanel = ({
    isOpen,
    project,
    currentStage
}) => {
    if (!project) return null;

    const calculatePhaseProgress = (stages) => {
        if (!stages || stages.length === 0) return {};

        const progress = {
            Define: { completed: false, data: {} },
            Measure: { completed: false, data: {} },
            Analyze: { completed: false, data: {} },
            Improve: { completed: false, data: {} },
            Control: { completed: false, data: {} }
        };

        stages.forEach(stage => {
            if (stage.data) {
                progress[stage.stage_name] = {
                    completed: stage.completed,
                    data: stage.data
                };
            }
        });

        return progress;
    };

    const phaseProgress = calculatePhaseProgress(project.dmaicStages);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString();
    };

    const PhaseSummary = ({ phase, isActive }) => {
        const phaseData = phaseProgress[phase]?.data || {};

        const getSummaryContent = () => {
            switch (phase) {
                case 'Define':
                    return phaseData.problemStatement
                        ? <p className="text-sm text-gray-600 line-clamp-2">{phaseData.problemStatement}</p>
                        : <p className="text-sm text-gray-400 italic">No problem statement defined</p>;
                case 'Measure':
                    return phaseData.currentMetrics
                        ? <p className="text-sm text-gray-600 line-clamp-2">{phaseData.currentMetrics}</p>
                        : <p className="text-sm text-gray-400 italic">No metrics defined</p>;
                case 'Analyze':
                    return phaseData.rootCauseAnalysis
                        ? <p className="text-sm text-gray-600 line-clamp-2">{phaseData.rootCauseAnalysis}</p>
                        : <p className="text-sm text-gray-400 italic">No root cause analysis</p>;
                case 'Improve':
                    return phaseData.proposedSolutions
                        ? <p className="text-sm text-gray-600 line-clamp-2">{phaseData.proposedSolutions}</p>
                        : <p className="text-sm text-gray-400 italic">No solutions proposed</p>;
                case 'Control':
                    return phaseData.controlPlan
                        ? <p className="text-sm text-gray-600 line-clamp-2">{phaseData.controlPlan}</p>
                        : <p className="text-sm text-gray-400 italic">No control plan defined</p>;
                default:
                    return null;
            }
        };

        return (
            <div className={`p-3 rounded-lg ${isActive ? 'bg-blue-50 border border-blue-100' :
                    phaseProgress[phase]?.completed ? 'bg-green-50 border border-green-100' :
                        'bg-gray-50 border border-gray-100'
                }`}>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-700">{phase}</h4>
                    {phaseProgress[phase]?.completed && (
                        <FaCheckCircle className="text-green-500" />
                    )}
                </div>
                {getSummaryContent()}
            </div>
        );
    };

    return (
        <div className={`fixed top-16 bottom-0 left-0 w-80 bg-white shadow-lg transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } overflow-y-auto z-10`}>
            <div className="p-6">
                {/* Project Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                            <FaUser className="mr-2" />
                            <span>{project.owner?.username || 'Unknown Owner'}</span>
                        </div>
                        <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                        </div>
                        <div className="flex items-center">
                            <FaClock className="mr-2" />
                            <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Project Description */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Description
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {project.description || 'No description provided'}
                    </p>
                </div>

                {/* Tags */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                        Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {project.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                            >
                                <FaTag className="mr-1" />
                                {tag.name}
                            </span>
                        ))}
                        {(!project.tags || project.tags.length === 0) && (
                            <span className="text-sm text-gray-400 italic">No tags</span>
                        )}
                    </div>
                </div>

                {/* DMAIC Progress */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
                        Phase Progress
                    </h3>
                    <div className="space-y-3">
                        {['Define', 'Measure', 'Analyze', 'Improve', 'Control'].map(phase => (
                            <PhaseSummary
                                key={phase}
                                phase={phase}
                                isActive={currentStage === phase}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeftPanel;