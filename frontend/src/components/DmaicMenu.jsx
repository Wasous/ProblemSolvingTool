import PropTypes from 'prop-types';

const DmaicMenu = ({ stages, currentStage, setCurrentStage }) => {
    const handleStageClick = (stage) => {
        if (stage.started) {
            setCurrentStage(stage.name);
        }
    };

    const getStageStyles = (stage) => {
        if (stage.completed || (stage.started && currentStage === stage.name)) {
            return 'bg-purple-500 text-white hover:bg-purple-600';
        }
        if (stage.started) {
            return 'bg-purple-400 text-white hover:bg-purple-500';
        }
        return 'bg-slate-700 text-gray-400';
    };

    return (
        <div className="flex items-center gap-2 px-2">
            <div className="flex items-center gap-1">
                {stages.map((stage, index) => (
                    <button
                        key={stage.name}
                        onClick={() => handleStageClick(stage)}
                        disabled={!stage.started}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-md
                            transition-all duration-200 text-sm
                            ${getStageStyles(stage)}
                            ${stage.started ? 'cursor-pointer' : 'cursor-default'}
                        `}
                    >
                        <span className="w-4 h-4 flex items-center justify-center">
                            {stage.completed ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-sm">{index + 1}</span>
                            )}
                        </span>
                        <span className="font-medium">{stage.name}</span>
                    </button>
                ))}
            </div>
        </div>
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
    currentStage: PropTypes.string.isRequired,
    setCurrentStage: PropTypes.func.isRequired,
};

export default DmaicMenu;