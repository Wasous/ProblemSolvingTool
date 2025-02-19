import React from 'react';
import { FaCheck } from 'react-icons/fa';

const DmaicNavigation = ({
    stages,
    currentStage,
    setCurrentStage,
    completionPercentage
}) => {
    return (
        <div className="mt-16 bg-white border-b border-gray-200 shadow-sm w-full">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                        {stages.map((stage, index) => (
                            <button
                                key={index}
                                onClick={() => stage.started ? setCurrentStage(stage.name) : null}
                                disabled={!stage.started}
                                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${currentStage === stage.name
                                        ? 'bg-blue-600 text-white'
                                        : stage.completed
                                            ? 'bg-green-100 text-green-800'
                                            : stage.started
                                                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {stage.completed && <FaCheck className="inline mr-2" />}
                                {stage.name}
                            </button>
                        ))}
                    </div>

                    <div className="hidden sm:flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                        <span className="text-sm text-gray-600">{completionPercentage}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DmaicNavigation;