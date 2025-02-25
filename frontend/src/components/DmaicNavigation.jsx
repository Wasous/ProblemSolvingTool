import React from 'react';
import { FaCheck } from 'react-icons/fa';

const DmaicNavigation = ({
    stages,
    currentStage,
    setCurrentStage,
    completionPercentage
}) => {
    // Helper function to get shortened label for stages
    const getShortenedLabel = (stageName) => {
        return stageName[0]; // Just the first letter (D, M, A, I, C)
    };

    // Helper function to get stage tooltip text
    const getStageTooltip = (stage) => {
        if (stage.completed) return `${stage.name}: Completed`;
        if (stage.name === currentStage) return `${stage.name}: In Progress`;
        if (stage.started) return `${stage.name}: Started`;
        return `${stage.name}: Not Started`;
    };

    return (
        <div className="bg-white border-b border-gray-200 shadow-sm w-full py-4 z-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center">
                    {/* Progress Bar */}
                    <div className="w-full max-w-md mb-2 mx-auto">
                        <div className="relative pt-1">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                        Progress
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-blue-600">
                                        {completionPercentage}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                <div
                                    style={{ width: `${completionPercentage}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* DMAIC Pills */}
                    <div className="flex justify-center items-center space-x-4 sm:space-x-8">
                        {stages.map((stage, index) => (
                            <button
                                key={stage.name}
                                onClick={() => stage.started ? setCurrentStage(stage.name) : null}
                                disabled={!stage.started}
                                title={getStageTooltip(stage)}
                                className={`
                                    relative flex flex-col items-center justify-center 
                                    ${stage.started ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                                `}
                            >
                                {/* Connected line */}
                                {index > 0 && (
                                    <div
                                        className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full w-8 sm:w-12 h-0.5 
                                            ${stages[index - 1].completed ? 'bg-green-500' : 'bg-gray-300'}`}
                                        style={{ width: 'calc(100% + 16px)' }}
                                    ></div>
                                )}

                                {/* Circle with initial */}
                                <div
                                    className={`
                                        w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                                        text-base sm:text-lg font-bold transition-all duration-300
                                        ${stage.name === currentStage
                                            ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                            : stage.completed
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                        }
                                    `}
                                >
                                    {stage.completed ? <FaCheck className="w-5 h-5" /> : getShortenedLabel(stage.name)}
                                </div>

                                {/* Stage name */}
                                <span
                                    className={`
                                        mt-2 text-xs sm:text-sm font-medium
                                        ${stage.name === currentStage
                                            ? 'text-blue-700'
                                            : stage.completed
                                                ? 'text-green-700'
                                                : 'text-gray-500'
                                        }
                                    `}
                                >
                                    {stage.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DmaicNavigation;