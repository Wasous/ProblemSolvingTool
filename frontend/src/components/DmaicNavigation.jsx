import React from 'react';

const DmaicNavigation = ({
    stages,
    currentStage,
    setCurrentStage,
    completionPercentage
}) => {
    return (
        <div className="sticky top-16 w-full bg-white border-b border-gray-100 shadow-sm z-30">
            <div className="max-w-3xl mx-auto px-4 py-3">
                {/* Progress bar */}
                <div className="h-1 w-full bg-gray-200 mb-4 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>

                {/* Stage buttons */}
                <div className="flex justify-center gap-5 mx-auto">
                    {stages.map((stage) => (
                        <button
                            key={stage.name}
                            onClick={() => stage.started ? setCurrentStage(stage.name) : null}
                            disabled={!stage.started}
                            className={`
                                relative flex items-center justify-center
                                px-1 py-2 text-sm font-medium
                                transition-all duration-200
                                disabled:opacity-40 disabled:cursor-not-allowed
                                focus:outline-none
                                ${stage.name === currentStage
                                    ? 'text-indigo-600'
                                    : stage.completed
                                        ? 'text-indigo-700'
                                        : 'text-indigo-400'
                                }
                            `}
                        >
                            {/* Stage name */}
                            <span className={`
                                text-s
                                ${stage.name === currentStage ? 'font-semibold' : 'font-medium'}
                            `}>
                                {stage.name}
                            </span>

                            {/* Active indicator - only show for current stage */}
                            {stage.name === currentStage && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
                            )}

                            {/* Completed indicator */}
                            {stage.completed && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DmaicNavigation;