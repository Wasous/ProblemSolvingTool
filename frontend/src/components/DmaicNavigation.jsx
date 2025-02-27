import React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { FaCheckCircle } from 'react-icons/fa';

const DmaicNavigation = ({
    stages,
    currentStage,
    setCurrentStage,
    completionPercentage,
    leftPanelOpen = false
}) => {
    // Find the index of the current stage for defaultValue
    const stageNames = stages.map(stage => stage.name);

    return (
        <div
            className={`
                sticky top-16 w-full bg-white border-b border-gray-100 shadow-sm z-30
                transition-all duration-150
                ${leftPanelOpen ? 'ml-[352px]' : 'ml-0 sm:ml-16'}
            `}
            style={{
                width: leftPanelOpen ? 'calc(100% - 352px)' : 'calc(100% - 0px)',
            }}
        >
            <div className="max-w-full px-2 sm:px-4 py-3">
                {/* Progress bar */}
                <div className="h-1 w-full bg-gray-200 mb-4 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-300 ease-in-out"
                        style={{ width: `${completionPercentage}%` }}
                    />
                </div>

                {/* Radix Tabs for DMAIC navigation */}
                <Tabs.Root
                    value={currentStage}
                    onValueChange={(value) => {
                        // Only change if the stage is started
                        const stage = stages.find(s => s.name === value);
                        if (stage && stage.started) {
                            setCurrentStage(value);
                        }
                    }}
                    className="w-full"
                >
                    <Tabs.List
                        className="flex justify-start sm:justify-center overflow-x-auto pb-1 hide-scrollbar"
                        aria-label="DMAIC process stages"
                    >
                        <div className="flex gap-1 sm:gap-3 md:gap-5 mx-auto">
                            {stages.map((stage) => (
                                <Tabs.Trigger
                                    key={stage.name}
                                    value={stage.name}
                                    disabled={!stage.started}
                                    className={`
                                        relative flex items-center justify-center
                                        whitespace-nowrap
                                        px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium
                                        transition-all duration-200
                                        data-[state=active]:text-indigo-600 data-[state=active]:font-semibold
                                        data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                                        rounded-none
                                        ${!stage.started ? 'text-indigo-400' :
                                            stage.completed ? 'text-indigo-700' : 'text-indigo-500'}
                                    `}
                                >
                                    {/* Stage name */}
                                    <span>{stage.name}</span>

                                    {/* Active indicator - automatically shown by Radix */}
                                    {stage.name === currentStage && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full" />
                                    )}

                                    {/* Completed indicator - Improved version */}
                                    {stage.completed && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4 text-green-500 flex-shrink-0"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </Tabs.Trigger>
                            ))}
                        </div>
                    </Tabs.List>
                </Tabs.Root>
            </div>
        </div>
    );
};

export default DmaicNavigation;