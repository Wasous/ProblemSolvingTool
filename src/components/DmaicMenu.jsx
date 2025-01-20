import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const DmaicMenu = ({ stages, currentStage, setCurrentStage }) => {
    // Manejar cambio de stage
    const handleStageClick = (stage) => {
        if (stage.started) {
            setCurrentStage(stage.name);
        }
    };

    return (
        <nav
            className="flex bg-gray-50 text-gray-700 border border-gray-200 py-3 px-5 rounded-lg dark:bg-gray-800 dark:border-gray-700"
            aria-label="Breadcrumb"
        >
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                {stages.map((stage, index) => (
                    <li
                        key={stage.name}
                        className={`inline-flex items-center ${index > 0 ? 'before:content-["/"] before:mx-2 before:text-gray-400' : ''
                            }`}
                    >
                        {stage.completed ? (
                            <button
                                onClick={() => handleStageClick(stage)}
                                className={`text-sm font-medium ${currentStage === stage.name
                                    ? 'bg-blue-200'
                                    : 'text-blue-600 hover:text-blue-800'
                                    }`}
                            >
                                {stage.name}
                            </button>
                        ) : stage.started ? (
                            <button
                                onClick={() => handleStageClick(stage)}
                                className={`text-sm font-medium ${currentStage === stage.name
                                    ? 'bg-green-100'
                                    : 'text-sm text-greenText hover:text-greenTextHover font-medium'}`}
                            >
                                {stage.name}
                            </button>
                        ) : (
                            <span className="text-sm text-gray-400">{stage.name}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};

DmaicMenu.propTypes = {
    stages: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            started: PropTypes.bool.isRequired,
            completed: PropTypes.bool.isRequired,
        })
    ).isRequired,
};

export default DmaicMenu;
